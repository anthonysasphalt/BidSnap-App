/**
 * Jobber API Service
 *
 * Handles OAuth token management and GraphQL API calls to Jobber.
 */

import { getJobberTokens, saveJobberTokens, deleteJobberTokens } from "./db";

const JOBBER_CLIENT_ID = process.env.JOBBER_CLIENT_ID || "";
const JOBBER_CLIENT_SECRET = process.env.JOBBER_CLIENT_SECRET || "";
const JOBBER_TOKEN_ENDPOINT = "https://api.getjobber.com/api/oauth/token";
const JOBBER_GRAPHQL_ENDPOINT = "https://api.getjobber.com/api/graphql";
const JOBBER_GRAPHQL_VERSION = "2023-11-15";

// ==================== Token Management ====================

interface JobberTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type?: string;
  expires_in?: number;
}

/**
 * Exchange an authorization code for access and refresh tokens.
 */
export async function exchangeCodeForTokens(
  code: string,
  redirectUri: string
): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
  console.log("[Jobber] Exchanging authorization code for tokens...");

  const response = await fetch(JOBBER_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: JOBBER_CLIENT_ID,
      client_secret: JOBBER_CLIENT_SECRET,
      redirect_uri: redirectUri,
    }).toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Jobber] Token exchange failed:", response.status, errorText);
    throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
  }

  const data: JobberTokenResponse = await response.json();

  // Default expiry is 60 minutes (3600 seconds) per Jobber docs
  const expiresIn = data.expires_in || 3600;

  console.log("[Jobber] Token exchange successful, expires in", expiresIn, "seconds");

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn,
  };
}

/**
 * Refresh the access token using the stored refresh token.
 */
async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}> {
  console.log("[Jobber] Refreshing access token...");

  const response = await fetch(JOBBER_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: JOBBER_CLIENT_ID,
      client_secret: JOBBER_CLIENT_SECRET,
    }).toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Jobber] Token refresh failed:", response.status, errorText);
    throw new Error(`Token refresh failed: ${response.status} ${errorText}`);
  }

  const data: JobberTokenResponse = await response.json();
  const expiresIn = data.expires_in || 3600;

  console.log("[Jobber] Token refresh successful, expires in", expiresIn, "seconds");

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn,
  };
}

/**
 * Get a valid access token, refreshing if necessary.
 * Returns null if no tokens are stored (not connected).
 */
export async function getValidAccessToken(): Promise<string | null> {
  try {
    const tokens = await getJobberTokens();
    if (!tokens) {
      console.log("[Jobber] No tokens found in database");
      return null;
    }

    const now = Date.now();

    // If token is still valid, return it
    if (now < tokens.expiresAt) {
      return tokens.accessToken;
    }

    // Token expired, refresh it
    console.log("[Jobber] Access token expired, refreshing...");
    const refreshed = await refreshAccessToken(tokens.refreshToken);

    // Save the new tokens
    await saveJobberTokens(
      refreshed.accessToken,
      refreshed.refreshToken,
      refreshed.expiresIn
    );

    return refreshed.accessToken;
  } catch (error) {
    console.error("[Jobber] Failed to get valid access token:", error);
    return null;
  }
}

// ==================== GraphQL API ====================

interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{ message: string; path?: string[] }>;
}

/**
 * Execute a GraphQL query/mutation against the Jobber API.
 */
async function jobberGraphQL<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    throw new Error("Jobber is not connected. Please connect via OAuth first.");
  }

  const response = await fetch(JOBBER_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      "X-JOBBER-GRAPHQL-VERSION": JOBBER_GRAPHQL_VERSION,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 401) {
    // Token might have been invalidated; clear stored tokens
    console.error("[Jobber] 401 Unauthorized — tokens may be invalid");
    await deleteJobberTokens();
    throw new Error("Jobber authorization expired. Please reconnect.");
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Jobber] GraphQL request failed:", response.status, errorText);
    throw new Error(`Jobber API error: ${response.status}`);
  }

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors && result.errors.length > 0) {
    const errorMessages = result.errors.map((e) => e.message).join("; ");
    console.error("[Jobber] GraphQL errors:", errorMessages);
    throw new Error(`Jobber GraphQL error: ${errorMessages}`);
  }

  return result.data as T;
}

// ==================== Client Operations ====================

interface JobberClientCreateResult {
  clientCreate: {
    client: {
      id: string;
      firstName: string;
      lastName: string;
    } | null;
    userErrors: Array<{ message: string; path: string[] }>;
  };
}

export interface CreateClientInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  companyName?: string;
  street1?: string;
  street2?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
}

/**
 * Create a client in Jobber.
 */
