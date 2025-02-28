import { useState, memo } from 'react';
import { Typography, Slider, TextField, Select, MenuItem, FormControl, InputLabel, Button, Stack } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../../contexts/WalletContext';
import BaseModal from './BaseModal';

export interface AgentRequirements {
  duration: number;
  frequency: number;
  frequencyUnit: string;
  photoOption: string;
  creativity: number;
}

interface AgentConfigModalProps {
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
}

const AgentConfigModal = memo(function AgentConfigModal({ open, onClose, agent }: AgentConfigModalProps) {
  const [step, setStep] = useState<'requirements' | 'review'>('requirements');
  const { address, connectWallet } = useWallet();
  
  // Requirements state
  const [requirements, setRequirements] = useState<AgentRequirements>({
    duration: 1,
    frequency: 1,
    frequencyUnit: 'day',
    photoOption: 'generate',
    creativity: 50
  });

  const handleRequirementChange = (
    field: keyof AgentRequirements, 
    value: number | string
  ) => {
    setRequirements(prev => ({ ...prev, [field]: value }));
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    if ((page === 0 && newDirection === -1) || (page === 1 && newDirection === 1)) return;
    setPage([page + newDirection, newDirection]);
    if (newDirection === 1) {
      setStep('review');
    } else {
      setStep('requirements');
    }
  };

  // Update handlers to use paginate
  const handleContinue = () => paginate(1);
  const handleBack = () => paginate(-1);

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
    '& .MuiSelect-icon': {
      color: 'var(--text-primary)',
    },
  };

  const renderRequirementsContent = () => (
    <Stack spacing={3} className="h-full flex flex-col">
      {/* Description with custom scrollbar - max 3 lines on mobile before scrolling */}
      <div className="max-h-[4.5em] overflow-y-auto text-theme-text-secondary mb-4
        scrollbar-thin scrollbar-thumb-theme-border-primary 
        scrollbar-track-transparent hover:scrollbar-thumb-theme-border-secondary
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-theme-border-primary
        [&::-webkit-scrollbar-thumb:hover]:bg-theme-border-secondary
        [&::-webkit-scrollbar-track]:bg-transparent
        md:max-h-none md:overflow-y-visible">
        <Typography>
          {agent.description}
        </Typography>
      </div>

      <div className="bg-theme-panel-bg backdrop-blur-xl rounded-lg p-4 border border-theme-border-primary flex-1">
        <Stack spacing={3}>
          <TextField
            value={requirements.duration}
            onChange={(e) => handleRequirementChange('duration', Number(e.target.value))}
            autoFocus
            fullWidth
            type="number"
            label="Campaign Duration (days)"
            InputProps={{ 
              inputProps: { min: 1 },
              sx: { color: 'var(--text-primary)' }
            }}
            sx={inputStyles}
          />

          <div className="flex gap-4">
            <TextField
              value={requirements.frequency}
              onChange={(e) => handleRequirementChange('frequency', Number(e.target.value))}
              type="number"
              label="Frequency of Posts"
              InputProps={{ 
                inputProps: { min: 1 },
                sx: { color: 'var(--text-primary)' }
              }}
              sx={inputStyles}
              className="flex-1"
            />
            <FormControl sx={inputStyles} className="min-w-[120px]">
              <InputLabel>Per</InputLabel>
              <Select
                value={requirements.frequencyUnit}
                onChange={(e) => handleRequirementChange('frequencyUnit', e.target.value)}
                label="Per"
              >
                <MenuItem value="minute">Minute</MenuItem>
                <MenuItem value="hour">Hour</MenuItem>
                <MenuItem value="day">Day</MenuItem>
              </Select>
            </FormControl>
          </div>

          <FormControl sx={inputStyles}>
            <InputLabel>Photo Options</InputLabel>
            <Select
              value={requirements.photoOption}
              onChange={(e) => handleRequirementChange('photoOption', e.target.value)}
              label="Photo Options"
            >
              <MenuItem value="generate">Generate AI Photos</MenuItem>
              <MenuItem value="upload">Upload Own Photos</MenuItem>
            </Select>
          </FormControl>

          <div>
            <Typography className="text-theme-text-primary mb-2 font-medium tracking-tight">
              Creativity Level: <span className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent">{requirements.creativity}%</span>
            </Typography>
            <Slider
              value={requirements.creativity}
              onChange={(_, value) => handleRequirementChange('creativity', Array.isArray(value) ? value[0] : value)}
              aria-label="Creativity"
              valueLabelDisplay="auto"
              sx={{
                color: 'var(--button-primary)',
                '& .MuiSlider-thumb': {
                  backgroundColor: 'var(--text-primary)',
                },
                '& .MuiSlider-track': {
                  backgroundColor: 'var(--button-primary)',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: 'var(--border-primary)',
                },
              }}
            />
          </div>

          <div>
            <Typography className="text-theme-text-primary mb-2 font-medium tracking-tight">
              Tone: <span className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent">50%</span>
            </Typography>
            <Slider
              defaultValue={50}
              valueLabelDisplay="auto"
              sx={{
                color: 'var(--button-primary)',
                '& .MuiSlider-thumb': {
                  backgroundColor: 'var(--text-primary)',
                },
                '& .MuiSlider-track': {
                  backgroundColor: 'var(--button-primary)',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: 'var(--border-primary)',
                },
              }}
            />
          </div>
        </Stack>
      </div>

      <Button
        variant="contained"
        size="medium"
        className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover hover:from-theme-button-hover hover:to-theme-button-primary text-white mt-auto"
        onClick={handleContinue}
      >
        Continue to Review
      </Button>
    </Stack>
  );

  const renderReviewContent = () => (
    <Stack spacing={2} className="text-theme-text-primary h-full flex flex-col justify-between">
      {/* Top section with welcome text */}
      <div>
        <Typography className="mt-4 mb-6 text-theme-text-secondary text-xl">
          You are about to hire{' '}
          <a 
            href={agent.websiteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent font-medium hover:opacity-80 transition-opacity"
          >
            {agent.name}
          </a>
          {' '}for a social media campaign, below are the details!
        </Typography>

        <div className="bg-theme-panel-bg backdrop-blur-xl rounded-lg p-4 border border-theme-border-primary">
          <Typography variant="h6" className="mb-3 text-sm font-medium tracking-tight bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent">
            Timeline
          </Typography>
          
          <Stack spacing={2}>
            <div className="flex items-center justify-between text-base">
              <Typography className="text-theme-text-secondary">Estimated Start</Typography>
              <Typography className="text-theme-text-primary">
                Within 24 hours
              </Typography>
            </div>
            
            <div className="flex items-center justify-between text-base">
              <Typography className="text-theme-text-secondary">Campaign Length</Typography>
              <Typography className="text-theme-text-primary">
                {requirements.duration} days
              </Typography>
            </div>
        
          </Stack>
        </div>

        <div className="bg-theme-panel-bg backdrop-blur-xl rounded-lg p-4 border border-theme-border-primary mt-3">
          <Typography variant="h6" className="mb-3 text-sm font-medium tracking-tight bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent">
            Campaign Details
          </Typography>
          
          <Stack spacing={2}>
            <div className="flex items-center justify-between text-base">
              <Typography className="text-theme-text-secondary">Duration</Typography>
              <Typography className="text-theme-text-primary">
                {requirements.duration} days
              </Typography>
            </div>
            
            <div className="flex items-center justify-between text-base">
              <Typography className="text-theme-text-secondary">Frequency</Typography>
              <Typography className="text-theme-text-primary">
                {requirements.frequency} posts per {requirements.frequencyUnit}
              </Typography>
            </div>
            
            <div className="flex items-center justify-between text-base">
              <Typography className="text-theme-text-secondary">Photo Option</Typography>
              <Typography className="text-theme-text-primary capitalize">
                {requirements.photoOption}
              </Typography>
            </div>
            
            <div className="flex items-center justify-between text-base">
              <Typography className="text-theme-text-secondary">Creativity Level</Typography>
              <Typography className="text-theme-text-primary">
                {requirements.creativity}%
              </Typography>
            </div>
          </Stack>
        </div>
      </div>

      {/* Bottom section with price and actions */}
      <div className="mt-auto">
        <div className="bg-theme-panel-bg backdrop-blur-xl rounded-lg p-4 border border-theme-border-primary mb-3">
          <Typography variant="h6" className="text-right mb-0 text-lg font-medium tracking-tight">
            Total Price: <span className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent">{calculateTotalPrice()} USDC</span>
          </Typography>
        </div>

        <div className="flex justify-between gap-3">
          <Button
            variant="outlined"
            size="large"
            onClick={handleBack}
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
      </div>
    </Stack>
  );

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={agent.name}
      tags={agent.tags}
    >
      <div className="relative flex items-center justify-center h-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0 w-full px-4"
          >
            {step === 'requirements' ? renderRequirementsContent() : renderReviewContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </BaseModal>
  );
});

export default AgentConfigModal;