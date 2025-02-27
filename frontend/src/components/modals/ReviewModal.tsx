import { memo } from 'react';
import { Typography, Button, Stack } from '@mui/material';
import { useWallet } from '../../contexts/WalletContext';
import { AgentRequirements } from './RequirementsModal';
import BaseModal from './BaseModal';

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  agent: {
    name: string;
    description: string;
    tags: string[];
    websiteLink: string;
    icon: string;
    price: number;
  };
  requirements: AgentRequirements;
  onBack: () => void;
}

const ReviewModal = memo(function ReviewModal({ open, onClose, agent, requirements, onBack }: ReviewModalProps) {
  const { address, connectWallet } = useWallet();

  const calculateTotalPrice = () => {
    const daysMultiplier = requirements.frequencyUnit === 'day' ? 1 
      : requirements.frequencyUnit === 'hour' ? 24 
      : 1440;
    const postsPerDay = requirements.frequency * daysMultiplier;
    return agent.price * requirements.duration * postsPerDay;
  };

  const handlePayClick = async () => {
    if (!address) {
      await connectWallet();
      return;
    }
    // Handle payment logic here
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={agent.name}
      tags={agent.tags}
    >
      <Stack spacing={3} className="text-theme-text-primary">
        <div className="bg-theme-panel-bg backdrop-blur-xl rounded-lg p-4 border border-theme-border-primary">
          <Typography variant="h6" className="mb-3 text-sm font-medium tracking-tight bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent">
            Campaign Details
          </Typography>
          
          <Stack spacing={2}>
            <div className="flex items-center justify-between text-sm">
              <Typography className="text-theme-text-secondary">Duration</Typography>
              <Typography className="text-theme-text-primary">
                {requirements.duration} days
              </Typography>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <Typography className="text-theme-text-secondary">Frequency</Typography>
              <Typography className="text-theme-text-primary">
                {requirements.frequency} posts per {requirements.frequencyUnit}
              </Typography>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <Typography className="text-theme-text-secondary">Photo Option</Typography>
              <Typography className="text-theme-text-primary capitalize">
                {requirements.photoOption}
              </Typography>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <Typography className="text-theme-text-secondary">Creativity Level</Typography>
              <Typography className="text-theme-text-primary">
                {requirements.creativity}%
              </Typography>
            </div>
          </Stack>
        </div>

        <div className="bg-theme-panel-bg backdrop-blur-xl rounded-lg p-3 border border-theme-border-primary">
          <Typography variant="h6" className="text-right mb-0 text-sm font-medium tracking-tight">
            Total Price: <span className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent">{calculateTotalPrice()} USDC</span>
          </Typography>
        </div>

        <div className="flex justify-between gap-3">
          <Button
            variant="outlined"
            size="medium"
            onClick={onBack}
            className="flex-1 border-theme-button-primary text-theme-button-primary hover:border-theme-button-hover hover:bg-theme-button-primary/5"
          >
            Back
          </Button>
          <Button
            variant="contained"
            size="medium"
            className="flex-1 bg-gradient-to-r from-theme-button-primary to-theme-button-hover hover:from-theme-button-hover hover:to-theme-button-primary text-white"
            onClick={handlePayClick}
          >
            {address ? 'Pay Now' : 'Connect Wallet'}
          </Button>
        </div>
      </Stack>
    </BaseModal>
  );
});

export default ReviewModal;
