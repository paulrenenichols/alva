/**
 * @fileoverview Marketing landing page component for promotional content
 */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your AI Marketing Assistant
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Get a personalized marketing plan in minutes, not months
          </p>
          <div className="max-w-md mx-auto">
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
              <button
                type="submit"
                className="bg-orange-500 text-white px-6 py-2 rounded-lg"
              >
                Get Started
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
