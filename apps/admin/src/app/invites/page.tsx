'use client';

/**
 * @fileoverview Admin page for viewing and managing invites
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Invite {
  id: string;
  email: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  usedAt?: string;
}

export default function InvitesPage() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchInvites = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`http://localhost:3002/admin/invites?page=${page}&limit=20`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setInvites(data.invites || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch invites:', error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

  const handleResend = async (inviteId: string) => {
    try {
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`http://localhost:3002/admin/invites/${inviteId}/resend`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Invite resent successfully!');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to resend invite');
      }
    } catch {
      alert('Failed to resend invite');
    }
  };

  const getStatus = (invite: Invite) => {
    if (invite.usedAt) return 'Used';
    if (new Date(invite.expiresAt) < new Date()) return 'Expired';
    return 'Pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Used':
        return 'bg-green-100 text-green-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-bg-secondary text-text-primary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary p-8 flex items-center justify-center">
        <div>Loading invites...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-text-primary">Invite Management</h1>
          <Link
            href="/invites/new"
            className="bg-primary text-text-inverse px-6 py-2 rounded hover:bg-primary-hover"
          >
            Send New Invite
          </Link>
        </div>

        <div className="bg-bg-elevated rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-secondary">
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Created</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Expires</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invites.map((invite) => {
                const status = getStatus(invite);
                return (
                  <tr key={invite.id} className="border-b border-border-subtle hover:bg-bg-secondary">
                    <td className="px-6 py-4">{invite.email}</td>
                    <td className="px-6 py-4">
                      {new Date(invite.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(invite.expiresAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {status !== 'Used' && (
                        <button
                          onClick={() => handleResend(invite.id)}
                          className="text-primary hover:text-primary-hover"
                        >
                          Resend
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border rounded bg-bg-input text-text-primary border-border-default disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border rounded bg-bg-input text-text-primary border-border-default disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

