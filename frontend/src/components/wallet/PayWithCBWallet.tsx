import { Button } from '@mui/material';
import { useWallet } from '@/contexts/WalletContext';
import { coinbaseProvider } from '@/lib/coinbaseWallet';

interface PayWithCBWalletProps {
  amount: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function PayWithCBWallet({ amount, onSuccess, onError }: PayWithCBWalletProps) {
  const { address, connectWallet } = useWallet();

  const handlePayment = async () => {
    try {
      if (!address) {
        await connectWallet();
        return;
      }

      // Convert amount to Wei (assuming USDC with 6 decimals)
      const amountInWei = BigInt(amount * 1_000_000).toString();

      // Example USDC contract address on Base
      const usdcAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

      // Create the transaction
      const transactionParameters = {
        to: usdcAddress,
        from: address,
        value: amountInWei,
        // You'll need the proper USDC transfer method here
        data: "0xa9059cbb..." // This would be the encoded transfer method
      };

      const txHash = await coinbaseProvider.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      onSuccess?.();
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
      {address ? 'Pay Now' : 'Connect Wallet'}
    </Button>
  );
}