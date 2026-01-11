'use client';

import { useState } from 'react';
import { useActiveAccount, useActiveWallet } from 'thirdweb/react';
import { shortenAddress } from '@/lib/wallet';

export default function WalletInfo() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const [copied, setCopied] = useState(false);

  if (!account || !wallet) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(account.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2.5 px-3.5 py-2 bg-gradient-to-r from-amber-500/10 to-amber-400/10 dark:from-amber-500/20 dark:to-amber-400/20 border border-amber-300/50 dark:border-amber-700/50 rounded-xl hover:from-amber-500/15 hover:to-amber-400/15 dark:hover:from-amber-500/30 dark:hover:to-amber-400/30 hover:border-amber-400/70 dark:hover:border-amber-600/70 transition-all duration-200 active:scale-95 group shadow-sm hover:shadow-md"
      title="Click to copy address"
      aria-label="Copy wallet address"
    >
      <div className="flex flex-col items-start min-w-0">
        <span className="font-semibold text-sm text-amber-900 dark:text-amber-100 leading-tight truncate max-w-[120px]">
          {shortenAddress(account.address)}
        </span>
        {wallet.id && (
          <span className="text-[11px] text-amber-700/70 dark:text-amber-300/70 capitalize leading-tight">
            {wallet.id.replace(/[._]/g, ' ')}
          </span>
        )}
      </div>
      <div className="flex-shrink-0 ml-1">
        {copied ? (
          <svg 
            className="w-4 h-4 text-green-600 dark:text-green-400 transition-all animate-in" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg 
            className="w-4 h-4 text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </div>
    </button>
  );
}
