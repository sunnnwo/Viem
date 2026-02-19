import { createWalletClient, custom } from 'viem'
import { sepolia } from 'viem/chains'
 

const ethereum = typeof window !== 'undefined' ? window.ethereum : undefined;

export const walletClient = ethereum ? createWalletClient({
  chain: sepolia,
  transport: custom(ethereum),
}) : null;

