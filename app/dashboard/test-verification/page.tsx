'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useWallet } from '@/components/wallet/WalletProvider';
import { useActiveAccount } from 'thirdweb/react';

export default function TestVerificationPage() {
  const { walletAddress } = useWallet();
  const account = useActiveAccount();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Test 1: Verify a specific transaction
  const [txHash, setTxHash] = useState('');
  const [recipientAddress, setRecipientAddress] = useState(walletAddress || '');
  const [expectedAmount, setExpectedAmount] = useState('');

  // Test 2: Scan for payments
  const [scanWallet, setScanWallet] = useState(walletAddress || '');
  const [fromBlock, setFromBlock] = useState('');
  const [toBlock, setToBlock] = useState('');

  const handleVerify = async () => {
    if (!txHash || !recipientAddress) {
      setError('Transaction hash and recipient address are required');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          txHash,
          recipientAddress,
          expectedAmount: expectedAmount || undefined,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyByHash = async () => {
    if (!txHash || !recipientAddress) {
      setError('Transaction hash and recipient address are required');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const url = `/api/payments/verify/${txHash}?recipient=${encodeURIComponent(recipientAddress)}${expectedAmount ? `&amount=${expectedAmount}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async () => {
    if (!scanWallet) {
      setError('Wallet address is required');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/payments/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: scanWallet,
          fromBlock: fromBlock ? parseInt(fromBlock) : undefined,
          toBlock: toBlock ? parseInt(toBlock) : undefined,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Test Payment Verification</h1>

            <div className="space-y-8">
              {/* Test 1: Verify Transaction */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">1. Verify a Transaction</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Transaction Hash *
                    </label>
                    <input
                      type="text"
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0x..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Recipient Address *
                    </label>
                    <input
                      type="text"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0x..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Expected Amount (wei, optional)
                    </label>
                    <input
                      type="text"
                      value={expectedAmount}
                      onChange={(e) => setExpectedAmount(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Leave empty for open payments"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleVerify}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      Verify (POST)
                    </button>
                    <button
                      onClick={handleVerifyByHash}
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      Verify (GET)
                    </button>
                  </div>
                </div>
              </div>

              {/* Test 2: Scan Blockchain */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">2. Scan Blockchain for Payments</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Creator Wallet Address *
                    </label>
                    <input
                      type="text"
                      value={scanWallet}
                      onChange={(e) => setScanWallet(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0x..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        From Block (optional)
                      </label>
                      <input
                        type="number"
                        value={fromBlock}
                        onChange={(e) => setFromBlock(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Auto: last 1000 blocks"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        To Block (optional)
                      </label>
                      <input
                        type="number"
                        value={toBlock}
                        onChange={(e) => setToBlock(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Auto: current block"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleScan}
                    disabled={loading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    Scan Blockchain
                  </button>
                </div>
              </div>

              {/* Results */}
              {(result || error) && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Results</h2>
                  {error && (
                    <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                      <p className="text-red-800 dark:text-red-200 font-semibold">Error</p>
                      <p className="text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}
                  {result && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
                      <pre className="text-sm overflow-auto">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Instructions */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="font-semibold mb-2">How to Test:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>
                    <strong>Make a test payment:</strong> Go to a payment page and make a payment to get a transaction hash
                  </li>
                  <li>
                    <strong>Verify the payment:</strong> Use the transaction hash from step 1 to verify it on-chain
                  </li>
                  <li>
                    <strong>Scan for payments:</strong> Enter your wallet address to scan for any unrecorded payments
                  </li>
                  <li>
                    <strong>Check results:</strong> Review the verification results and any matched/unmatched payments
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
