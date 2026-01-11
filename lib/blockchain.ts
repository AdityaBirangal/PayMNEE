import { ethers } from 'ethers';

// ERC-20 ABI (minimal - just what we need)
export const ERC20_ABI = [
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function balanceOf(address account) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
  'function symbol() external view returns (string)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
] as const;

// Get the MNEE/USDA token address from environment
export const getTokenAddress = (): string => {
  const address = process.env.NEXT_PUBLIC_MNEE_TOKEN_ADDRESS;
  if (!address) {
    throw new Error('NEXT_PUBLIC_MNEE_TOKEN_ADDRESS not set in environment variables');
  }
  return address;
};

// Get RPC URL from environment
export const getRpcUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_ETHEREUM_RPC_URL not set in environment variables');
  }
  return url;
};

// Singleton provider instance to reuse connections
let providerInstance: ethers.JsonRpcProvider | null = null;

// Create a provider for reading blockchain data (singleton pattern)
export const getProvider = (): ethers.JsonRpcProvider => {
  if (!providerInstance) {
    providerInstance = new ethers.JsonRpcProvider(getRpcUrl());
  }
  return providerInstance;
};

// Get token contract instance
export const getTokenContract = (signerOrProvider?: ethers.Signer | ethers.Provider) => {
  const address = getTokenAddress();
  const provider = signerOrProvider || getProvider();
  return new ethers.Contract(address, ERC20_ABI, provider);
};

// Format token amount (wei to human-readable)
export const formatTokenAmount = (amount: bigint, decimals: number = 18): string => {
  return ethers.formatUnits(amount, decimals);
};

// Parse token amount (human-readable to wei)
export const parseTokenAmount = (amount: string, decimals: number = 18): bigint => {
  return ethers.parseUnits(amount, decimals);
};

// Verify a transfer transaction
export const verifyTransfer = async (
  txHash: string,
  expectedFrom: string,
  expectedTo: string,
  expectedAmount: string
): Promise<boolean> => {
  try {
    const provider = getProvider();
    const receipt = await provider.getTransactionReceipt(txHash);
    
    if (!receipt || receipt.status !== 1) {
      return false;
    }

    const contract = getTokenContract(provider);
    const filter = contract.filters.Transfer(expectedFrom, expectedTo);
    const logs = await contract.queryFilter(filter, receipt.blockNumber, receipt.blockNumber);

    for (const log of logs) {
      if (log.transactionHash === txHash) {
        const parsedLog = contract.interface.parseLog(log);
        if (parsedLog) {
          const amount = parsedLog.args.value.toString();
          return amount === expectedAmount;
        }
      }
    }

    return false;
  } catch (error) {
    console.error('Error verifying transfer:', error);
    return false;
  }
};
