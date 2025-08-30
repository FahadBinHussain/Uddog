export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            GDPR Compliance
          </h1>

          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              We are committed to protecting your privacy and ensuring compliance with the General Data Protection Regulation (GDPR).
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Your Rights Under GDPR
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Right to Access:</strong> You have the right to request access to your personal data.</li>
                <li><strong>Right to Rectification:</strong> You can request correction of inaccurate personal data.</li>
                <li><strong>Right to Erasure:</strong> You can request deletion of your personal data under certain circumstances.</li>
                <li><strong>Right to Restrict Processing:</strong> You can request restriction of processing of your personal data.</li>
                <li><strong>Right to Data Portability:</strong> You can request your data in a portable format.</li>
                <li><strong>Right to Object:</strong> You can object to processing of your personal data.</li>
                <li><strong>Right to Withdraw Consent:</strong> You can withdraw consent at any time where processing is based on consent.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Data We Collect
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Personal identification information (name, email address)</li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>Campaign and donation data</li>
                <li>Usage data and analytics (anonymized)</li>
                <li>Communication preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Legal Basis for Processing
              </h2>
              <p className="text-gray-600 mb-4">
                We process your personal data based on the following legal grounds:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Consent:</strong> For marketing communications and optional features</li>
                <li><strong>Contract:</strong> To provide our fundraising services</li>
                <li><strong>Legitimate Interest:</strong> For platform security and improvement</li>
                <li><strong>Legal Obligation:</strong> For compliance with applicable laws</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Data Protection Measures
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and assessments</li>
                <li>Access controls and authentication</li>
                <li>Staff training on data protection</li>
                <li>Regular backup and disaster recovery procedures</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                International Data Transfers
              </h2>
              <p className="text-gray-600">
                We may transfer your personal data to countries outside the European Economic Area (EEA)
                only when adequate safeguards are in place, such as Standard Contractual Clauses or
                adequacy decisions by the European Commission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Data Retention
              </h2>
              <p className="text-gray-600">
                We retain your personal data only for as long as necessary to fulfill the purposes
                for which it was collected, comply with legal obligations, resolve disputes, and
                enforce our agreements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Contact Our Data Protection Officer
              </h2>
              <p className="text-gray-600 mb-4">
                If you have questions about our GDPR compliance or wish to exercise your rights,
                please contact our Data Protection Officer:
              </p>
              <div className="bg-gray-100 p-4 rounded">
                <p className="text-gray-600">
                  Email: dpo@uddog.com<br/>
                  Address: [Your Company Address]<br/>
                  Response time: Within 30 days
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Complaints
              </h2>
              <p className="text-gray-600">
                If you believe we have not handled your personal data in accordance with GDPR,
                you have the right to lodge a complaint with your local supervisory authority.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Updates to This Policy
              </h2>
              <p className="text-gray-600">
                This GDPR compliance information may be updated from time to time. We will notify
                you of any significant changes via email or through our platform.
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
