import { createPublicClient, http, parseAbiItem } from 'viem'
import { mainnet, sepolia } from 'viem/chains'

// 1. Create Public Client
const client = createPublicClient({
  chain: sepolia,
  transport: http(),
})

// 2. Fetch Logs
const currentBlock = await client.getBlockNumber();
const logs = await client.getLogs({  
		 address: '0x6A7577c10cD3F595eB2dbB71331D7Bf7223E1Aac', // Contract Addressabi : myerc20Abi,
		  event: parseAbiItem(['event Transfer(address indexed from, address indexed to, uint256 value)', 'event Approval(address indexed owner, address indexed sender, uint256 value)']),
		  args:{from : '0x8124B5BEE7b8fAc709eadd329C9E7C7666289619'},
		  fromBlock: currentBlock - 999n,
	});

const latestTenLogs = logs.slice(-10);
// console.log("Logs:", logs);
console.log("Latest Ten Logs:", latestTenLogs);
const latestEventName = logs.reverse().slice(0, 10)
		  .map(log => log.eventName);
console.log("Latest Ten Event Names:", latestEventName);