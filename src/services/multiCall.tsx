import { publicClient } from "./PublicClient";
import { myerc20Abi } from "../constants/myerc20abi";
import { useAccountStore } from "../store/accountStore";
import { useLogStore } from "../store/logStore";

const { account } = useAccountStore.getState();

// const logs = useLogStore((state) => state.logs);
// 	if (logs.length === 0) {
// 		return <p>No logs found.</p>;
// 	}
// {logs.slice(0, 10).map((log, index) => (
// 		  <li key={index}>
// 			{/* log는 객체입니다.
// 					단순히 {log}라고 쓰면 에러가 나거나 이상한 값이 나옵니다.
// 					반드시 아래처럼 구체적인 키를 써주세요.
// 				*/}
// 				<div>{index}</div>
// 				<div>EventName: {log.eventName}</div>
// 				<div>TransactionHash: {log.transactionHash}</div>
// 				<div>From / Owner: {log.args?.from || log.args?.owner}</div>
// 				<div>To / Spender: {log.args?.to || log.args?.sender}</div>
// 				<div>Approval Value: {formatEther(log.args?.value)} </div>
// 				</li>
// 			))}

const myerc20Contract = {
  address: "0x6A7577c10cD3F595eB2dbB71331D7Bf7223E1Aac",
  abi: myerc20Abi,
} as const;
//balanceOf, totalSupply, allowance, owner, ownerOf, symbol
const results = await publicClient.multicall({
  contracts: [
    {
      ...myerc20Contract,
      functionName: "totalSupply",
    },
    {
      ...myerc20Contract,
      functionName: "balanceOf",
      args: [account || "0x0000000000000000000000000000000000000000"], // account가 null일 경우 0x00...00 주소로 대체
    },
    {
      ...myerc20Contract,
      functionName: "allowance",
      args: [account || "0x0000000000000000000000000000000000000000"], // account가 null일 경우 0x00...00 주소로 대체
    },
    {
      ...myerc20Contract,
      functionName: "symbol",
    },
    {
      ...myerc20Contract,
      functionName: "owner",
    },
  ],
});

console.log(results);
