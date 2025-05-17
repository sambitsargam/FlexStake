import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import FlexStake from '../contracts/FlexStake.json';

function Staking({ contract }) {
  const [stakeAmount, setStakeAmount] = useState(0);
  const [delegationAmount, setDelegationAmount] = useState(0);
  const [newStakeAmount, setNewStakeAmount] = useState(0);
  const [stakeDuration, setStakeDuration] = useState(0);
  const [totalStaked, setTotalStaked] = useState(0);
  const [rewardRate, setRewardRate] = useState(0);
  const [contractBalance, setContractBalance] = useState(0);

  useEffect(() => {
    if (contract) {
      updateUIFromContractState(contract);
      listenForContractEvents(contract);
    }
  }, [contract]);

  const handleStake = async () => {
    if (contract) {
      const tx = await contract.stake({ value: ethers.utils.parseEther(stakeAmount.toString()) });
      await tx.wait();
      updateUIFromContractState(contract);
      animateElement(document.querySelector('.Staking'));
    }
  };

  const handleDelegate = () => {
    // Logic to delegate tokens
    console.log(`Delegated ${delegationAmount} tokens`);
    animateElement(document.querySelector('.Staking'));
  };

  const handleNewStake = async () => {
    if (contract) {
      const tx = await contract.newStake(ethers.utils.parseEther(newStakeAmount.toString()), stakeDuration);
      await tx.wait();
      updateUIFromContractState(contract);
      animateElement(document.querySelector('.Staking'));
    }
  };

  const updateUIFromContractState = async (contract) => {
    const [totalStaked, rewardRate, contractBalance] = await contract.getContractState();
    setTotalStaked(totalStaked.toString());
    setRewardRate(rewardRate.toString());
    setContractBalance(contractBalance.toString());
  };

  const listenForContractEvents = (contract) => {
    contract.on('ContractStateChanged', () => {
      updateUIFromContractState(contract);
    });
  };

  const animateElement = (element) => {
    element.classList.add('animate');
    setTimeout(() => {
      element.classList.remove('animate');
    }, 1000);
  };

  return (
    <div className="Staking">
      <h2>Staking</h2>
      <div>
        <input
          type="number"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
          placeholder="Stake Amount"
        />
        <button onClick={handleStake}>Stake</button>
      </div>
      <div>
        <input
          type="number"
          value={delegationAmount}
          onChange={(e) => setDelegationAmount(e.target.value)}
          placeholder="Delegation Amount"
        />
        <button onClick={handleDelegate}>Delegate</button>
      </div>
      <div>
        <input
          type="number"
          value={newStakeAmount}
          onChange={(e) => setNewStakeAmount(e.target.value)}
          placeholder="New Stake Amount"
        />
        <input
          type="number"
          value={stakeDuration}
          onChange={(e) => setStakeDuration(e.target.value)}
          placeholder="Stake Duration (days)"
        />
        <button onClick={handleNewStake}>Stake with Duration</button>
      </div>
      <div>
        <h2>Contract State</h2>
        <p>Total Staked: {totalStaked}</p>
        <p>Reward Rate: {rewardRate}%</p>
        <p>Contract Balance: {contractBalance} ETH</p>
      </div>
    </div>
  );
}

export default Staking;
