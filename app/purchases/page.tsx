'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import ConnectWallet from '@/components/wallet/ConnectWallet';
import { useActiveAccount } from 'thirdweb/react';
import { formatTokenAmount } from '@/lib/blockchain';
import { shortenAddress } from '@/lib/wallet';
import Link from 'next/link';

interface Purchase {
  id: string;
  txHash: string;
  amount: string;
  createdAt: string;
  item: {
    id: string;
    title: string;
    description: string | null;
    type: string;
    priceMnee: string | null;
    contentUrl: string | null;
  };
  page: {
    id: string;
    title: string;
    creatorWallet: string;
  };
}

interface PurchaseHistory {
  success: boolean;
  walletAddress: string;
  totalPurchases: number;
  purchases: Purchase[];
}

export default function PurchasesPage() {
  const account = useActiveAccount();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PurchaseHistory | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!account?.address) {
        setData(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/payments/history?wallet=${account.address}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch purchase history');
        }

        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [account?.address]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Purchases</h1>

          {!account ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Connect your wallet to view your purchase history and access premium content
              </p>
              <ConnectWallet />
            </div>
          ) : loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">Loading purchase history...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <p className="text-red-800 dark:text-red-200 font-semibold">Error</p>
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : data && data.totalPurchases === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">No Purchases Yet</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You haven't made any purchases yet. Start exploring payment pages to unlock premium content!
              </p>
              <Link
                href="/dashboard"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Purchase Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Purchases</p>
                    <p className="text-2xl font-bold">{data.totalPurchases}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Wallet Address</p>
                    <p className="text-sm font-mono">{shortenAddress(data.walletAddress)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                    <p className="text-2xl font-bold">
                      {data.purchases.reduce((sum, p) => {
                        try {
                          return sum + parseFloat(formatTokenAmount(BigInt(p.amount), 18));
                        } catch {
                          return sum;
                        }
                      }, 0).toFixed(6)} USDA
                    </p>
                  </div>
                </div>
              </div>

              {/* Purchases List */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Purchase History</h2>
                {data.purchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      {/* Left: Item Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold mb-1">
                              {purchase.item.title}
                            </h3>
                            {purchase.item.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {purchase.item.description}
                              </p>
                            )}
                          </div>
                          {purchase.item.contentUrl && (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-xs rounded">
                              Premium
                            </span>
                          )}
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 dark:text-gray-400">From:</span>
                            <Link
                              href={`/pay/${purchase.page.creatorWallet}`}
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              {purchase.page.title}
                            </Link>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 dark:text-gray-400">Creator:</span>
                            <span className="font-mono text-xs">
                              {shortenAddress(purchase.page.creatorWallet)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                            <span className="font-semibold">
                              {formatTokenAmount(BigInt(purchase.amount), 18)} USDA
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 dark:text-gray-400">Date:</span>
                            <span>
                              {new Date(purchase.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 dark:text-gray-400">Transaction:</span>
                            <a
                              href={`https://sepolia.etherscan.io/tx/${purchase.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-xs text-blue-600 hover:text-blue-700 break-all"
                            >
                              {shortenAddress(purchase.txHash)}
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-col gap-2 md:min-w-[200px]">
                        {purchase.item.contentUrl ? (
                          <>
                            <a
                              href={purchase.item.contentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center font-medium"
                            >
                              Access Content →
                            </a>
                            <Link
                              href={`/content/${purchase.item.id}`}
                              className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center text-sm"
                            >
                              View Content Page
                            </Link>
                          </>
                        ) : (
                          <span className="px-4 py-2 text-center text-gray-500 text-sm">
                            No content available
                          </span>
                        )}
                        <Link
                          href={`/payment/${purchase.txHash}/success`}
                          className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center text-sm"
                        >
                          View Receipt
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
