import React, { useEffect, useState } from 'react';
import Wallet from './components/Wallet';
import Staking from './components/Staking';
import SlashingInsurance from './components/SlashingInsurance';
import { ethers } from 'ethers';
import FlexStake from './contracts/FlexStake.json';

function App() {
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [totalStaked, setTotalStaked] = useState(0);
  const [rewardRate, setRewardRate] = useState(0);
  const [contractBalance, setContractBalance] = useState(0);

  useEffect(() => {
    async function initializeContract() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        'YOUR_CONTRACT_ADDRESS',
        FlexStake.abi,
        signer
      );
      setProvider(provider);
      setContract(contract);
      updateUIFromContractState(contract);
    }

    initializeContract();
  }, []);

  async function updateUIFromContractState(contract) {
    const [totalStaked, rewardRate, contractBalance] = await contract.getContractState();
    setTotalStaked(totalStaked.toString());
    setRewardRate(rewardRate.toString());
    setContractBalance(contractBalance.toString());
  }

  function animateElement(element) {
    element.classList.add('animate');
    setTimeout(() => {
      element.classList.remove('animate');
    }, 1000);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>FlexStake</h1>
      </header>
      <main>
        <Wallet />
        <Staking contract={contract} />
        <SlashingInsurance />
        <div>
          <h2>Contract State</h2>
          <p>Total Staked: {totalStaked}</p>
          <p>Reward Rate: {rewardRate}%</p>
          <p>Contract Balance: {contractBalance} ETH</p>
        </div>
      </main>
    </div>
  );
}

export default App;
