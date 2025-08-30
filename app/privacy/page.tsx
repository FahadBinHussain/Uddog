export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Privacy Policy
          </h1>

          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <p className="text-gray-600 mb-6">
              At Uddog Inc. ("we", "our", or "us"), we respect your privacy and are committed to protecting
              your personal data. This Privacy Policy explains how we collect, use, and safeguard your
              information when you use our crowdfunding platform.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                1. Information We Collect
              </h2>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Personal Information</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-600">
                  <li>Name, email address, and contact information</li>
                  <li>Payment information (processed securely through third parties)</li>
                  <li>Profile information and photos</li>
                  <li>Identity verification documents when required</li>
                  <li>Communication preferences</li>
                </ul>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Campaign and Transaction Data</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-600">
                  <li>Campaign content, descriptions, and media</li>
                  <li>Contribution amounts and frequency</li>
                  <li>Transaction history and payment methods</li>
                  <li>Communication between campaign creators and contributors</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Technical Information</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-600">
                  <li>IP address and device information</li>
                  <li>Browser type and operating system</li>
                  <li>Usage patterns and site navigation</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Log files and error reports</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                2. How We Use Your Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Platform Operations</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-600">
                    <li>Process campaigns and contributions</li>
                    <li>Facilitate communication between users</li>
                    <li>Verify user identity and prevent fraud</li>
                    <li>Provide customer support</li>
                    <li>Send transactional notifications</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Platform Improvement</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-600">
                    <li>Analyze usage patterns and trends</li>
                    <li>Develop new features and services</li>
                    <li>Personalize user experience</li>
                    <li>Conduct research and analytics</li>
                    <li>Improve security and performance</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                3. Legal Basis for Processing (GDPR)
              </h2>
              <p className="text-gray-600 mb-4">
                We process your personal data based on the following legal grounds:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Contract:</strong> To provide our services and fulfill our obligations to you</li>
                <li><strong>Legitimate Interest:</strong> To improve our platform, prevent fraud, and ensure security</li>
                <li><strong>Consent:</strong> For marketing communications and optional features</li>
                <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                4. Information Sharing and Disclosure
              </h2>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-700 mb-3">We Share Information With:</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li><strong>Service Providers:</strong> Payment processors, hosting services, and analytics providers</li>
                  <li><strong>Other Users:</strong> Campaign information is public; contributor information may be shared with campaign creators</li>
                  <li><strong>Legal Authorities:</strong> When required by law or to protect our rights and safety</li>
                  <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 font-medium mb-2">We Do Not:</p>
                <ul className="list-disc pl-6 space-y-1 text-blue-700">
                  <li>Sell your personal information to third parties</li>
                  <li>Share your payment information beyond necessary processing</li>
                  <li>Use your data for unrelated commercial purposes without consent</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                5. Data Security
              </h2>
              <p className="text-gray-600 mb-4">
                We implement comprehensive security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure payment processing through PCI-compliant providers</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication systems</li>
                <li>Employee training on data protection practices</li>
                <li>Incident response and breach notification procedures</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                6. Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar technologies to enhance your experience:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Essential Cookies</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-600">
                    <li>Authentication and security</li>
                    <li>Site functionality and navigation</li>
                    <li>Form submission and data storage</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Optional Cookies</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-600">
                    <li>Analytics and performance monitoring</li>
                    <li>Personalization and preferences</li>
                    <li>Marketing and advertising</li>
                  </ul>
                </div>
              </div>
              <p className="text-gray-600 mt-4">
                You can control cookie preferences through your browser settings or our cookie consent tool.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                7. Your Privacy Rights
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">All Users</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-600">
                    <li>Access your personal data</li>
                    <li>Update or correct information</li>
                    <li>Delete your account and data</li>
                    <li>Control communication preferences</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">EU/UK Residents (GDPR)</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-600">
                    <li>Data portability</li>
                    <li>Restriction of processing</li>
                    <li>Right to object</li>
                    <li>Withdraw consent</li>
                  </ul>
                </div>
              </div>
              <p className="text-gray-600 mt-4">
                To exercise these rights, contact us at privacy@uddog.com. We will respond within 30 days.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                8. Data Retention
              </h2>
              <p className="text-gray-600 mb-4">
                We retain your personal data only as long as necessary:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Active accounts:</strong> While your account remains active</li>
                <li><strong>Transaction records:</strong> 7 years for legal and tax purposes</li>
                <li><strong>Marketing data:</strong> Until you opt out or we no longer need it</li>
                <li><strong>Legal holds:</strong> Until legal matters are resolved</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                9. International Data Transfers
              </h2>
              <p className="text-gray-600 mb-4">
                We may transfer your data internationally with appropriate safeguards:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li>Adequacy decisions by relevant authorities</li>
                <li>Standard Contractual Clauses (SCCs)</li>
                <li>Binding Corporate Rules where applicable</li>
                <li>Your explicit consent when required</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                10. Children's Privacy
              </h2>
              <p className="text-gray-600">
                Our platform is not intended for children under 18. We do not knowingly collect
                personal information from children. If you become aware that a child has provided
                us with personal information, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                11. Third-Party Links and Services
              </h2>
              <p className="text-gray-600">
                Our platform may contain links to third-party websites and services. This Privacy
                Policy does not apply to those external sites. We encourage you to review their
                privacy policies before providing any personal information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                12. California Privacy Rights (CCPA)
              </h2>
              <p className="text-gray-600 mb-4">
                California residents have additional rights under the CCPA:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li>Right to know what personal information is collected</li>
                <li>Right to delete personal information</li>
                <li>Right to opt-out of sale of personal information</li>
                <li>Right to non-discrimination for exercising privacy rights</li>
              </ul>
              <p className="text-gray-600 mt-4">
                Note: We do not sell personal information as defined by the CCPA.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                13. Changes to This Privacy Policy
              </h2>
              <p className="text-gray-600">
                We may update this Privacy Policy periodically. We will notify you of significant
                changes by email or through our platform. Your continued use of our services after
                changes indicates your acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                14. Contact Us
              </h2>
              <p className="text-gray-600 mb-4">
                If you have questions about this Privacy Policy or our data practices:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-600">
                  <strong>Privacy Officer:</strong> privacy@uddog.com<br/>
                  <strong>Mail:</strong> Privacy Team, Uddog Inc., [Your Company Address]<br/>
                  <strong>Phone:</strong> [Your Privacy Team Phone]<br/>
                  <strong>Response Time:</strong> Within 30 days
                </p>
              </div>
              <p className="text-gray-600 mt-4">
                For EU residents, you may also contact your local data protection authority.
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                This Privacy Policy is effective as of the last updated date and supersedes all
                prior versions. By using our platform, you acknowledge that you have read and
                understood this Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
