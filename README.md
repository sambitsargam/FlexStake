# FlexStake
FlexStake introduces programmable, modular restaking vaults that let users choose custom AVS exposure, auto-rotate risk, and earn boosted yield through dynamic delegation strategies — all secured by a decentralized slashing insurance pool.

## Smart Contract

The FlexStake smart contract allows users to stake, unstake, and earn rewards. Below is a brief overview of its functionalities and how to interact with it.

### Contract Overview

The FlexStake contract is designed to manage staking and reward distribution. Users can stake their tokens, unstake them, and claim rewards based on the amount staked and the reward rate set by the contract owner.

### Key Functions

- `stake()`: Allows users to stake tokens.
- `unstake(uint256 _amount)`: Allows users to unstake a specified amount of tokens.
- `distributeRewards()`: Allows the contract owner to distribute rewards to all stakers.
- `claimReward()`: Allows users to claim their accumulated rewards.

### Deployment

To deploy the FlexStake contract, you can use the following code snippet:

```solidity
pragma solidity ^0.8.0;

import "./FlexStake.sol";

contract DeployFlexStake {
    function deploy(uint256 _rewardRate) public returns (address) {
        FlexStake flexStake = new FlexStake(_rewardRate);
        return address(flexStake);
    }
}
```

### Interacting with the Contract

Here are some examples of how to interact with the FlexStake contract:

#### Staking Tokens

```solidity
FlexStake flexStake = FlexStake(contractAddress);
flexStake.stake{value: amount}();
```

#### Unstaking Tokens

```solidity
FlexStake flexStake = FlexStake(contractAddress);
flexStake.unstake(amount);
```

#### Claiming Rewards

```solidity
FlexStake flexStake = FlexStake(contractAddress);
flexStake.claimReward();
```

## Frontend Setup

The FlexStake frontend allows users to interact with the smart contract through a web interface. Below are the instructions for setting up and running the frontend.

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sambitsargam/FlexStake.git
   cd FlexStake/frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Frontend

To start the frontend application, run the following command:
```bash
npm start
```

This will start a local development server and open the application in your default web browser.

### Building for Production

To build the frontend for production, run the following command:
```bash
npm run build
```

This will create a `dist` directory with the production build of the application.

## Blockchain Terminology

FlexStake is a blockchain project that includes components and terminology related to blockchain technology. Below are some key terms used in the project:

- **Wallet**: A digital wallet that allows users to store and manage their tokens.
- **Staking**: The process of locking up tokens to support the network and earn rewards.
- **Delegation**: The act of delegating tokens to a validator to earn rewards.
- **Slashing Insurance**: A mechanism to protect stakers from penalties due to validator misbehavior.
