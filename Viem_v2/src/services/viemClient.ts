import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet, sepolia } from 'viem/chains'


const client = createPublicClient({
  chain: sepolia,
  transport: http(),
})

// const account = privateKeyToAccount('0xf00cd05a73a990a68caefc54207704028c2a437263bcd52b8409cceee11225e5')
export async function getBlockNumber() {
	const blockNumber = await client.getBlockNumber();
	console.log(blockNumber);
	return blockNumber;
} 

 
