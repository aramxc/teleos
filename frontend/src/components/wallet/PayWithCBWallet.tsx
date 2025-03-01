import { ethers } from 'ethers';
import { Button } from '@mui/material';
import { useSmartContracts } from '@/hooks/useSmartContracts';
import { coinbaseProvider } from '@/lib/coinbaseWallet';
import { useState, useEffect } from 'react';

interface PayWithCBWalletProps {
  agentId: string;
  amount: number;
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
}

export function PayWithCBWallet({ 
  agentId,
  amount,
  onSuccess, 
  onError 
}: PayWithCBWalletProps) {
  const [address, setAddress] = useState<string | null>(null);
  const { getContracts, registerAgent } = useSmartContracts();

  useEffect(() => {
    // Check if already connected
    coinbaseProvider?.send('eth_accounts', [])
      .then((accounts: string[]) => {
        if (accounts[0]) {
          setAddress(accounts[0]);
        }
      })
      .catch(console.error);
  }, []);

  const connectWallet = async () => {
    try {
      if (!coinbaseProvider) throw new Error('Wallet provider not initialized');
      const accounts = await coinbaseProvider.send('eth_requestAccounts', []) as string[];
      if (accounts[0]) {
        setAddress(accounts[0]);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      onError?.(error instanceof Error ? error : new Error('Failed to connect wallet'));
    }
  };

  const handlePayment = async () => {
    try {
      if (!address) {
        await connectWallet();
        return;
      }

      const finalAgentId = agentId || `agent-${Date.now()}`;
      const contracts = await getContracts();
      
      if (!contracts?.marketplaceContract) {
        throw new Error('Contract not initialized');
      }

      const { marketplaceContract } = contracts;
      
      console.log('Attempting to purchase agent:', finalAgentId);
      
      // Use the passed in amount
      const amountInWei = ethers.parseEther(amount.toString());
      
      // Register agent if needed
      const agentDetails = await marketplaceContract.agents(finalAgentId).catch((error: Error) => {
        console.error('Error fetching agent details:', error);
        return null;
      });

      if (!agentDetails?.isActive) {
        console.log('Agent not registered, registering first...');
        try {
          await registerAgent(
            finalAgentId,
            amount, // Use the same passed in amount
            process.env.NEXT_PUBLIC_DEMO_WALLET_ADDRESS
          );
          console.log('Agent registered successfully');
        } catch (regError) {
          console.error('Failed to register agent:', regError);
          throw new Error('Failed to register agent before purchase');
        }
      }

      // Execute the purchase
      console.log('Executing purchase with amount:', amount, 'ETH');
      const purchaseTx = await marketplaceContract.purchaseAgent(finalAgentId, {
        value: amountInWei
      });
      const receipt = await purchaseTx.wait();
      
      const txHash = receipt.transactionHash;
      const explorerUrl = `https://sepolia.basescan.org/tx/${txHash}`;
      
      console.log('Purchase successful! View transaction:', explorerUrl);
      onSuccess?.(txHash);
      
      return txHash;
    } catch (error) {
      console.error('Payment failed:', error);
      onError?.(error instanceof Error ? error : new Error('Payment failed'));
    }
  };

  return (
    <Button
      variant="contained"
      onClick={handlePayment}
      className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover hover:from-theme-button-hover hover:to-theme-button-primary text-white"
    >
      {address ? `Pay ${amount} ETH` : 'Connect Wallet'}
    </Button>
  );
}