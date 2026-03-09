// import {create} from 'zustand'
// import { walletClient } from '../services/WalletClient';

// export const useAccountStore = create<{ account: string | null; fetchAccount: () => Promise<void> }>((set) => ({
// 	account : null,
// 	fetchAccount: async () => {
// 		try {
// 			const accounts = await walletClient?.requestAddresses();
// 			set({ account: accounts?.[0] || null });
// 			console.log("accounts:", accounts);
// 		} catch (error) {
// 			console.error("Error fetching account:", error);
// 			set({ account: null });
// 		}
// 	},
// }));
