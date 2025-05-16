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
