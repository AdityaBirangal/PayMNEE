'use client';

import { ConnectButton } from 'thirdweb/react';
import { createThirdwebClient } from 'thirdweb';
import { createWallet, inAppWallet } from 'thirdweb/wallets';
import { defineChain } from 'thirdweb/chains';
import { CHAIN_ID } from '@/lib/constants';
import { useMemo } from 'react';

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

const wallets = [
  inAppWallet(),
  createWallet('io.metamask'),
  createWallet('com.coinbase.wallet'),
  createWallet('me.rainbow'),
];

// Define Sepolia chain
const getSepoliaChain = () => {
  const rpcUrl = process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL;
  if (!rpcUrl) {
    throw new Error('NEXT_PUBLIC_ETHEREUM_RPC_URL is not set in environment variables');
  }
  
  return defineChain({
    id: CHAIN_ID,
    name: 'Sepolia',
    rpc: rpcUrl,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  });
};

export default function ConnectWallet() {
  const client = useMemo(() => {
    if (!clientId) {
      return null;
    }
    return createThirdwebClient({
      clientId: clientId,
    });
  }, [clientId]);

  const sepoliaChain = useMemo(() => {
    try {
      return getSepoliaChain();
    } catch (error) {
      return null;
    }
  }, []);

  if (!client) {
    return (
      <div className="px-4 py-2 text-sm text-red-600">
        ThirdWeb Client ID not configured
      </div>
    );
  }

  if (!sepoliaChain) {
    return (
      <div className="px-4 py-2 text-sm text-red-600">
        Ethereum RPC URL not configured
      </div>
    );
  }

  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      chain={sepoliaChain}
      connectModal={{ size: 'wide' }}
    />
  );
}
