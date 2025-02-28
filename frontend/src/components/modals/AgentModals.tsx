import { useState, memo } from 'react';
import { Typography, Slider, TextField, Select, MenuItem, FormControl, InputLabel, Button, Stack, Tooltip } from '@mui/material';
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
  
    price: number;
  };
  onBack: () => void;
}

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
  onHire: () => void;
  agent: {
    name: string;
    description: string;
    tags: string[];
    websiteLink: string;
    icon: string;
    price: number;
  };
}

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

const AgentInfoModal = memo(function AgentInfoModal({ open, onClose, onHire, agent }: InfoModalProps) {
  const handleHire = () => {
    onHire();
  };

  return (
    <BaseModal open={open} onClose={onClose} title={agent.name} icon={agent.icon}>
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            key="info-modal"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="h-full flex flex-col"
          >
            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto flex flex-col justify-end">
              <Stack spacing={3}>
                {/* Wrap everything in the styled container */}
                <div className="bg-theme-panel-bg backdrop-blur-xl rounded-lg p-4 border border-theme-border-primary">
                  <Stack spacing={3}>
                    {/* Description Panel */}
                    <Typography className="text-theme-text-secondary text-base">
                      {agent.description}
                    </Typography>

                    {/* Tags Panel */}
                    <div className="flex justify-center">
                      <div className="flex flex-wrap gap-2">
                        {agent.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-4 py-1.5 text-sm rounded-full bg-gradient-to-r from-theme-button-primary to-theme-button-hover text-white border border-slate-700/50 whitespace-nowrap"
                          >
                            {tag}
                          </span>
                        ))}
                        {agent.tags.length > 3 && (
                          <Tooltip 
                            title={
                              <div className="flex flex-wrap gap-2 p-2">
                                {agent.tags.slice(3).map((tag, index) => (
                                  <span
                                    key={index}
                                    className="px-4 py-1.5 text-sm rounded-full bg-gradient-to-r from-theme-button-primary to-theme-button-hover text-white border border-theme-border-primary whitespace-nowrap"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            }
                            arrow
                            placement="top"
                          >
                            <span className="px-4 py-1.5 text-sm rounded-full bg-theme-bg-accent text-theme-text-secondary border border-theme-border-primary cursor-pointer hover:bg-theme-bg-accent/80">
                              +{agent.tags.length - 3} more
                            </span>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </Stack>
                </div>
              </Stack>
            </div>

            {/* Bottom Actions - Fixed at bottom */}
            <div className="flex justify-between p-4 border-t border-theme-border-primary bg-theme-panel-bg/30 backdrop-blur-sm mt-4">
              {agent.websiteLink && (
                <Button
                  variant="outlined"
                  href={agent.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-theme-button-primary text-theme-button-primary hover:border-theme-button-hover hover:bg-theme-button-primary/5"
                >
                  Visit Website
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleHire}
                className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover hover:from-theme-button-hover hover:to-theme-button-primary text-white"
              >
                Hire Now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </BaseModal>
  );
});

const AgentConfigModal = memo(function AgentConfigModal({ open, onClose, agent, onBack }: AgentConfigModalProps) {
  const [currentStep, setCurrentStep] = useState<'requirements' | 'review'>('requirements');
  const [direction, setDirection] = useState(0);
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
    <Stack spacing={2} className="h-full flex flex-col">
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
    </Stack>
  );

  const renderReviewContent = () => (
    <Stack spacing={3} className="h-full flex flex-col">
      {/* Top section with welcome text */}
      <div>
        <Typography className="mt-4 mb-6 text-theme-text-secondary text-xl">
         How does everything
        </Typography>

        {/* Campaign Details */}
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

        {/* Price Display */}
        <div className="bg-theme-panel-bg backdrop-blur-xl rounded-lg p-4 border border-theme-border-primary mt-3">
          <Typography variant="h6" className="text-right mb-0 text-lg font-medium tracking-tight">
            Total Price: <span className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent">{calculateTotalPrice()} USDC</span>
          </Typography>
        </div>
      </div>
    </Stack>
  );

  return (
    <BaseModal open={open} onClose={onClose} title={agent.name}>
      <div className="relative flex items-center justify-center h-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0 w-full px-4"
          >
            {currentStep === 'requirements' && (
              <Stack spacing={3} className="h-full flex flex-col">
                {renderRequirementsContent()}
                <div className="flex justify-between mt-auto">
                  <Button
                    variant="outlined"
                    onClick={onBack}
                    className="border-theme-button-primary text-theme-button-primary hover:border-theme-button-hover hover:bg-theme-button-primary/5"
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setDirection(1);
                      setCurrentStep('review');
                    }}
                    className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover hover:from-theme-button-hover hover:to-theme-button-primary text-white"
                  >
                    Review
                  </Button>
                </div>
              </Stack>
            )}
            {currentStep === 'review' && (
              <Stack spacing={3} className="h-full flex flex-col">
                {renderReviewContent()}
                <div className="flex justify-between mt-auto">
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setDirection(-1);
                      setCurrentStep('requirements');
                    }}
                    className="border-theme-button-primary text-theme-button-primary hover:border-theme-button-hover hover:bg-theme-button-primary/5"
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handlePayClick}
                    className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover hover:from-theme-button-hover hover:to-theme-button-primary text-white"
                  >
                    {address ? 'Pay Now' : 'Connect Wallet'}
                  </Button>
                </div>
              </Stack>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </BaseModal>
  );
});

export { AgentInfoModal, AgentConfigModal };