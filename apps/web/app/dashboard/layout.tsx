export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-semibold">Alva Dashboard</h1>
            {/* Navigation will be implemented in Phase 2 */}
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
