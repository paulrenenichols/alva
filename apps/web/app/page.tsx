// Force dynamic rendering to avoid prerender issues
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Welcome to Alva
        </h1>
        <p className="text-center text-gray-600 text-lg">
          Your AI-powered marketing assistant
        </p>
      </div>
    </main>
  );
}
