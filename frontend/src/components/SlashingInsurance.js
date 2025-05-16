import React, { useState } from 'react';

function SlashingInsurance() {
  const [insuranceAmount, setInsuranceAmount] = useState(0);

  const handlePurchaseInsurance = () => {
    // Logic to purchase slashing insurance
    console.log(`Purchased slashing insurance for ${insuranceAmount} tokens`);
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
    </div>
  );
}

export default SlashingInsurance;
