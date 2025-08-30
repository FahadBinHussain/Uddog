export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Terms of Service
          </h1>

          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <p className="text-gray-600 mb-6">
              Welcome to Uddog. These Terms of Service ("Terms") govern your use of the Uddog platform
              and services provided by Uddog Inc. ("Company", "we", "our", or "us").
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600 mb-4">
                By accessing or using our platform, you agree to be bound by these Terms and our Privacy Policy.
                If you do not agree to these Terms, you may not access or use our services.
              </p>
              <p className="text-gray-600">
                We may modify these Terms at any time. Changes will be effective when posted on our platform.
                Your continued use constitutes acceptance of modified Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                2. Platform Description
              </h2>
              <p className="text-gray-600 mb-4">
                Uddog is a crowdfunding platform that allows users to create campaigns to raise funds for
                projects, causes, or personal needs, and allows others to contribute to those campaigns.
              </p>
              <p className="text-gray-600">
                We provide the technology platform but are not party to the agreements between campaign
                creators and contributors.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                3. User Accounts and Eligibility
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>You must be at least 18 years old to create an account</li>
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for maintaining account security</li>
                <li>One person may not maintain multiple accounts</li>
                <li>Accounts are non-transferable</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                4. Campaign Rules and Guidelines
              </h2>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Prohibited Campaigns</h3>
                <p className="text-gray-600 mb-2">Campaigns may not be created for:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-600">
                  <li>Illegal activities or products</li>
                  <li>Discriminatory or hateful content</li>
                  <li>Gambling, raffles, or contests</li>
                  <li>Investment opportunities or financial returns</li>
                  <li>Political campaigns or lobbying</li>
                  <li>Adult content or services</li>
                  <li>Misleading or fraudulent purposes</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Campaign Creator Responsibilities</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-600">
                  <li>Provide accurate and honest information</li>
                  <li>Use funds as described in the campaign</li>
                  <li>Communicate regularly with contributors</li>
                  <li>Fulfill any promised rewards or deliverables</li>
                  <li>Comply with applicable laws and regulations</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                5. Contributions and Payments
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>All contributions are voluntary</li>
                <li>Contributors are not purchasing products or services</li>
                <li>Contributions are generally non-refundable unless required by law</li>
                <li>Payment processing is handled by third-party providers</li>
                <li>We charge platform fees as disclosed during the contribution process</li>
                <li>Campaign creators are responsible for applicable taxes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                6. Fees and Payments
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Platform Fees</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-600">
                  <li>Platform fee: 5% of funds raised</li>
                  <li>Payment processing fees: 2.9% + $0.30 per transaction</li>
                  <li>Currency conversion fees may apply for international transactions</li>
                </ul>
              </div>
              <p className="text-gray-600">
                Fees are automatically deducted from campaign proceeds. Fee structures may change
                with reasonable notice to users.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                7. Intellectual Property
              </h2>
              <p className="text-gray-600 mb-4">
                You retain ownership of content you submit but grant us a license to use, display,
                and distribute it for platform operations and marketing purposes.
              </p>
              <p className="text-gray-600">
                You must not infringe on others' intellectual property rights. We may remove
                content that violates intellectual property rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                8. Privacy and Data Protection
              </h2>
              <p className="text-gray-600">
                Our collection and use of personal information is governed by our Privacy Policy,
                which is incorporated into these Terms by reference.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                9. Prohibited Conduct
              </h2>
              <p className="text-gray-600 mb-2">Users may not:</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li>Violate any applicable laws or regulations</li>
                <li>Impersonate others or provide false information</li>
                <li>Harass, threaten, or abuse other users</li>
                <li>Spam or send unsolicited communications</li>
                <li>Attempt to hack or disrupt platform operations</li>
                <li>Create fake campaigns or accounts</li>
                <li>Manipulate the platform's ranking or recommendation systems</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                10. Content Moderation and Enforcement
              </h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to review, remove, or restrict access to any content or campaign
                that violates these Terms or our community guidelines.
              </p>
              <p className="text-gray-600">
                We may suspend or terminate accounts for violations of these Terms. Serious violations
                may result in permanent bans and legal action.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                11. Disclaimers and Limitations of Liability
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                <p className="text-gray-700 font-medium mb-2">IMPORTANT LEGAL DISCLAIMERS</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-600 text-sm">
                  <li>The platform is provided "as is" without warranties</li>
                  <li>We do not guarantee campaign success or fund delivery</li>
                  <li>We are not responsible for disputes between users</li>
                  <li>Our liability is limited to the maximum extent permitted by law</li>
                </ul>
              </div>
              <p className="text-gray-600">
                Users participate at their own risk. We encourage due diligence before contributing
                to campaigns and recommend contributors only give what they can afford to lose.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                12. Indemnification
              </h2>
              <p className="text-gray-600">
                You agree to indemnify and hold us harmless from claims arising from your use of
                the platform, your campaigns, or your violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                13. Dispute Resolution
              </h2>
              <p className="text-gray-600 mb-4">
                Any disputes arising from these Terms will be resolved through binding arbitration
                in accordance with the rules of the American Arbitration Association.
              </p>
              <p className="text-gray-600">
                These Terms are governed by the laws of [Your State/Country], without regard to
                conflict of law principles.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                14. Termination
              </h2>
              <p className="text-gray-600 mb-4">
                Either party may terminate this agreement at any time. Upon termination:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li>Your access to the platform will cease</li>
                <li>Active campaigns may be suspended</li>
                <li>Outstanding funds will be processed according to our policies</li>
                <li>Certain provisions will survive termination</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                15. International Users
              </h2>
              <p className="text-gray-600">
                Our platform may not be available in all jurisdictions. International users are
                responsible for compliance with local laws and regulations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                16. Changes to Service
              </h2>
              <p className="text-gray-600">
                We may modify, suspend, or discontinue any aspect of our platform at any time.
                We will provide reasonable notice of material changes when possible.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                17. Contact Information
              </h2>
              <p className="text-gray-600 mb-4">
                If you have questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-600">
                  <strong>Email:</strong> legal@uddog.com<br/>
                  <strong>Mail:</strong> Legal Department, Uddog Inc., [Your Company Address]<br/>
                  <strong>Phone:</strong> [Your Legal Department Phone]
                </p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                By using our platform, you acknowledge that you have read, understood, and agree
                to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
