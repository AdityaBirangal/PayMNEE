'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useWallet } from '@/components/wallet/WalletProvider';
import { useActiveAccount } from 'thirdweb/react';
import Link from 'next/link';
import { formatTokenAmount } from '@/lib/blockchain';
import { shortenAddress } from '@/lib/wallet';
import Skeleton from '@/components/ui/Skeleton';

interface Analytics {
  success: boolean;
  summary: {
    totalAmount: string;
    totalPayments: number;
    totalPages: number;
    totalItems: number;
  };
  pageStats: Array<{
    pageId: string;
    pageTitle: string;
    totalAmount: string;
    totalPayments: number;
    items: Array<{
      itemId: string;
      itemTitle: string;
      totalAmount: string;
      totalPayments: number;
      payments: Array<{
        id: string;
        txHash: string;
        amount: string;
        payerWallet: string;
        createdAt: string;
      }>;
    }>;
  }>;
  transactionHistory: Array<{
    id: string;
    txHash: string;
    amount: string;
    payerWallet: string;
    createdAt: string;
    item: {
      id: string;
      title: string;
      page: {
        id: string;
        title: string;
      };
    };
  }>;
}

export default function DashboardPage() {
  const { user, loading } = useWallet();
  const account = useActiveAccount();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!account?.address) {
        setAnalytics(null);
        return;
      }

      setAnalyticsLoading(true);
      setAnalyticsError(null);

      try {
        const response = await fetch(`/api/payments/analytics?address=${account.address}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch analytics');
        }

        setAnalytics(data);
      } catch (err) {
        setAnalyticsError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchAnalytics();
  }, [account?.address]);

  const togglePage = (pageId: string) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId);
    } else {
      newExpanded.add(pageId);
    }
    setExpandedPages(newExpanded);
  };

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            {loading ? (
              <div className="space-y-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
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

                {/* Payment Analytics */}
                {analyticsLoading ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
                    <Skeleton className="h-6 w-48" />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Skeleton className="h-20" />
                      <Skeleton className="h-20" />
                      <Skeleton className="h-20" />
                      <Skeleton className="h-20" />
                    </div>
                  </div>
                ) : analyticsError ? (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                    <p className="text-red-800 dark:text-red-200 font-semibold">Error</p>
                    <p className="text-red-600 dark:text-red-400">{analyticsError}</p>
                  </div>
                ) : analytics ? (
                  <>
                    {/* Summary Stats */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                      <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total Collected</p>
                          <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400 break-words">
                            {formatTokenAmount(BigInt(analytics.summary.totalAmount), 18)} USDA
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total Payments</p>
                          <p className="text-xl sm:text-2xl font-bold">{analytics.summary.totalPayments}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Payment Pages</p>
                          <p className="text-xl sm:text-2xl font-bold">{analytics.summary.totalPages}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Payment Items</p>
                          <p className="text-xl sm:text-2xl font-bold">{analytics.summary.totalItems}</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Pages with Analytics */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <h2 className="text-xl font-semibold">Your Payment Pages</h2>
                    <Link
                      href="/dashboard/pages/new"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
                      aria-label="Create a new payment page"
                    >
                      Create New Page
                    </Link>
                  </div>

                  {user?.paymentPages && user.paymentPages.length > 0 ? (
                    <div className="space-y-4">
                      {user.paymentPages.map((page) => {
                        const pageStats = analytics?.pageStats.find((p) => p.pageId === page.id);
                        return (
                          <div
                            key={page.id}
                            className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <Link
                                    href={`/dashboard/pages/${page.id}`}
                                    className="font-semibold text-lg hover:text-blue-600 dark:hover:text-blue-400"
                                  >
                                    {page.title}
                                  </Link>
                                </div>
                                {page.description && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    {page.description}
                                  </p>
                                )}
                                <div className="flex flex-wrap gap-4 text-sm">
                                  <span className="text-gray-600 dark:text-gray-400">
                                    Created: {new Date(page.createdAt).toLocaleDateString()}
                                  </span>
                                  {pageStats && (
                                    <>
                                      <span className="text-green-600 dark:text-green-400 font-semibold">
                                        Total: {formatTokenAmount(BigInt(pageStats.totalAmount), 18)} USDA
                                      </span>
                                      <span className="text-gray-600 dark:text-gray-400">
                                        Payments: {pageStats.totalPayments}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 sm:ml-4">
                                <Link
                                  href={`/dashboard/pages/${page.id}`}
                                  className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                                  onClick={(e) => e.stopPropagation()}
                                  aria-label={`Edit ${page.title}`}
                                >
                                  Edit
                                </Link>
                                {pageStats && pageStats.items.length > 0 && (
                                  <button
                                    onClick={() => togglePage(page.id)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                                  >
                                    <svg
                                      className={`w-5 h-5 transition-transform ${
                                        expandedPages.has(page.id) ? 'rotate-180' : ''
                                      }`}
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                      />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Expanded Item Details */}
                            {expandedPages.has(page.id) && pageStats && (
                              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-3">
                                  Items Breakdown:
                                </h4>
                                <div className="space-y-3">
                                  {pageStats.items.map((item) => (
                                    <div key={item.itemId} className="ml-4 border-l-2 pl-4">
                                      <div
                                        className="flex items-center justify-between cursor-pointer"
                                        onClick={() => toggleItem(item.itemId)}
                                      >
                                        <div className="flex-1">
                                          <h5 className="font-medium">{item.itemTitle}</h5>
                                          <div className="flex gap-4 mt-1 text-xs text-gray-600 dark:text-gray-400">
                                            <span className="text-green-600 dark:text-green-400 font-semibold">
                                              {formatTokenAmount(BigInt(item.totalAmount), 18)} USDA
                                            </span>
                                            <span>{item.totalPayments} payments</span>
                                          </div>
                                        </div>
                                        {item.payments.length > 0 && (
                                          <svg
                                            className={`w-4 h-4 transition-transform ${
                                              expandedItems.has(item.itemId) ? 'rotate-180' : ''
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M19 9l-7 7-7-7"
                                            />
                                          </svg>
                                        )}
                                      </div>

                                      {expandedItems.has(item.itemId) && item.payments.length > 0 && (
                                        <div className="mt-2 space-y-2">
                                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                            Transactions:
                                          </p>
                                          {item.payments.map((payment) => (
                                            <div
                                              key={payment.id}
                                              className="bg-gray-50 dark:bg-gray-700 rounded p-2 text-xs"
                                            >
                                              <div className="flex items-center justify-between">
                                                <div>
                                                  <a
                                                    href={`https://sepolia.etherscan.io/tx/${payment.txHash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-mono text-blue-600 hover:text-blue-700"
                                                  >
                                                    {shortenAddress(payment.txHash)}
                                                  </a>
                                                  <p className="text-gray-600 dark:text-gray-400">
                                                    From: {shortenAddress(payment.payerWallet)}
                                                  </p>
                                                </div>
                                                <div className="text-right">
                                                  <p className="font-semibold">
                                                    {formatTokenAmount(BigInt(payment.amount), 18)} USDA
                                                  </p>
                                                  <p className="text-gray-500 text-xs">
                                                    {new Date(payment.createdAt).toLocaleDateString()}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
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
                  </>
                ) : null}

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
