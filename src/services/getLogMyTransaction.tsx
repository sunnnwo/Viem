import {  parseAbi} from "viem";
import { publicClient } from "./PublicClient";


export async function getMyLogs(account: string | null) {
	// const currentBlock = await publicClient.getBlockNumber();
	// const accountNumber = await GetMyAccount();
	const currentBlock = await publicClient.getBlockNumber();
	try {
		const logs = await publicClient.getLogs({  
		 address: '0x6A7577c10cD3F595eB2dbB71331D7Bf7223E1Aac', // Contract Address
		 // abi : myerc20Abi,
		  events: parseAbi(['event Transfer(address indexed from, address indexed to, uint256 value)', 'event Approval(address indexed owner, address indexed sender, uint256 value)']),
		//   args:{from : account ? getAddress(account) : undefined},
		  fromBlock: currentBlock - 999n,
	});
	return logs;
} catch (error) {
	console.error("Error fetching logs:", error);
	return [];
}
}

