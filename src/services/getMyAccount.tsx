import { useEffect, useState } from "react";
import { walletClient } from "./WalletClient";

export function GetMyAccount(){
	const [address, setAddress] = useState<string | null>(null);
//at first use requestAddress and use getAddress to get the current account.
	useEffect(() => {
			walletClient?.requestAddresses().then(accounts => {
			setAddress(accounts?.[0] || null);
			console.log("accounts:", accounts);
		});
	// Listen for account changes, 이해가 필요함.
		// const handleAccountsChanged = (accounts: string[]) => {
		// 	setAddress(accounts?.[0] || null);
		// 	console.log("accountsChanged:", accounts);
		// };

		// const provider = (window as any).ethereum;
		// if(provider && provider.on) {
		// 	provider.on('accountsChanged', handleAccountsChanged);
		// }
		
		// return () => {
		// 	if(provider && provider.removeListener) {
		// 		provider.removeListener('accountsChanged', handleAccountsChanged);
		// 	}
		// };
},[])
	return address;
}