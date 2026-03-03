CREATE TABLE `jobber_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`accessToken` text NOT NULL,
	`refreshToken` text NOT NULL,
	`expiresAt` bigint NOT NULL,
	`createdAt` bigint NOT NULL,
	`updatedAt` bigint NOT NULL,
	CONSTRAINT `jobber_tokens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `demo_links` ADD `jobberSynced` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `demo_links` ADD `jobberClientId` varchar(255);--> statement-breakpoint
ALTER TABLE `demo_links` ADD `jobberQuoteId` varchar(255);