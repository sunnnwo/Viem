
import './App.css'
import './services/viemClient'
import { useMyBlockNumber, useMyAccount } from './services/useMyActions'

function App() {
	
	const { data: blockNumber } = useMyBlockNumber();
	const { account } = useMyAccount();

  return (
    <>
      <h4><li>Current Block Number: {blockNumber}</li></h4>
      <h4><li>Current Account: {account}</li></h4>
    </>
  )
}

export default App
