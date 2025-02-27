import { memo } from 'react';
import { Modal, Box, Typography, IconButton, Button, Stack, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Code } from '@mui/icons-material';
import { useWallet } from '../../contexts/WalletContext';
import { AgentRequirements } from './RequirementsModal';

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
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="review-modal"
      className="flex items-center justify-center"
      slotProps={{
        backdrop: {
          style: { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
          TransitionComponent: Fade
        }
      }}
      disableRestoreFocus
      disableEnforceFocus={false}
      disableAutoFocus
      disablePortal={false}
      style={{ position: 'fixed', zIndex: 200 }}
    >
      <Box className="relative bg-theme-bg-primary
        border border-theme-border-primary rounded-lg p-6 w-[95%] max-w-2xl 
        max-h-[90vh] overflow-y-auto" 
        sx={{ position: 'relative' }}
      >
        {/* Background gradients matching main page */}
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-theme-bg-primary via-theme-bg-secondary to-theme-bg-accent opacity-20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(167,139,250,0.15),transparent_50%)]" />
        </div>

        {/* Content with backdrop blur */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <Code className="text-4xl text-theme-button-primary" />
              <div>
                <Typography variant="h5" className="text-lg font-medium tracking-tight bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent">
                  {agent.name}
                </Typography>
                <div className="flex flex-wrap gap-2 mt-2">
                  {agent.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-full bg-gradient-to-r from-theme-button-primary to-theme-button-hover text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <IconButton onClick={onClose} className="text-theme-text-primary hover:text-theme-text-secondary">
              <CloseIcon />
            </IconButton>
          </div>

          {/* Description */}
          <Typography className="text-theme-text-secondary mb-8">
            {agent.description}
          </Typography>

          {/* Review Content */}
          <Stack spacing={4} className="text-theme-text-primary">
            <div className="bg-theme-panel-bg backdrop-blur-xl rounded-lg p-6 border border-theme-border-primary">
              <Typography variant="h6" className="mb-6 text-lg font-medium tracking-tight bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent">
                Campaign Details
              </Typography>
              
              <Stack spacing={3}>
                <div className="flex items-center justify-between">
                  <Typography className="text-theme-text-secondary">Duration</Typography>
                  <Typography className="text-theme-text-primary font-medium">
                    {requirements.duration} days
                  </Typography>
                </div>
                
                <div className="flex items-center justify-between">
                  <Typography className="text-theme-text-secondary">Frequency</Typography>
                  <Typography className="text-theme-text-primary font-medium">
                    {requirements.frequency} posts per {requirements.frequencyUnit}
                  </Typography>
                </div>
                
                <div className="flex items-center justify-between">
                  <Typography className="text-theme-text-secondary">Photo Option</Typography>
                  <Typography className="text-theme-text-primary font-medium capitalize">
                    {requirements.photoOption}
                  </Typography>
                </div>
                
                <div className="flex items-center justify-between">
                  <Typography className="text-theme-text-secondary">Creativity Level</Typography>
                  <Typography className="text-theme-text-primary font-medium">
                    {requirements.creativity}%
                  </Typography>
                </div>
              </Stack>
            </div>

            <div className="border-t border-theme-border-primary pt-6">
              <div className="bg-theme-panel-bg backdrop-blur-xl rounded-lg p-6 border border-theme-border-primary">
                <Typography variant="h6" className="text-right mb-0 font-medium tracking-tight">
                  Total Price: <span className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent">{calculateTotalPrice()} USDC</span>
                </Typography>
              </div>
            </div>

            <div className="flex justify-between gap-4 pt-2">
              <Button
                variant="outlined"
                size="large"
                onClick={onBack}
                className="flex-1 border-theme-button-primary text-theme-button-primary hover:border-theme-button-hover hover:bg-theme-button-primary/5"
              >
                Back
              </Button>
              <Button
                variant="contained"
                size="large"
                className="flex-1 bg-gradient-to-r from-theme-button-primary to-theme-button-hover hover:from-theme-button-hover hover:to-theme-button-primary text-white"
                onClick={handlePayClick}
              >
                {address ? 'Pay Now' : 'Connect Wallet'}
              </Button>
            </div>
          </Stack>
        </div>
      </Box>
    </Modal>
  );
});

export default ReviewModal;
