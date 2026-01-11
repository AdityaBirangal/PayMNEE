'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import { useActiveAccount } from 'thirdweb/react';
import Link from 'next/link';

interface AccessData {
  hasAccess: boolean;
  reason?: string;
  item?: {
    id: string;
    title: string;
    contentUrl: string | null;
  };
  payment?: {
    txHash: string;
    amount: string;
    createdAt: string;
  };
}

export default function ContentAccessPage() {
  const params = useParams();
  const itemId = params.itemId as string;
  const account = useActiveAccount();
  const [loading, setLoading] = useState(true);
  const [accessData, setAccessData] = useState<AccessData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      if (!account?.address || !itemId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/payments/access?wallet=${account.address}&itemId=${itemId}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to check access');
        }

        setAccessData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [account?.address, itemId]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Checking access...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !accessData) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Access Error</h1>
            <p className="text-gray-600 dark:text-gray-400">{error || 'Unable to check access'}</p>
            <Link
              href="/dashboard"
              className="mt-4 inline-block text-blue-600 hover:text-blue-700"
            >
              Go to Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!accessData.hasAccess) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
              <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {accessData.reason || 'You do not have access to this content'}
              </p>
              {accessData.item && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Item: {accessData.item.title}</p>
                  <Link
                    href={`/pay/${account?.address}`}
                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Make Payment
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">Content Unlocked</h1>
              {accessData.item && (
                <p className="text-gray-600 dark:text-gray-400">{accessData.item.title}</p>
              )}
            </div>

            {accessData.item?.contentUrl && (
              <div className="text-center">
                <a
                  href={accessData.item.contentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-lg"
                >
                  Access Content →
                </a>
              </div>
            )}

            {accessData.payment && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Payment verified on blockchain
                </p>
                <p className="text-xs font-mono text-gray-500">
                  TX: {accessData.payment.txHash}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
