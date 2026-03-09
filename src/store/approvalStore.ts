import { create } from "zustand";
import { walletClient } from "../services/WalletClient";
import { formatUnits, parseAbiItem, type Hex } from "viem";
import { publicClient } from "../services/PublicClient";

interface ApprovalState {
  approval: boolean;
  amount: string | bigint;
  spender: string;
  fetchApproval: (account: string) => Promise<void>;
}

export const useApprovalStore = create<ApprovalState>((set) => ({
  approval: false,
  amount: 0n,
  spender: "",
  fetchApproval: async (account: string) => {
    const currentAccount = await walletClient?.getAddresses();

    if (currentAccount?.[0] === account) {
      set({ approval: true });
    } else {
      set({ approval: false });
    }
    try {
      const currentBlock = await publicClient.getBlockNumber();
      const ApprovalLog = await publicClient.getLogs({
        address: "0x6A7577c10cD3F595eB2dbB71331D7Bf7223E1Aac", // Contract Address BUSD
        event: parseAbiItem(
          "event Approval(address indexed owner, address indexed spender, uint256 value)",
        ),
        args: {
          owner: account as Hex,
        },
        fromBlock: currentBlock - 999n,
      });
      console.log("ApprovalLog:", ApprovalLog);
      if (ApprovalLog.length == 0) {
        set({ approval: false, amount: 0n, spender: "" });
        return;
      }
      const latestApproval = [...ApprovalLog].reverse()[0];
      const val = latestApproval.args.value ?? 0n;
      const spenderAddress = latestApproval.args.spender ?? "";
      if (val > 0n) {
        set({
          approval: true,
          amount: formatUnits(val, 18),
          spender: spenderAddress,
        });
      } else {
        set({ approval: false, amount: 0n, spender: "" });
      }
    } catch (error) {
      console.error("Error fetching approval logs:", error);
    }
  },
}));
