import { useState, useEffect, use } from 'react';
import { getBlockNumber } from './viemClient';
import { walletClient } from './walletClient';


// const account = await walletClient?.requestAddresses();

export function useMyBlockNumber() {
  const [data, setData] = useState<bigint | null>(null);

  useEffect(() => {
    getBlockNumber().then(setData);
  }, [data, setData]);

  return { data };
}

export function useMyAccount() {
	const [account, setAccount] = useState<string | null>(null);
	useEffect(() => {
		walletClient?.requestAddresses().then(accounts => {
			setAccount(accounts?.[0] || null);
			console.log("accounts:", accounts);
		});
// Listen for account changes, 이해가 필요함.
		const handleAccountsChanged = (accounts: string[]) => {
			setAccount(accounts?.[0] || null);
			console.log("accountsChanged:", accounts);
		};

		const provider = (window as any).ethereum;
		if(provider && provider.on) {
			provider.on('accountsChanged', handleAccountsChanged);
		}

		return () => {
			if(provider && provider.removeListener) {
				provider.removeListener('accountsChanged', handleAccountsChanged);
			}
		};
	},[]);
	

	return { account, setAccount };
	
}
