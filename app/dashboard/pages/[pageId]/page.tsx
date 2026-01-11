'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useWallet } from '@/components/wallet/WalletProvider';
import Link from 'next/link';

interface PaymentItem {
  id: string;
  title: string;
  description: string | null;
  type: string;
  priceMnee: string | null;
  contentUrl: string | null;
  createdAt: string;
  paymentCount: number;
}

interface PaymentPage {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  items: PaymentItem[];
}

export default function PaymentPageDetail() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.pageId as string;
  const { walletAddress } = useWallet();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<PaymentPage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      if (!walletAddress || !pageId) {
        if (!walletAddress) {
          setError('Wallet not connected');
        }
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/pages/${pageId}?address=${encodeURIComponent(walletAddress)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch payment page');
        }

        setPage(data.page);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [walletAddress, pageId]);

  const handleDeleteItem = async (itemId: string) => {
    if (!walletAddress) {
      alert('Wallet not connected');
      return;
    }

    if (!confirm('Are you sure you want to delete this payment item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/items/${itemId}?address=${encodeURIComponent(walletAddress)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      // Refresh page data
      const pageResponse = await fetch(`/api/pages/${pageId}?address=${encodeURIComponent(walletAddress)}`);
      const pageData = await pageResponse.json();
      if (pageData.success) {
        setPage(pageData.page);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="text-center">
              {!walletAddress ? (
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Connecting wallet...</p>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">Loading payment page...</p>
              )}
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !page) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">Error</h2>
                <p className="text-red-700 dark:text-red-300">{error || 'Page not found'}</p>
                {!walletAddress && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                    Please make sure your wallet is connected.
                  </p>
                )}
                <Link
                  href="/dashboard"
                  className="mt-4 inline-block text-blue-600 hover:text-blue-700"
                >
                  ← Back to Dashboard
                </Link>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-700 mb-4 inline-block"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold">{page.title}</h1>
              {page.description && (
                <p className="text-gray-600 dark:text-gray-400 mt-2">{page.description}</p>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Payment Items</h2>
                <Link
                  href={`/dashboard/pages/${pageId}/items/new`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Add Item
                </Link>
              </div>

              {page.items.length > 0 ? (
                <div className="space-y-4">
                  {page.items.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{item.title}</h3>
                            <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                              {item.type}
                            </span>
                            {item.type === 'fixed' && item.priceMnee && (
                              <span className="text-sm font-medium">
                                {item.priceMnee} USDA
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {item.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{item.paymentCount} payments</span>
                            {item.contentUrl && (
                              <span className="text-green-600">Content URL set</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/dashboard/pages/${pageId}/items/${item.id}/edit`}
                            className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                  <p>No payment items yet.</p>
                  <p className="text-sm mt-2">Add your first payment item to start accepting payments!</p>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Public Page</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Share this link with your customers:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                  {typeof window !== 'undefined' && `${window.location.origin}/pay/${walletAddress}`}
                </code>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      navigator.clipboard.writeText(`${window.location.origin}/pay/${walletAddress}`);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
