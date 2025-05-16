pragma solidity ^0.8.0;

contract FlexStake {
    mapping(address => uint256) public stakes;
    mapping(address => uint256) public rewards;
    uint256 public totalStaked;
    uint256 public rewardRate;
    address public owner;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);

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

        stakes[msg.sender] += msg.value;
        totalStaked += msg.value;

        emit Staked(msg.sender, msg.value);
    }

    function unstake(uint256 _amount) external {
        require(_amount > 0, "Cannot unstake 0");
        require(stakes[msg.sender] >= _amount, "Insufficient stake");

        stakes[msg.sender] -= _amount;
        totalStaked -= _amount;
        payable(msg.sender).transfer(_amount);

        emit Unstaked(msg.sender, _amount);
    }

    function distributeRewards() external onlyOwner {
        for (address staker : stakes) {
            uint256 reward = stakes[staker] * rewardRate / 100;
            rewards[staker] += reward;
        }
    }

    function claimReward() external {
        uint256 reward = rewards[msg.sender];
        require(reward > 0, "No rewards to claim");

        rewards[msg.sender] = 0;
        payable(msg.sender).transfer(reward);

        emit RewardPaid(msg.sender, reward);
    }
}
