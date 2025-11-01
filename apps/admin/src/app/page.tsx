'use client';

/**
 * @fileoverview Admin dashboard page
 */

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    } else {
      setAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  if (!authenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-bg-primary p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-text-primary">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/invites" className="bg-bg-elevated rounded-lg shadow p-6 hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-2 text-text-primary">Manage Invites</h2>
            <p className="text-text-secondary">View and send user invites</p>
          </Link>

          <div className="bg-bg-elevated rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-2 text-text-primary">Statistics</h2>
            <p className="text-text-secondary">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
