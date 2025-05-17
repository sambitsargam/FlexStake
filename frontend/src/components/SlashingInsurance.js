import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import FlexStake from '../contracts/FlexStake.json';

function SlashingInsurance({ contract }) {
  const [insuranceAmount, setInsuranceAmount] = useState(0);
  const [totalStaked, setTotalStaked] = useState(0);
  const [rewardRate, setRewardRate] = useState(0);
  const [contractBalance, setContractBalance] = useState(0);

  useEffect(() => {
    if (contract) {
      updateUIFromContractState(contract);
      listenForContractEvents(contract);
    }
  }, [contract]);

  const handlePurchaseInsurance = async () => {
    if (contract) {
      const tx = await contract.purchaseInsurance({ value: ethers.utils.parseEther(insuranceAmount.toString()) });
      await tx.wait();
      updateUIFromContractState(contract);
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

  return (
    <div className="SlashingInsurance">
      <h2>Slashing Insurance</h2>
      <div>
        <input
          type="number"
          value={insuranceAmount}
          onChange={(e) => setInsuranceAmount(e.target.value)}
          placeholder="Insurance Amount"
        />
        <button onClick={handlePurchaseInsurance}>Purchase Insurance</button>
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

export default SlashingInsurance;
