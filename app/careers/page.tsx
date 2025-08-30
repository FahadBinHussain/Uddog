export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Join Our Mission
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Help us build the future of crowdfunding. We're looking for passionate individuals
            who want to make a difference by empowering people to achieve their dreams.
          </p>
          <div className="bg-blue-600 text-white px-8 py-3 rounded-lg inline-block">
            We're hiring! Join our growing team
          </div>
        </div>

        {/* Company Culture */}
        <div className="bg-white shadow-sm rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Why Work at Uddog?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Make Impact</h3>
              <p className="text-gray-600">Your work directly helps people achieve their dreams and fund important causes.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Great Team</h3>
              <p className="text-gray-600">Work with talented, passionate people who care about what they do.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Growth</h3>
              <p className="text-gray-600">Continuous learning opportunities and career advancement in a fast-growing company.</p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white shadow-sm rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Benefits & Perks
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-4">Health & Wellness</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Comprehensive health, dental, and vision insurance</li>
                <li>• Mental health and wellness programs</li>
                <li>• Gym membership reimbursement</li>
                <li>• Flexible PTO policy</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-4">Work-Life Balance</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Remote-first culture</li>
                <li>• Flexible working hours</li>
                <li>• Parental leave</li>
                <li>• Company retreats and team events</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-4">Financial</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Competitive salary and equity</li>
                <li>• 401(k) with company matching</li>
                <li>• Professional development budget</li>
                <li>• Home office setup allowance</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-4">Growth</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Conference and training opportunities</li>
                <li>• Mentorship programs</li>
                <li>• Internal mobility and promotions</li>
                <li>• Innovation time for side projects</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Open Positions */}
        <div className="bg-white shadow-sm rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Open Positions
          </h2>
          <div className="space-y-6">
            {/* Engineering */}
            <div>
              <h3 className="text-2xl font-medium text-gray-700 mb-4">Engineering</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium text-gray-800">Senior Full Stack Engineer</h4>
                      <p className="text-gray-600 mt-1">Remote • Full-time</p>
                      <p className="text-gray-600 mt-2">
                        Join our core platform team to build scalable features that help millions of users raise funds for their projects.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">React</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Next.js</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Node.js</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">PostgreSQL</span>
                      </div>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium text-gray-800">DevOps Engineer</h4>
                      <p className="text-gray-600 mt-1">Remote • Full-time</p>
                      <p className="text-gray-600 mt-2">
                        Help us scale our infrastructure to support millions of users and billions in transaction volume.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">AWS</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Kubernetes</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Docker</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Terraform</span>
                      </div>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-2xl font-medium text-gray-700 mb-4">Product</h3>
              <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium text-gray-800">Senior Product Manager</h4>
                    <p className="text-gray-600 mt-1">Remote • Full-time</p>
                    <p className="text-gray-600 mt-2">
                      Lead product strategy and execution for our core fundraising platform and help define the future of crowdfunding.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Product Strategy</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">User Research</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Analytics</span>
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Marketing */}
            <div>
              <h3 className="text-2xl font-medium text-gray-700 mb-4">Marketing</h3>
              <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium text-gray-800">Growth Marketing Manager</h4>
                    <p className="text-gray-600 mt-1">Remote • Full-time</p>
                    <p className="text-gray-600 mt-2">
                      Drive user acquisition and engagement through data-driven marketing campaigns and growth experiments.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">Growth Hacking</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">SEO/SEM</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">Content Marketing</span>
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Application Process */}
        <div className="bg-white shadow-sm rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Our Hiring Process
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-semibold">
                1
              </div>
              <h3 className="font-medium text-gray-800 mb-2">Apply</h3>
              <p className="text-sm text-gray-600">Submit your application and we'll review it within 2-3 days</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-semibold">
                2
              </div>
              <h3 className="font-medium text-gray-800 mb-2">Screen</h3>
              <p className="text-sm text-gray-600">Initial phone/video call to get to know each other</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-semibold">
                3
              </div>
              <h3 className="font-medium text-gray-800 mb-2">Interview</h3>
              <p className="text-sm text-gray-600">Technical or role-specific interviews with team members</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-semibold">
                4
              </div>
              <h3 className="font-medium text-gray-800 mb-2">Offer</h3>
              <p className="text-sm text-gray-600">Reference checks and offer discussion</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Don't See Your Perfect Role?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We're always looking for talented people to join our team. If you think you'd be a great fit
            for Uddog, we'd love to hear from you even if we don't have an open position that matches your background.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors">
            Send Us Your Resume
          </button>
          <div className="mt-6 pt-6 border-t border-blue-100">
            <p className="text-sm text-gray-500">
              Questions about working at Uddog? Email us at: <a href="mailto:careers@uddog.com" className="text-blue-600 hover:underline">careers@uddog.com</a>
            </p>
          </div>
        </div>

        {/* Diversity Statement */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 max-w-3xl mx-auto">
            Uddog is an equal opportunity employer committed to diversity and inclusion. We welcome applications
            from all qualified candidates regardless of race, gender, sexual orientation, religion, nationality,
            age, disability, or any other legally protected status.
          </p>
        </div>
      </div>
    </div>
  );
}
