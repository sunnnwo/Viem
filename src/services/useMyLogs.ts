import { useEffect, useState } from "react";
import { getMyLogs } from "./getLogMyTransaction";
import { type Hex } from "viem";
import { type GetLogsReturnType } from 'viem';


export function useMyLogs(address: Hex | null) {
	const [logs, setLogs] = useState<GetLogsReturnType>([]);

	useEffect(() => {
		if (!address) return;
		
		getMyLogs(address)
			.then(setLogs)
			.catch((err)=>(console.error("Error fetching logs:", err)));

	}, [address]);

	return logs;

}