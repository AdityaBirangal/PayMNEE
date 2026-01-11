'use client';

import { useActiveAccount } from 'thirdweb/react';
import { useEffect, useState } from 'react';
import { normalizeAddress } from '@/lib/wallet';

interface User {
  walletAddress: string;
  createdAt: string;
  paymentPages?: Array<{
    id: string;
    title: string;
    description: string | null;
    createdAt: string;
  }>;
}

export function useWalletAuth() {
  const account = useActiveAccount();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Register/authenticate user when wallet is connected
  useEffect(() => {
    const authenticateUser = async () => {
      if (!account?.address) {
        setUser(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const normalizedAddress = normalizeAddress(account.address);
        
        const response = await fetch('/api/auth/wallet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletAddress: normalizedAddress,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to authenticate wallet');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        console.error('Wallet authentication error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
      } finally {
        setLoading(false);
      }
    };

    authenticateUser();
  }, [account?.address]);

  // Fetch user data (with payment pages)
  const fetchUser = async () => {
    if (!account?.address) return;

    setLoading(true);
    setError(null);

    try {
      const normalizedAddress = normalizeAddress(account.address);
      const response = await fetch(`/api/auth/wallet?address=${normalizedAddress}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUser(data.user);
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    isConnected: !!account?.address,
    walletAddress: account?.address ? normalizeAddress(account.address) : null,
    refetch: fetchUser,
  };
}
