'use client';

import { useState, useEffect, useMemo } from 'react';
import { ConnectButton, useActiveAccount, useActiveWalletChain } from 'thirdweb/react';
import { createThirdwebClient } from 'thirdweb';
import { createWallet, inAppWallet } from 'thirdweb/wallets';
import { defineChain } from 'thirdweb/chains';
import { CHAIN_ID, TOKEN_SYMBOL } from '@/lib/constants';
import { getTokenContract, formatTokenAmount } from '@/lib/blockchain';
import { shortenAddress } from '@/lib/wallet';

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

const wallets = [
  inAppWallet(),
  createWallet('io.metamask'),
  createWallet('com.coinbase.wallet'),
  createWallet('me.rainbow'),
];

// Define Ethereum Mainnet chain
const getEthereumChain = () => {
  const rpcUrl = process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL;
  if (!rpcUrl) {
    throw new Error('NEXT_PUBLIC_ETHEREUM_RPC_URL is not set in environment variables');
  }
  
  return defineChain({
    id: CHAIN_ID,
    name: 'Ethereum',
    rpc: rpcUrl,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  });
};

export default function ConnectWallet() {
  const account = useActiveAccount();
  const chain = useActiveWalletChain();
  const [usdaBalance, setUsdaBalance] = useState<string | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);

  const client = useMemo(() => {
    if (!clientId) {
      return null;
    }
    return createThirdwebClient({
      clientId: clientId,
    });
  }, [clientId]);

  const ethereumChain = useMemo(() => {
    try {
      return getEthereumChain();
    } catch (error) {
      return null;
    }
  }, []);

  // Fetch MNEE balance when account is connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (!account?.address) {
        setUsdaBalance(null);
        return;
      }

      try {
        setLoadingBalance(true);
        const contract = getTokenContract();
        const balance = await contract.balanceOf(account.address);
        const formatted = formatTokenAmount(balance, 18);
        setUsdaBalance(formatted);
      } catch (error) {
        console.error('Error fetching MNEE balance:', error);
        setUsdaBalance(null);
      } finally {
        setLoadingBalance(false);
      }
    };

    fetchBalance();
    // Refresh balance every 10 seconds
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [account?.address]);

  if (!client) {
    return (
      <div className="px-4 py-2 text-sm text-red-600">
        ThirdWeb Client ID not configured
      </div>
    );
  }

  if (!ethereumChain) {
    return (
      <div className="px-4 py-2 text-sm text-red-600">
        Ethereum RPC URL not configured
      </div>
    );
  }

  return (
    <div className={`connect-wallet-container ${!account ? 'connect-wallet-not-connected' : 'connect-wallet-connected'}`}>
      <div className="connect-wallet-button-wrapper">
        <ConnectButton
          client={client}
          wallets={wallets}
          chain={ethereumChain}
          connectModal={{ size: 'wide' }}
        />
        {account && (
          <div className="connect-wallet-custom-content">
            <div className="connect-wallet-icon">
              <div className="connect-wallet-icon-circle"></div>
            </div>
            <div className="connect-wallet-info">
              <div className="connect-wallet-address">
                {shortenAddress(account.address)}
              </div>
              {usdaBalance !== null && (
                <div className="connect-wallet-usda-balance">
                  {parseFloat(usdaBalance).toFixed(2)} {TOKEN_SYMBOL}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
