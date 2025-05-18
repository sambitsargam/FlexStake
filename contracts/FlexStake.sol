// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FlexStake {
    mapping(address => uint256) public stakes;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public delegations;
    uint256 public totalStaked;
    uint256 public rewardRate;
    address public owner;

    // Track stakers in an array for iteration
    address[] private stakers;
    mapping(address => bool) private isStaker;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event NewStake(address indexed user, uint256 amount, uint256 duration);
    event Delegated(address indexed user, uint256 amount);
    event ContractStateChanged();

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    constructor(uint256 _rewardRate) {
        owner = msg.sender;
        rewardRate = _rewardRate;
    }

    function stake() external payable {
        require(msg.value > 0, "Cannot stake 0");

        if (!isStaker[msg.sender]) {
            isStaker[msg.sender] = true;
            stakers.push(msg.sender);
        }

        stakes[msg.sender] += msg.value;
        totalStaked += msg.value;

        emit Staked(msg.sender, msg.value);
        emit ContractStateChanged();
    }

    // Adjusted newStake to only accept msg.value (no _amount param)
    // and store duration in an event (no on-chain storage)
    function newStake(uint256 _duration) external payable {
        require(msg.value > 0, "Cannot stake 0");
        require(_duration > 0, "Duration must be greater than 0");

        if (!isStaker[msg.sender]) {
            isStaker[msg.sender] = true;
            stakers.push(msg.sender);
        }

        stakes[msg.sender] += msg.value;
        totalStaked += msg.value;

        emit NewStake(msg.sender, msg.value, _duration);
        emit ContractStateChanged();
    }

    function delegate(uint256 _amount) external {
        require(_amount > 0, "Cannot delegate 0");
        require(stakes[msg.sender] >= _amount, "Insufficient stake");

        delegations[msg.sender] += _amount;
        stakes[msg.sender] -= _amount;

        emit Delegated(msg.sender, _amount);
        emit ContractStateChanged();
    }

    function unstake(uint256 _amount) external {
        require(_amount > 0, "Cannot unstake 0");
        require(stakes[msg.sender] >= _amount, "Insufficient stake");

        stakes[msg.sender] -= _amount;
        totalStaked -= _amount;
        payable(msg.sender).transfer(_amount);

        emit Unstaked(msg.sender, _amount);
        emit ContractStateChanged();
    }

    function distributeRewards() external onlyOwner {
        for (uint256 i = 0; i < stakers.length; i++) {
            address staker = stakers[i];
            uint256 stakeAmount = stakes[staker];
            if (stakeAmount > 0) {
                uint256 reward = (stakeAmount * rewardRate) / 100;
                rewards[staker] += reward;
            }
        }
        emit ContractStateChanged();
    }

    function claimReward() external {
        uint256 reward = rewards[msg.sender];
        require(reward > 0, "No rewards to claim");

        rewards[msg.sender] = 0;
        payable(msg.sender).transfer(reward);

        emit RewardPaid(msg.sender, reward);
        emit ContractStateChanged();
    }

    function getContractState() external view returns (uint256, uint256, uint256) {
        return (totalStaked, rewardRate, address(this).balance);
    }
}
