import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPolicy() {
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
          <h1 className="text-lg font-semibold">Privacy Policy</h1>
          <div className="w-[100px]" />
        </div>
      </nav>

      {/* Content */}
      <main className="container max-w-3xl py-12 px-4">
        <div className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-2 text-primary">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: February 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">Introduction</h2>
            <p className="mb-4">
              BidSnap ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>
            <p className="mb-4">
              Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Personal Information You Provide</h3>
            <p className="mb-4">We collect information you voluntarily provide, including:</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li><strong>Contact Information:</strong> Email address, phone number, and name</li>
              <li><strong>Property Information:</strong> Property address, driveway measurements, and property details</li>
              <li><strong>Service Preferences:</strong> Information about the services you're interested in</li>
              <li><strong>Account Information:</strong> Login credentials and account preferences</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Automatically Collected Information</h3>
            <p className="mb-4">When you use our services, we automatically collect:</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li><strong>Device Information:</strong> Device type, operating system, and browser type</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent on pages, and interaction patterns</li>
              <li><strong>Location Data:</strong> General location information derived from IP address (not precise GPS)</li>
              <li><strong>Cookies and Tracking:</strong> Information collected through cookies and similar technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect for the following purposes:</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Providing instant pricing quotes for sealcoating services</li>
              <li>Processing and fulfilling service requests</li>
              <li>Communicating with you about your inquiry or service</li>
              <li>Improving and personalizing your experience</li>
              <li>Analyzing usage patterns to enhance our services</li>
              <li>Complying with legal obligations</li>
              <li>Preventing fraud and ensuring security</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">3. Third-Party Services</h2>
            <p className="mb-4">We use third-party services to provide and improve our services:</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Google Maps</h3>
            <p className="mb-4">
              We use Google Maps to help you locate your property and provide accurate measurements. Google Maps may collect location data and usage information. Please review Google's Privacy Policy for more information.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Jobber</h3>
            <p className="mb-4">
              We may integrate with Jobber to manage service scheduling and dispatch. If you authorize this integration, we will share relevant information with Jobber to facilitate service coordination. Please review Jobber's Privacy Policy for more information.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Analytics</h3>
            <p className="mb-4">
              We may use analytics services to understand how users interact with our platform. These services may collect anonymized usage data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">4. Data Retention</h2>
            <p className="mb-4">
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. You may request deletion of your information at any time by contacting us.
            </p>
            <p className="mb-4">
              Pricing quotes and service history may be retained for business purposes, including dispute resolution and service quality improvement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
            </p>
            <p className="mb-4">
              While we strive to protect your information, we cannot guarantee absolute security. You acknowledge the inherent security risks of transmitting information over the Internet.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">6. Your Privacy Rights</h2>
            <p className="mb-4">Depending on your location, you may have the following rights:</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li><strong>Right to Access:</strong> Request access to your personal information</li>
              <li><strong>Right to Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Right to Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Right to Opt-Out:</strong> Opt out of marketing communications</li>
            </ul>
            <p className="mb-4">
              To exercise any of these rights, please contact us at the information provided below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">7. Cookies and Tracking Technologies</h2>
            <p className="mb-4">
              We use cookies and similar tracking technologies to enhance your experience. Most web browsers allow you to control cookies through browser settings. Disabling cookies may affect the functionality of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">8. Children's Privacy</h2>
            <p className="mb-4">
              Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected information from a child under 13, we will take steps to delete such information promptly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mt-8 mb-4">9. Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by updating the "Last updated" date at the top of this policy.
            </p>
            <p className="mb-4">
              Your continued use of our services following the posting of revised Privacy Policy means that you accept and agree to the changes.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mt-8 mb-4">10. Contact Us</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy or our privacy practices, please contact us:
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
