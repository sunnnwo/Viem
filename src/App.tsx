import { formatEther } from "viem";
import "./App.css";
import { useBlockNumber } from "./services/blockNumber";
import { GetMyAccount } from "./services/getMyAccount";
import { useEffect, useState } from "react";
import { useLogStore } from "./store/logStore";
import { useApprovalStore } from "./store/approvalStore";

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
          <div>{index + 1}</div>
          <div>EventName: {log.eventName}</div>
          <div>BlockNumber: {log.blockNumber?.timestamp}</div>
          <div>TransactionHash: {log.transactionHash}</div>
          <div>From / Owner: {log.args?.from || log.args?.owner}</div>
          <div>To / Spender: {log.args?.to || log.args?.sender}</div>
          <div>Approval Value: {formatEther(log.args?.value)} </div>
        </li>
      ))}
    </>
  );
}

function Modal() {
  const { approval, amount, spender } = useApprovalStore();
  return (
    <div className="modal">
      <div className="modal-content">
        {approval
          ? `You have approved ${spender} to spend ${amount} BUSD on your behalf.`
          : "You have not approved any spender to spend your BUSD."}
      </div>
    </div>
  );
}

function App() {
  const setLogs = useLogStore((state) => state.setLogs);
  const fetchLogs = useLogStore((state) => state.fetchLogs);
  const [modal, setModal] = useState(false);
  const fetchApproval = useApprovalStore((state) => state.fetchApproval); // 1. 함수 가져오기

  const blockNumber = useBlockNumber();
  const account = GetMyAccount();

	//logStore
  useEffect(() => {
    if (account) {
      setLogs([]); // 계정이 바뀔 때마다 로그 초기화
      fetchLogs(account);
    }
  }, [account, fetchLogs, setLogs]);

//approvalStore
  useEffect(() => {
    if (account) {
      setLogs([]);
      fetchLogs(account);
      fetchApproval(account);
    }
  }, [account, fetchLogs, fetchApproval, setLogs]); // 의존성 배열에 추가
  return (
    <>
      <p>Current Block Number: {blockNumber}</p>
      <p
        onClick={() => {
          setModal(!modal);
        }}
      >
        My Account Approval: {account}
      </p>
      <div>
        <ul>
          <LogComponent />
          {/* 제대로 연결된 주소가 있으면 modal 보이게 */}
          {modal == true ? <Modal /> : null}
        </ul>
      </div>
    </>
  );
}

export default App;

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
