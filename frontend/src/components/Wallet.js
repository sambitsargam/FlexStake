import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import FlexStake from '../contracts/FlexStake.json';

function Wallet() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState('');
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        'YOUR_CONTRACT_ADDRESS',
        FlexStake.abi,
        signer
      );
      setContract(contract);
    }
  }, []);

  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setAddress(account);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(account);
        setBalance(ethers.utils.formatEther(balance));
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    } else {
      console.error('Ethereum wallet not detected');
    }
  };

  const updateUIFromContractState = async () => {
    if (contract) {
      const [totalStaked, rewardRate, contractBalance] = await contract.getContractState();
      console.log('Total Staked:', totalStaked.toString());
      console.log('Reward Rate:', rewardRate.toString());
      console.log('Contract Balance:', contractBalance.toString());
    }
  };

  useEffect(() => {
    if (contract) {
      contract.on('ContractStateChanged', updateUIFromContractState);
      return () => {
        contract.off('ContractStateChanged', updateUIFromContractState);
      };
    }
  }, [contract]);

  return (
    <div className="Wallet">
      <h2>Wallet</h2>
      <button onClick={handleConnectWallet}>Connect Wallet</button>
      {address && (
        <div>
          <p>Address: {address}</p>
          <p>Balance: {balance} ETH</p>
        </div>
      )}
    </div>
  );
}

export default Wallet;
