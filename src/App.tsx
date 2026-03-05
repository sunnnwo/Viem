import { formatEther} from 'viem';
import './App.css'
import { useBlockNumber } from './services/blockNumber'
import { GetMyAccount } from './services/getMyAccount';
import { useEffect } from 'react';
import { useLogStore } from './store/logStore';



function LogComponent() {
	const logs = useLogStore((state) => state.logs);
	if (logs.length === 0) {
		return <p>No logs found.</p>;
	}
    return (
      <>
        {logs.slice(0, 10).map((log, index) => (
          <li key={index}>
            {/* log는 객체입니다. 
					단순히 {log}라고 쓰면 에러가 나거나 이상한 값이 나옵니다.
					반드시 아래처럼 구체적인 키를 써주세요.
				*/}
				<div>{index}</div>
				<div>EventName: {log.eventName}</div>
				<div>TransactionHash: {log.transactionHash}</div>
				<div>From / Owner: {log.args?.from || log.args?.owner}</div>
				<div>To / Spender: {log.args?.to || log.args?.sender}</div>
				<div>Approval Value: {formatEther(log.args?.value)} </div>
				</li>
			))}
	  </>
	);}



function App() {
	const setLogs = useLogStore((state) => state.setLogs);
	const fetchLogs = useLogStore((state) => state.fetchLogs);

	const blockNumber = useBlockNumber();
	const account = GetMyAccount();

	useEffect(() => {
		if (account) {
			setLogs([]); // 계정이 바뀔 때마다 로그 초기화
			fetchLogs(account);
		}
  }, [account, fetchLogs, setLogs]);

  
  return (
    <>
      <p>Current Block Number: {blockNumber}</p>
      <p>My Account: {account}</p>
	  <div>
		<ul>
			<LogComponent />
		</ul>
	  </div>
    </>
  )

}

export default App


// useEffect(() => {
// let isCurrent = true; // 컴포넌트가 여전히 마운트되어 있는지 추적하는 변수
		// setLogs([]); // 계정이 바뀔 때마다 로그 초기화

		// async function initLog(){			
			
		// 	const data = await getMyLogs(account);
		// 	if (isCurrent) {
		// 		setLogs(data);
		// 	}
		// }
		// if (account) {
		// 	initLog();
		// }
		// return () => {
		// 	isCurrent = false; // 컴포넌트가 언마운트될 때 isCurrent를 false로 설정
		// }