import { useState } from 'react';
import { TextField, Button, Box, Alert, Stack, Typography } from '@mui/material';
import { coinbaseProvider } from '@/lib/coinbaseWallet';
import { getAgentMarketplaceContract } from '@/contracts/types/AgentMarketPlace';
import { useRouter } from 'next/navigation';

interface AgentFormData {
  name: string;
  description: string;
  price: number;
  walletAddress: string;
  url: string;
  tags: string;
}

export function UploadAgentForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    description: '',
    price: 0,
    walletAddress: '',
    url: '',
    tags: ''
  });
  const [status, setStatus] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | null;
    txHash?: string;
  }>({ message: '', type: null });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ message: 'Uploading agent...', type: 'info' });

    try {
      if (!coinbaseProvider) throw new Error("Wallet provider not initialized");
      const contract = getAgentMarketplaceContract(coinbaseProvider, 'localhost');
      
      const agentId = `agent-${Date.now()}`;
      const priceInUSDC = formData.price * 1_000_000;

      const tx = await contract.registerAgent(agentId, priceInUSDC);
      const receipt = await tx.wait();

      setStatus({ 
        message: 'Agent registered successfully!', 
        type: 'success',
        txHash: receipt.transactionHash 
      });
    } catch (error) {
      console.error('Upload failed:', error);
      setStatus({ 
        message: 'Failed to register agent', 
        type: 'error' 
      });
    }
  };

  const inputStyles = {
    '& .MuiInputLabel-root': {
      color: 'var(--text-secondary)',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'var(--text-primary)',
    },
    '& .MuiOutlinedInput-root': {
      color: 'var(--text-primary)',
      '& fieldset': {
        borderColor: 'var(--border-primary)',
      },
      '&:hover fieldset': {
        borderColor: 'var(--border-secondary)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--button-primary)',
      },
    },
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2 }}
    >
      <Typography 
        variant="h4" 
        className="text-theme-text-primary font-bold mb-4"
      >
        Register New Agent
      </Typography>

      <hr className="border-theme-border-primary mb-6" />

      <div className="bg-theme-panel-bg backdrop-blur-xl rounded-lg p-6 border border-theme-border-primary shadow-xl shadow-black/10">
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Agent Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            sx={{
              ...inputStyles,
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--button-primary)',
                borderWidth: '2px',
              },
            }}
          />

          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            multiline
            rows={4}
            required
            sx={inputStyles}
          />

          <TextField
            fullWidth
            label="Price (USDC)"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            required
            sx={inputStyles}
          />

          <TextField
            fullWidth
            label="Wallet Address"
            value={formData.walletAddress}
            onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
            required
            sx={inputStyles}
          />

          <TextField
            fullWidth
            label="Agent URL"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            required
            sx={inputStyles}
          />

          <TextField
            fullWidth
            label="Tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            helperText="Enter tags separated by commas (e.g., AI, Writing, Analysis)"
            required
            sx={inputStyles}
          />
        </Stack>
      </div>

      <div className="flex flex-col gap-5">
        <Button 
          type="submit" 
          variant="contained" 
          fullWidth
          className="mt-6 bg-gradient-to-r from-theme-button-primary to-theme-button-hover hover:from-theme-button-hover hover:to-theme-button-primary text-white h-12 text-lg font-medium"
        >
          Register Agent
        </Button>

        <Button 
          variant="outlined" 
          fullWidth
          onClick={() => router.push('/')}
          className="h-12 text-lg font-medium border-theme-button-primary text-theme-button-primary hover:border-theme-button-hover hover:bg-theme-button-primary/5"
        >
          Cancel
        </Button>
      </div>

      {status.type && (
        <Alert 
          severity={status.type} 
          className="mt-4 bg-theme-panel-bg border border-theme-border-primary"
        >
          {status.message}
          {status.txHash && (
            <div className="mt-2">
              <a 
                href={`https://sepolia.basescan.org/tx/${status.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-theme-button-primary hover:text-theme-button-hover underline"
              >
                View transaction
              </a>
            </div>
          )}
        </Alert>
      )}
    </Box>
  );
}