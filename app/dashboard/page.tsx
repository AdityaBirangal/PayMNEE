'use client';

import Header from '@/components/layout/Header';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useWallet } from '@/components/wallet/WalletProvider';
import { useActiveAccount } from 'thirdweb/react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading } = useWallet();
  const account = useActiveAccount();

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">Loading...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Wallet Info */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Wallet Information</h2>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Address:</span>{' '}
                      <span className="font-mono text-sm">{account?.address}</span>
                    </p>
                    {user && (
                      <p>
                        <span className="font-medium">Member since:</span>{' '}
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Pages */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Your Payment Pages</h2>
                    <Link
                      href="/dashboard/pages/new"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Create New Page
                    </Link>
                  </div>

                  {user?.paymentPages && user.paymentPages.length > 0 ? (
                    <div className="space-y-4">
                      {user.paymentPages.map((page) => (
                        <Link
                          key={page.id}
                          href={`/dashboard/pages/${page.id}`}
                          className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                          <h3 className="font-semibold">{page.title}</h3>
                          {page.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {page.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Created {new Date(page.createdAt).toLocaleDateString()}
                          </p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                      <p>No payment pages yet.</p>
                      <p className="text-sm mt-2">
                        Create your first payment page to start accepting payments!
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                      href="/dashboard/pages/new"
                      className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center"
                    >
                      <h3 className="font-semibold">Create Payment Page</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Set up a new page to accept payments
                      </p>
                    </Link>
                    {user?.walletAddress && (
                      <Link
                        href={`/pay/${user.walletAddress}`}
                        className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center"
                      >
                        <h3 className="font-semibold">View Public Page</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          See how your page looks to customers
                        </p>
                      </Link>
                    )}
                    <Link
                      href="/dashboard/test-verification"
                      className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center"
                    >
                      <h3 className="font-semibold">Test Verification</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Test blockchain payment verification
                      </p>
                    </Link>
                    <Link
                      href="/purchases"
                      className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center"
                    >
                      <h3 className="font-semibold">My Purchases</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        View all your purchased content
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
