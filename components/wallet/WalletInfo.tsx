'use client';

import { useActiveAccount, useActiveWallet } from 'thirdweb/react';
import { shortenAddress } from '@/lib/wallet';

export default function WalletInfo() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();

  if (!account || !wallet) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex flex-col">
        <span className="font-medium">{shortenAddress(account.address)}</span>
        {wallet.id && (
          <span className="text-xs text-gray-500 capitalize">{wallet.id.replace(/[._]/g, ' ')}</span>
        )}
      </div>
    </div>
  );
}