export async function createJobberClient(
  input: CreateClientInput
): Promise<{ clientId: string; firstName: string; lastName: string }> {
  const emails = input.email
    ? `emails: [{ description: MAIN, primary: true, address: "${input.email}" }]`
    : "";

  const phones = input.phone
    ? `phones: [{ description: MAIN, primary: true, number: "${input.phone}" }]`
    : "";

  const companyName = input.companyName
    ? `companyName: "${input.companyName.replace(/"/g, '\\"')}"`
    : "";

  // Build billing address if any address fields provided
  let billingAddress = "";
  if (input.street1 || input.city || input.province || input.postalCode) {
    const addressParts: string[] = [];
    if (input.street1) addressParts.push(`street1: "${input.street1.replace(/"/g, '\\"')}"`);
    if (input.street2) addressParts.push(`street2: "${input.street2.replace(/"/g, '\\"')}"`);
    if (input.city) addressParts.push(`city: "${input.city.replace(/"/g, '\\"')}"`);
    if (input.province) addressParts.push(`province: "${input.province.replace(/"/g, '\\"')}"`);
    if (input.postalCode) addressParts.push(`postalCode: "${input.postalCode.replace(/"/g, '\\"')}"`);
    if (input.country) addressParts.push(`country: "${input.country.replace(/"/g, '\\"')}"`);
    billingAddress = `billingAddress: { ${addressParts.join(", ")} }`;
  }

  const mutation = `
    mutation CreateClient {
      clientCreate(
        input: {
          firstName: "${input.firstName.replace(/"/g, '\\"')}"
          lastName: "${input.lastName.replace(/"/g, '\\"')}"
          ${companyName}
          ${emails}
          ${phones}
          ${billingAddress}
        }
      ) {
        client {
          id
          firstName
          lastName
        }
        userErrors {
          message
          path
        }
      }
    }
  `;

  const data = await jobberGraphQL<JobberClientCreateResult>(mutation);

  if (data.clientCreate.userErrors.length > 0) {
    const errors = data.clientCreate.userErrors.map((e) => e.message).join("; ");
    throw new Error(`Failed to create Jobber client: ${errors}`);
  }

  if (!data.clientCreate.client) {
    throw new Error("Failed to create Jobber client: no client returned");
  }

  return {
    clientId: data.clientCreate.client.id,
    firstName: data.clientCreate.client.firstName,
    lastName: data.clientCreate.client.lastName,
  };
}

// ==================== Quote Operations ====================

interface JobberQuoteCreateResult {
  quoteCreate: {
    quote: {
      id: string;
      quoteNumber: string;
    } | null;
    userErrors: Array<{ message: string; path: string[] }>;
  };
}

export interface QuoteLineItem {
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number; // in dollars (will be converted to cents for API)
}

export interface CreateQuoteInput {
  clientId: string;
  title?: string;
  lineItems: QuoteLineItem[];
  message?: string;
}

/**
 * Create a quote in Jobber.
 */
export async function createJobberQuote(
  input: CreateQuoteInput
): Promise<{ quoteId: string; quoteNumber: string }> {
  // Build line items string for the GraphQL mutation
  const lineItemsStr = input.lineItems
    .map((item) => {
      const desc = item.description
        ? `description: "${item.description.replace(/"/g, '\\"')}"`
        : "";
      return `{
        name: "${item.name.replace(/"/g, '\\"')}"
        ${desc}
        quantity: ${item.quantity}
        unitPrice: ${item.unitPrice}
      }`;
    })
    .join(",\n");

  const title = input.title
    ? `title: "${input.title.replace(/"/g, '\\"')}"`
    : "";

  const message = input.message
    ? `message: "${input.message.replace(/"/g, '\\"')}"`
    : "";

  const mutation = `
    mutation CreateQuote {
      quoteCreate(
        input: {
          clientId: "${input.clientId}"
          ${title}
          ${message}
          lineItems: [${lineItemsStr}]
        }
      ) {
        quote {
          id
          quoteNumber
        }
        userErrors {
          message
          path
        }
      }
    }
  `;

  const data = await jobberGraphQL<JobberQuoteCreateResult>(mutation);

  if (data.quoteCreate.userErrors.length > 0) {
    const errors = data.quoteCreate.userErrors.map((e) => e.message).join("; ");
    throw new Error(`Failed to create Jobber quote: ${errors}`);
  }

  if (!data.quoteCreate.quote) {
    throw new Error("Failed to create Jobber quote: no quote returned");
  }

  return {
    quoteId: data.quoteCreate.quote.id,
    quoteNumber: data.quoteCreate.quote.quoteNumber,
  };
}

// ==================== Connection Status ====================

interface JobberAccountResult {
  account: {
    id: string;
    name: string;
  };
}

/**
 * Check if the Jobber connection is active by querying the account.
 */
export async function checkJobberConnection(): Promise<{
  connected: boolean;
  accountName?: string;
  accountId?: string;
}> {
  try {
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
      return { connected: false };
    }

    const query = `
      query CheckConnection {
        account {
          id
          name
        }
      }
    `;

    const data = await jobberGraphQL<JobberAccountResult>(query);

    return {
      connected: true,
      accountName: data.account.name,
      accountId: data.account.id,
    };
  } catch (error) {
    console.error("[Jobber] Connection check failed:", error);
    return { connected: false };
  }
}

/**
 * Disconnect from Jobber by calling the appDisconnect mutation and clearing tokens.
 */
export async function disconnectJobber(): Promise<void> {
  try {
    const accessToken = await getValidAccessToken();
    if (accessToken) {
      // Try to call appDisconnect mutation to properly disconnect
      try {
        const mutation = `
          mutation Disconnect {
            appDisconnect {
              app {
                name
              }
              userErrors {
                message
              }
            }
          }
        `;
        await jobberGraphQL(mutation);
        console.log("[Jobber] appDisconnect mutation successful");
      } catch (err) {
        console.warn("[Jobber] appDisconnect mutation failed (continuing with local cleanup):", err);
      }
    }
  } catch (err) {
    console.warn("[Jobber] Error during disconnect:", err);
  }

  // Always clear local tokens
  await deleteJobberTokens();
  console.log("[Jobber] Disconnected and tokens cleared");
}
