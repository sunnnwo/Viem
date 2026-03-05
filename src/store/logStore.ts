import { create } from "zustand";
import { publicClient } from "../services/PublicClient";
import { parseAbi, type GetLogsReturnType } from "viem";
// zustand nameing is (use***store)
import type { Log } from "viem";


//set은 상태변경하는 함수 전달, get은 상태값을 가져오는 함수 전달,create((set, get) => ({  }))

export const useLogStore = create<{ logs: Log[]; fetchLogs: (account: string) => Promise<void>; setLogs: (newLogs: Log[]) => void }>((set) => ({
	logs:[],
	fetchLogs: async (account) => {
		const currentBlock = await publicClient.getBlockNumber();
		try {
			const logs = await publicClient.getLogs({  
				address: '0x6A7577c10cD3F595eB2dbB71331D7Bf7223E1Aac', // Contract Address BUSD
				events: parseAbi(['event Transfer(address indexed from, address indexed to, uint256 value)', 'event Approval(address indexed owner, address indexed sender, uint256 value)']),
				fromBlock: currentBlock - 999n,
		});
		set({ logs }); // 상태 업데이트
	} catch (error) {
		console.error("Error fetching logs:", error);
		set({ logs: [] }); // 에러 시 빈 배열로 초기화
	}
	},
	setLogs: (newLogs:Log[]) => set({ logs: newLogs }),

}));