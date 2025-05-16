import React from 'react';
import Wallet from './components/Wallet';
import Staking from './components/Staking';
import SlashingInsurance from './components/SlashingInsurance';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>FlexStake</h1>
      </header>
      <main>
        <Wallet />
        <Staking />
        <SlashingInsurance />
      </main>
    </div>
  );
}

export default App;
