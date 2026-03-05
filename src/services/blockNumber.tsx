import { publicClient } from './PublicClient';
import { useEffect, useState } from 'react';
import { getBlockNumber } from 'viem/actions';

export function useBlockNumber() {
	const [blockNumber, setBlockNumber] = useState<bigint | null>(null);

	useEffect(() => {
		getBlockNumber(publicClient).then(setBlockNumber);
	},[]);

	return blockNumber;	

}