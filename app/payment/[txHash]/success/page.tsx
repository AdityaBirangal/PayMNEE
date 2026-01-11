'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Link from 'next/link';
import { useActiveAccount } from 'thirdweb/react';
import { formatTokenAmount } from '@/lib/blockchain';
import ConnectWallet from '@/components/wallet/ConnectWallet';

interface PaymentData {
  payment: {
    id: string;
    txHash: string;
    amount: string;
    createdAt: string;
    item: {
      id: string;
      title: string;
      contentUrl: string | null;
    };
  };
  access: {
    hasAccess: boolean;
    contentUrl?: string;
  };
}

export default function PaymentSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const txHash = params.txHash as string;
  const account = useActiveAccount();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PaymentData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accessChecked, setAccessChecked] = useState(false);

  useEffect(() => {
    const fetchPaymentData = async () => {
      if (!txHash) {
        setLoading(false);
        return;
      }

      try {
        // Get payment details (without wallet requirement - txHash is enough)
        const paymentResponse = await fetch(`/api/payments?txHash=${txHash}`);
        const paymentData = await paymentResponse.json();

        if (!paymentResponse.ok || !paymentData.payment) {
          throw new Error(paymentData.error || 'Payment not found');
        }

        // If wallet is connected, check access to content
        if (account?.address) {
          const itemId = paymentData.payment.item?.id || paymentData.payment.itemId;
          if (itemId) {
            try {
              const accessResponse = await fetch(
                `/api/payments/access?wallet=${account.address}&itemId=${itemId}`
              );
              const accessData = await accessResponse.json();

              setData({
                payment: paymentData.payment,
                access: {
                  hasAccess: accessData.hasAccess || false,
                  contentUrl: accessData.item?.contentUrl || null,
                },
              });
              setAccessChecked(true);
            } catch (accessErr) {
              // If access check fails, still show payment but no access
              setData({
                payment: paymentData.payment,
                access: {
                  hasAccess: false,
                  contentUrl: paymentData.payment.item?.contentUrl || null,
                },
              });
              setAccessChecked(true);
            }
          } else {
            setData({
              payment: paymentData.payment,
              access: {
                hasAccess: false,
                contentUrl: paymentData.payment.item?.contentUrl || null,
              },
            });
          }
        } else {
          // Wallet not connected - show payment but prompt for connection to check access
          setData({
            payment: paymentData.payment,
            access: {
              hasAccess: false,
              contentUrl: paymentData.payment.item?.contentUrl || null,
            },
          });
          setAccessChecked(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, [txHash, account?.address]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Loading payment details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Payment Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400">{error || 'Unable to load payment details'}</p>
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

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your payment has been confirmed on the blockchain
            </p>
          </div>

          {/* Payment Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Item:</span>
                <p className="font-medium">{data.payment.item.title}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Transaction Hash:</span>
                <p className="font-mono text-sm break-all">{data.payment.txHash}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
                <p className="font-medium">
                  {formatTokenAmount(BigInt(data.payment.amount), 18)} USDA
                </p>
                <p className="text-xs text-gray-500 font-mono mt-1">
                  ({data.payment.amount} wei)
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Date:</span>
                <p>{new Date(data.payment.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Content Access */}
          {data.payment.item.contentUrl && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Content Access</h2>
              {!account ? (
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Connect your wallet to verify access to this content
                  </p>
                  <div className="mb-4">
                    <ConnectWallet />
                  </div>
                  <p className="text-sm text-gray-500">
                    Or visit: <Link href={`/content/${data.payment.item?.id || data.payment.itemId}`} className="text-blue-600 hover:text-blue-700">Content Page</Link>
                  </p>
                </div>
              ) : accessChecked ? (
                data.access.hasAccess ? (
                  <div>
                    <p className="text-green-600 dark:text-green-400 mb-4">
                      ✓ You have access to this content
                    </p>
                    <div className="space-y-2">
                      <a
                        href={data.access.contentUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                      >
                        Access Content →
                      </a>
                      <div>
                        <Link
                          href={`/content/${data.payment.item?.id || data.payment.itemId}`}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Or view content page →
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-yellow-600 dark:text-yellow-400 mb-2">
                      ⚠ Content access verification failed
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      The payment may still be confirming on the blockchain. Please try again in a moment.
                    </p>
                    <Link
                      href={`/content/${data.payment.item?.id || data.payment.itemId}`}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Try content page →
                    </Link>
                  </div>
                )
              ) : (
                <p className="text-gray-600 dark:text-gray-400">Checking access...</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="flex-1 px-6 py-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center"
            >
              Go to Dashboard
            </Link>
            {data.payment.item.contentUrl && data.access.hasAccess && (
              <a
                href={data.access.contentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
              >
                Access Content
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
