export default function ReportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Report an Issue
          </h1>

          <div className="prose max-w-none mb-8">
            <p className="text-lg text-gray-600 mb-6">
              Help us maintain a safe and trustworthy platform by reporting any issues, violations, or concerns.
            </p>
          </div>

          <form className="space-y-6">
            <div>
              <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-2">
                Type of Report
              </label>
              <select
                id="reportType"
                name="reportType"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select report type</option>
                <option value="suspicious-campaign">Suspicious Campaign</option>
                <option value="fraud">Fraud or Scam</option>
                <option value="inappropriate-content">Inappropriate Content</option>
                <option value="harassment">Harassment or Bullying</option>
                <option value="copyright">Copyright Violation</option>
                <option value="spam">Spam</option>
                <option value="technical-issue">Technical Issue</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="campaignUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Campaign URL (if applicable)
              </label>
              <input
                type="url"
                id="campaignUrl"
                name="campaignUrl"
                placeholder="https://uddog.com/campaigns/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                required
                placeholder="Please provide as much detail as possible about the issue you're reporting..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="evidence" className="block text-sm font-medium text-gray-700 mb-2">
                Evidence (Screenshots, Links, etc.)
              </label>
              <input
                type="file"
                id="evidence"
                name="evidence"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Supported formats: Images, PDF, DOC, DOCX (Max 10MB per file)
              </p>
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Your Email (for follow-up)
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="anonymous"
                  name="anonymous"
                  type="checkbox"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="anonymous" className="font-medium text-gray-700">
                  Submit anonymously
                </label>
                <p className="text-gray-500">
                  Your identity will not be shared with the reported party
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Important:</strong> Please only submit genuine reports. False or malicious reports
                    may result in account suspension. All reports are reviewed by our moderation team.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Submit Report
              </button>
            </div>
          </form>

          <div className="mt-12 border-t pt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Other Ways to Contact Us
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Emergency Issues</h3>
                <p className="text-sm text-gray-600 mb-2">
                  For urgent safety concerns or immediate threats:
                </p>
                <p className="text-sm font-medium text-red-600">emergency@uddog.com</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">General Support</h3>
                <p className="text-sm text-gray-600 mb-2">
                  For general questions or technical support:
                </p>
                <p className="text-sm font-medium text-blue-600">support@uddog.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
