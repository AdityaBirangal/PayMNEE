'use client';

import Link from 'next/link';
import ConnectWallet from '@/components/wallet/ConnectWallet';
import WalletInfo from '@/components/wallet/WalletInfo';
import { useActiveAccount } from 'thirdweb/react';

export default function Header() {
  const account = useActiveAccount();

  return (
    <header className="border-b border-gray-200 dark:border-gray-800" role="banner">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link href="/" className="text-xl sm:text-2xl font-bold" aria-label="PayMNEE Home">
            PayMNEE
          </Link>
          
          <nav className="flex items-center gap-4 sm:gap-6" role="navigation" aria-label="Main navigation">
            {account && (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-400 hidden sm:block"
                  aria-label="Go to Dashboard"
                >
                  Dashboard
                </Link>
                <Link
                  href="/purchases"
                  className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-400 hidden sm:block"
                  aria-label="View My Purchases"
                >
                  My Purchases
                </Link>
              </>
            )}
            
            <div className="flex items-center gap-2 sm:gap-4">
              {account ? <WalletInfo /> : null}
              <ConnectWallet />
            </div>
          </nav>
        </div>
        
        {/* Mobile Navigation */}
        {account && (
          <nav className="flex items-center gap-4 mt-4 sm:hidden border-t border-gray-200 dark:border-gray-800 pt-4" role="navigation" aria-label="Mobile navigation">
            <Link
              href="/dashboard"
              className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-400"
              aria-label="Go to Dashboard"
            >
              Dashboard
            </Link>
            <Link
              href="/purchases"
              className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-400"
              aria-label="View My Purchases"
            >
              My Purchases
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
