export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Accessibility Commitment
          </h1>

          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              At Uddog, we are committed to ensuring our platform is accessible to everyone,
              including people with disabilities. We strive to provide an inclusive experience
              that enables all users to participate in crowdfunding activities.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Our Accessibility Standards
              </h2>
              <p className="text-gray-600 mb-4">
                We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
                These guidelines help make web content more accessible to a wider range of people with disabilities.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Visual impairments including blindness, low vision, and color blindness</li>
                <li>Hearing impairments including deafness and hearing loss</li>
                <li>Motor impairments including difficulty using a mouse or keyboard</li>
                <li>Cognitive impairments including learning disabilities and memory issues</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Accessibility Features
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Visual Accessibility</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-600">
                    <li>High contrast color schemes</li>
                    <li>Scalable text up to 200%</li>
                    <li>Alternative text for images</li>
                    <li>Focus indicators for keyboard navigation</li>
                    <li>Screen reader compatible content</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Navigation & Interaction</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-600">
                    <li>Keyboard navigation support</li>
                    <li>Skip links to main content</li>
                    <li>Consistent navigation structure</li>
                    <li>Clear headings and labels</li>
                    <li>Logical tab order</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Keyboard Navigation
              </h2>
              <p className="text-gray-600 mb-4">
                Our platform can be fully navigated using only a keyboard. Here are the main shortcuts:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Key</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-3 text-gray-600 font-mono">Tab</td>
                      <td className="py-2 px-3 text-gray-600">Navigate forward through interactive elements</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-3 text-gray-600 font-mono">Shift + Tab</td>
                      <td className="py-2 px-3 text-gray-600">Navigate backward through interactive elements</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-3 text-gray-600 font-mono">Enter</td>
                      <td className="py-2 px-3 text-gray-600">Activate buttons and links</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-3 text-gray-600 font-mono">Space</td>
                      <td className="py-2 px-3 text-gray-600">Activate buttons and checkboxes</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-gray-600 font-mono">Esc</td>
                      <td className="py-2 px-3 text-gray-600">Close modals and dropdown menus</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Screen Reader Support
              </h2>
              <p className="text-gray-600 mb-4">
                We test our platform with popular screen readers including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>NVDA (Windows)</li>
                <li>JAWS (Windows)</li>
                <li>VoiceOver (macOS and iOS)</li>
                <li>TalkBack (Android)</li>
              </ul>
              <p className="text-gray-600 mt-4">
                All interactive elements include appropriate ARIA labels and roles to ensure
                screen readers can properly announce their purpose and state.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Browser and Assistive Technology Support
              </h2>
              <p className="text-gray-600 mb-4">
                Our platform is designed to work with:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Browsers</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-600">
                    <li>Chrome (latest 2 versions)</li>
                    <li>Firefox (latest 2 versions)</li>
                    <li>Safari (latest 2 versions)</li>
                    <li>Edge (latest 2 versions)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Assistive Technologies</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-600">
                    <li>Screen readers</li>
                    <li>Voice recognition software</li>
                    <li>Switch navigation devices</li>
                    <li>Eye-tracking systems</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Accessibility Tools and Settings
              </h2>
              <p className="text-gray-600 mb-4">
                We provide several tools to help customize your experience:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Text size adjustment controls</li>
                <li>High contrast mode toggle</li>
                <li>Reduced motion settings</li>
                <li>Focus indicator customization</li>
                <li>Color blind friendly color schemes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Third-Party Content
              </h2>
              <p className="text-gray-600">
                While we strive to ensure all content on our platform is accessible, some
                third-party content (such as videos or documents uploaded by campaign creators)
                may not meet our accessibility standards. We encourage creators to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
                <li>Provide captions for videos</li>
                <li>Include alternative text for images</li>
                <li>Use clear, readable fonts and sufficient color contrast</li>
                <li>Structure content with proper headings</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Ongoing Improvement
              </h2>
              <p className="text-gray-600">
                Accessibility is an ongoing effort. We regularly:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
                <li>Conduct accessibility audits and testing</li>
                <li>Gather feedback from users with disabilities</li>
                <li>Train our development team on accessibility best practices</li>
                <li>Update our platform based on the latest accessibility guidelines</li>
                <li>Work with accessibility consultants and organizations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Feedback and Support
              </h2>
              <p className="text-gray-600 mb-4">
                We welcome your feedback on the accessibility of our platform. If you encounter
                any accessibility barriers or have suggestions for improvement, please contact us:
              </p>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Get in Touch</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <strong>Email:</strong> accessibility@uddog.com
                  </p>
                  <p className="text-gray-600">
                    <strong>Phone:</strong> 1-800-UDDOG-ACCESS
                  </p>
                  <p className="text-gray-600">
                    <strong>Mail:</strong> Accessibility Team, Uddog Inc., [Your Address]
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  We aim to respond to accessibility feedback within 2 business days.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Alternative Formats
              </h2>
              <p className="text-gray-600">
                If you need this accessibility statement or any other information on our
                website in a different format, please contact us. We can provide information in:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
                <li>Large print</li>
                <li>Audio format</li>
                <li>Braille</li>
                <li>Electronic format compatible with assistive technology</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Legal Information
              </h2>
              <p className="text-gray-600">
                We are committed to ensuring compliance with applicable accessibility laws,
                including the Americans with Disabilities Act (ADA), Section 508, and the
                Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
              </p>
              <p className="text-sm text-gray-500 mt-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
