'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useWallet } from '@/components/wallet/WalletProvider';

export default function NewPaymentItem() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.pageId as string;
  const { walletAddress } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'fixed' as 'fixed' | 'open',
    priceMnee: '',
    contentUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          pageId,
          title: formData.title,
          description: formData.description,
          type: formData.type,
          priceMnee: formData.type === 'fixed' ? formData.priceMnee : undefined,
          contentUrl: formData.contentUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment item');
      }

      // Redirect back to page
      router.push(`/dashboard/pages/${pageId}`);
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
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Add Payment Item</h1>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Item Title *
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Premium Article Access"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe what the customer gets..."
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium mb-2">
                  Payment Type *
                </label>
                <select
                  id="type"
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'fixed' | 'open', priceMnee: '' })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="open">Open Amount (Tips, Donations)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.type === 'fixed'
                    ? 'Customer pays a fixed amount to unlock content'
                    : 'Customer enters any amount (for tips, donations, etc.)'}
                </p>
              </div>

              {formData.type === 'fixed' && (
                <div>
                  <label htmlFor="priceMnee" className="block text-sm font-medium mb-2">
                    Price (USDA) *
                  </label>
                  <input
                    type="number"
                    id="priceMnee"
                    required
                    step="0.000001"
                    min="0"
                    value={formData.priceMnee}
                    onChange={(e) => setFormData({ ...formData, priceMnee: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10.5"
                  />
                </div>
              )}

              <div>
                <label htmlFor="contentUrl" className="block text-sm font-medium mb-2">
                  Content URL (Optional)
                </label>
                <input
                  type="url"
                  id="contentUrl"
                  value={formData.contentUrl}
                  onChange={(e) => setFormData({ ...formData, contentUrl: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/premium-content"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL to unlock after payment (for fixed price items with content)
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Item'}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
