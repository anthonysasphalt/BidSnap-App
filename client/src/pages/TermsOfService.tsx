import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Terms of Service</h1>
          <div className="w-[100px]" />
        </div>
      </nav>

      {/* Content */}
      <main className="container max-w-3xl py-12 px-4">
        <div className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-2 text-primary">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: February 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Agreement to Terms</h2>
            <p className="mb-4">
              By accessing and using the BidSnap website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">2. Service Description</h2>
            <p className="mb-4">
              BidSnap is an instant pricing tool for sealcoating services. Our service allows property owners to:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Submit property information and driveway measurements</li>
              <li>Receive instant pricing estimates for sealcoating services</li>
              <li>View service details and scheduling information</li>
              <li>Contact service providers for additional information</li>
            </ul>
            <p className="mb-4">
              BidSnap is provided on an "as-is" basis without warranties of any kind.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">3. Pricing Estimates Are Not Binding Contracts</h2>
            <p className="mb-4">
              <strong>Important:</strong> All pricing estimates provided through BidSnap are preliminary quotes only. They are not binding contracts or offers to perform services.
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Estimates are based on information you provide and satellite measurements</li>
              <li>Actual pricing may vary based on on-site inspection and conditions</li>
              <li>A service provider may adjust pricing after evaluating the property in person</li>
              <li>You are not obligated to accept any estimate or hire any service provider</li>
              <li>Service providers are not obligated to honor estimates if conditions differ significantly</li>
            </ul>
            <p className="mb-4">
              Final pricing and service terms will be determined through direct communication between you and the service provider.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">4. User Responsibilities</h2>
            <p className="mb-4">
              When using BidSnap, you agree to:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Provide accurate and truthful information about your property</li>
              <li>Ensure you have the authority to authorize work on the property</li>
              <li>Communicate honestly with service providers</li>
              <li>Not use the service for fraudulent or illegal purposes</li>
              <li>Not attempt to circumvent or manipulate the pricing system</li>
              <li>Respect the intellectual property rights of BidSnap and service providers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Measurement Accuracy</h2>
            <p className="mb-4">
              BidSnap uses satellite imagery and mapping technology to estimate property measurements. We make no warranty regarding the accuracy of these measurements.
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Satellite measurements may not account for obstacles, slopes, or irregular shapes</li>
              <li>Actual square footage may differ from satellite estimates</li>
              <li>Service providers may request on-site measurements before providing final pricing</li>
              <li>You are responsible for verifying measurements if accuracy is critical</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">6. Limitation of Liability</h2>
            <p className="mb-4">
              To the fullest extent permitted by law, BidSnap shall not be liable for:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, data, or business opportunities</li>
              <li>Inaccurate pricing estimates or measurement errors</li>
              <li>Service quality issues or disputes with service providers</li>
              <li>Delays or failures in service delivery</li>
              <li>Any damages resulting from your use of BidSnap or reliance on estimates</li>
            </ul>
            <p className="mb-4">
              Our total liability for any claim shall not exceed the amount you paid to BidSnap (if any).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">7. Disclaimer of Warranties</h2>
            <p className="mb-4">
              BidSnap is provided on an "AS IS" and "AS AVAILABLE" basis. We disclaim all warranties, express or implied, including:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Warranties of merchantability or fitness for a particular purpose</li>
              <li>Warranties of accuracy, reliability, or completeness</li>
              <li>Warranties that the service will be uninterrupted or error-free</li>
              <li>Warranties regarding service provider qualifications or performance</li>
            </ul>
            <p className="mb-4">
              You assume all risk associated with using BidSnap and any estimates provided.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">8. Intellectual Property Rights</h2>
            <p className="mb-4">
              All content on BidSnap, including text, graphics, logos, images, and software, is the property of BidSnap or its content suppliers and is protected by international copyright laws.
            </p>
            <p className="mb-4">
              You may not reproduce, distribute, or transmit any content without our prior written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">9. Third-Party Links and Services</h2>
            <p className="mb-4">
              BidSnap may contain links to third-party websites and services. We are not responsible for:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>The content or accuracy of third-party websites</li>
              <li>The practices or policies of third-party service providers</li>
              <li>Any transactions or agreements you make with third parties</li>
            </ul>
            <p className="mb-4">
              Your use of third-party services is subject to their terms and conditions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">10. Dispute Resolution</h2>
            <p className="mb-4">
              Any disputes arising from your use of BidSnap or these Terms of Service shall be resolved through:
            </p>
            <ol className="list-decimal list-inside mb-4 space-y-2">
              <li>Good faith negotiation between the parties</li>
              <li>If negotiation fails, binding arbitration in accordance with applicable law</li>
            </ol>
            <p className="mb-4">
              You agree to waive your right to a jury trial and class action proceedings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">11. Termination</h2>
            <p className="mb-4">
              BidSnap reserves the right to terminate or suspend your access to our services at any time, with or without cause, and without notice or liability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">12. Modification of Terms</h2>
            <p className="mb-4">
              BidSnap reserves the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting. Your continued use of BidSnap following any changes constitutes your acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">13. Governing Law</h2>
            <p className="mb-4">
              These Terms of Service are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts located therein.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">14. Severability</h2>
            <p className="mb-4">
              If any provision of these Terms of Service is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mt-8 mb-4">15. Contact Information</h2>
            <p className="mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 mb-4">
              <p className="mb-2">
                <strong>Email:</strong> <a href="mailto:anthony@bidsnap.com" className="text-primary hover:underline">anthony@bidsnap.com</a>
              </p>
              <p>
                <strong>Company:</strong> BidSnap
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              We will respond to your inquiry within 30 days of receipt.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
