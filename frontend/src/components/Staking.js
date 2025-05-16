import React, { useState } from 'react';

function Staking() {
  const [stakeAmount, setStakeAmount] = useState(0);
  const [delegationAmount, setDelegationAmount] = useState(0);

  const handleStake = () => {
    // Logic to stake tokens
    console.log(`Staked ${stakeAmount} tokens`);
  };

  const handleDelegate = () => {
    // Logic to delegate tokens
    console.log(`Delegated ${delegationAmount} tokens`);
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
    </div>
  );
}

export default Staking;
