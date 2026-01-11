'use client';

import Link from 'next/link';
import ConnectWallet from '@/components/wallet/ConnectWallet';
import WalletInfo from '@/components/wallet/WalletInfo';
import { useActiveAccount } from 'thirdweb/react';

export default function Header() {
  const account = useActiveAccount();

  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          PayMNEE
        </Link>
        
        <nav className="flex items-center gap-6">
          {account && (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-400"
              >
                Dashboard
              </Link>
              <Link
                href="/purchases"
                className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-400"
              >
                My Purchases
              </Link>
            </>
          )}
          
          <div className="flex items-center gap-4">
            {account ? <WalletInfo /> : null}
            <ConnectWallet />
          </div>
        </nav>
      </div>
    </header>
  );
}
