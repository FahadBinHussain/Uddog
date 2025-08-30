export default function InvestorsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Invest in the Future of Crowdfunding
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us in revolutionizing how people raise funds for their dreams, causes, and innovations.
            Be part of a platform that empowers communities worldwide.
          </p>
        </div>

        {/* Investment Opportunity */}
        <div className="bg-white shadow-sm rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Investment Opportunity
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-4">Series A Funding Round</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="font-medium mr-2">Target:</span>
                  <span>$10M - $15M</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">Valuation:</span>
                  <span>$50M - $75M</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">Use of Funds:</span>
                  <span>Platform expansion, team growth, marketing</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">Timeline:</span>
                  <span>Open until Q2 2024</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-4">Why Invest in Uddog?</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Growing market with $5B+ annual volume</li>
                <li>• Proven business model with recurring revenue</li>
                <li>• Strong user growth and engagement metrics</li>
                <li>• Experienced team with track record</li>
                <li>• Clear path to profitability</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">1M+</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">$50M+</div>
            <div className="text-gray-600">Funds Raised</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">15K+</div>
            <div className="text-gray-600">Successful Campaigns</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
        </div>

        {/* Market Opportunity */}
        <div className="bg-white shadow-sm rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Market Opportunity
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-4">Market Size</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Global crowdfunding market: $13.9B (2023)</li>
                <li>• Expected CAGR: 16.8% through 2030</li>
                <li>• Projected market size: $39.8B by 2030</li>
                <li>• Reward-based crowdfunding: Fastest growing segment</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-4">Our Advantage</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Lower platform fees than competitors</li>
                <li>• Advanced fraud detection and prevention</li>
                <li>• AI-powered campaign optimization</li>
                <li>• Strong community engagement features</li>
                <li>• Global reach with local payment methods</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Financial Projections */}
        <div className="bg-white shadow-sm rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Financial Projections
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Metric</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">2024</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">2025</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">2026</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 text-gray-600">Revenue</td>
                  <td className="py-3 px-4 text-right text-gray-600">$8M</td>
                  <td className="py-3 px-4 text-right text-gray-600">$20M</td>
                  <td className="py-3 px-4 text-right text-gray-600">$45M</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 text-gray-600">Gross Margin</td>
                  <td className="py-3 px-4 text-right text-gray-600">75%</td>
                  <td className="py-3 px-4 text-right text-gray-600">78%</td>
                  <td className="py-3 px-4 text-right text-gray-600">82%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 text-gray-600">Active Users</td>
                  <td className="py-3 px-4 text-right text-gray-600">2.5M</td>
                  <td className="py-3 px-4 text-right text-gray-600">5M</td>
                  <td className="py-3 px-4 text-right text-gray-600">10M</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-600">EBITDA Margin</td>
                  <td className="py-3 px-4 text-right text-gray-600">-15%</td>
                  <td className="py-3 px-4 text-right text-gray-600">12%</td>
                  <td className="py-3 px-4 text-right text-gray-600">25%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white shadow-sm rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Leadership Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-800">Jane Smith</h3>
              <p className="text-gray-600 mb-2">CEO & Co-Founder</p>
              <p className="text-sm text-gray-500">Former VP at PayPal, 15+ years fintech experience</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-800">John Doe</h3>
              <p className="text-gray-600 mb-2">CTO & Co-Founder</p>
              <p className="text-sm text-gray-500">Former Lead Engineer at Stripe, MIT Computer Science</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-800">Sarah Johnson</h3>
              <p className="text-gray-600 mb-2">Head of Growth</p>
              <p className="text-sm text-gray-500">Former Growth Lead at Airbnb, Stanford MBA</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Interested in Learning More?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We're always looking for strategic partners and investors who share our vision.
            Get in touch to discuss investment opportunities and receive our detailed pitch deck.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors">
              Request Pitch Deck
            </button>
            <button className="w-full sm:w-auto border border-blue-600 text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors">
              Schedule Meeting
            </button>
          </div>
          <div className="mt-6 pt-6 border-t border-blue-100">
            <p className="text-sm text-gray-500">
              For investor inquiries: <a href="mailto:investors@uddog.com" className="text-blue-600 hover:underline">investors@uddog.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
