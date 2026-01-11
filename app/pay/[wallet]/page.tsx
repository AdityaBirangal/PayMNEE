'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import ConnectWallet from '@/components/wallet/ConnectWallet';
import { useActiveAccount } from 'thirdweb/react';
import { shortenAddress } from '@/lib/wallet';
import { usePayment } from '@/hooks/usePayment';
import { CHAIN_ID } from '@/lib/constants';

interface PaymentItem {
  id: string;
  title: string;
  description: string | null;
  type: string;
  priceMnee: string | null;
  contentUrl: string | null;
}

interface PaymentPage {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  items: PaymentItem[];
}

interface PublicPagesData {
  creator: {
    walletAddress: string;
    createdAt: string | null;
  };
  pages: PaymentPage[];
}

export default function PublicPaymentPage() {
  const params = useParams();
  const walletAddress = params.wallet as string;
  const account = useActiveAccount();
  const { executePayment, loading: paymentLoading, error: paymentError, isCorrectChain } = usePayment();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PublicPagesData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<PaymentItem | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    const fetchPages = async () => {
      if (!walletAddress) return;

      try {
        const response = await fetch(`/api/public/pages/${walletAddress}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch payment pages');
        }

        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [walletAddress]);

  const handlePayClick = (item: PaymentItem) => {
    setSelectedItem(item);
    if (item.type === 'open') {
      setCustomAmount('');
    }
  };

  const handleCloseModal = () => {
    if (paymentStatus === 'processing') return; // Don't close during payment
    setSelectedItem(null);
    setCustomAmount('');
    setPaymentStatus('idle');
    setTxHash(null);
  };

  const handlePayment = async () => {
    if (!account || !selectedItem || !data) {
      alert('Please connect your wallet first');
      return;
    }

    if (!isCorrectChain) {
      alert(`Please switch to Sepolia testnet (Chain ID: ${CHAIN_ID})`);
      return;
    }

    if (selectedItem.type === 'open' && (!customAmount || parseFloat(customAmount) <= 0)) {
      alert('Please enter a valid amount');
      return;
    }

    const amount = selectedItem.type === 'fixed' 
      ? selectedItem.priceMnee! 
      : customAmount;

    setPaymentStatus('processing');

    const hash = await executePayment({
      itemId: selectedItem.id,
      recipientAddress: data.creator.walletAddress,
      amount: amount,
      onSuccess: (txHash) => {
        setTxHash(txHash);
        setPaymentStatus('success');
        // Close modal after 3 seconds
        setTimeout(() => {
          handleCloseModal();
          setPaymentStatus('idle');
          setTxHash(null);
        }, 3000);
      },
      onError: (error) => {
        setPaymentStatus('error');
        console.error('Payment error:', error);
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
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
            <h1 className="text-2xl font-bold mb-4">Payment Page Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400">{error || 'This creator has not set up any payment pages yet.'}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Creator Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">PayMNEE</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Support {shortenAddress(data.creator.walletAddress)}
            </p>
          </div>

          {/* Payment Pages */}
          {data.pages.length > 0 ? (
            <div className="space-y-8">
              {data.pages.map((page) => (
                <div key={page.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">{page.title}</h2>
                    {page.description && (
                      <p className="text-gray-600 dark:text-gray-400">{page.description}</p>
                    )}
                  </div>

                  {/* Payment Items */}
                  {page.items.length > 0 ? (
                    <div className="space-y-4">
                      {page.items.map((item) => (
                        <div
                          key={item.id}
                          className="border rounded-lg p-4 hover:border-blue-500 transition"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                                  {item.type === 'fixed' ? 'Fixed Price' : 'Open Amount'}
                                </span>
                              </div>
                              {item.description && (
                                <p className="text-gray-600 dark:text-gray-400 mb-3">
                                  {item.description}
                                </p>
                              )}
                              {item.type === 'fixed' && item.priceMnee && (
                                <p className="text-xl font-bold text-blue-600">
                                  {item.priceMnee} USDA
                                </p>
                              )}
                              {item.type === 'open' && (
                                <p className="text-gray-600 dark:text-gray-400">
                                  Enter any amount
                                </p>
                              )}
                              {item.contentUrl && (
                                <p className="text-sm text-green-600 mt-2">
                                  ✓ Content included
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => handlePayClick(item)}
                              className="ml-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                            >
                              Pay
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No payment items available
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                This creator hasn't set up any payment pages yet.
              </p>
            </div>
          )}

          {/* Payment Modal */}
          {selectedItem && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Complete Payment</h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-4">
                  <p className="font-semibold mb-2">{selectedItem.title}</p>
                  {selectedItem.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {selectedItem.description}
                    </p>
                  )}
                </div>

                {!account ? (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Connect your wallet to proceed
                    </p>
                    <ConnectWallet />
                  </div>
                ) : (
                  <>
                    {selectedItem.type === 'open' ? (
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                          Amount (USDA) *
                        </label>
                        <input
                          type="number"
                          step="0.000001"
                          min="0"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter amount"
                        />
                      </div>
                    ) : (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Amount to pay:
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                          {selectedItem.priceMnee} USDA
                        </p>
                      </div>
                    )}

                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Recipient: {shortenAddress(data.creator.walletAddress)}
                      </p>
                    </div>

                    {paymentStatus === 'success' ? (
                      <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                        <p className="text-green-800 dark:text-green-200 font-semibold mb-2">
                          ✓ Payment Successful!
                        </p>
                        {txHash && (
                          <p className="text-xs text-green-600 dark:text-green-400 break-all">
                            TX: {txHash}
                          </p>
                        )}
                        <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                          Closing automatically...
                        </p>
                      </div>
                    ) : paymentStatus === 'error' ? (
                      <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                        <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
                          Payment Failed
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {paymentError || 'An error occurred. Please try again.'}
                        </p>
                      </div>
                    ) : null}

                    {!isCorrectChain && (
                      <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          ⚠ Please switch to Sepolia testnet to make payments
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={handlePayment}
                        disabled={paymentLoading || paymentStatus === 'processing' || !isCorrectChain}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {paymentLoading || paymentStatus === 'processing' 
                          ? 'Processing...' 
                          : `Pay ${selectedItem.type === 'open' ? customAmount || '0' : selectedItem.priceMnee} USDA`}
                      </button>
                      <button
                        onClick={handleCloseModal}
                        disabled={paymentStatus === 'processing'}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                      >
                        {paymentStatus === 'processing' ? 'Processing...' : 'Cancel'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
