import { useState, memo } from 'react';
import { Modal, Box, Typography, IconButton, Slider, TextField, Select, MenuItem, FormControl, InputLabel, Button, Stack, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Code } from '@mui/icons-material';

export interface AgentRequirements {
  duration: number;
  frequency: number;
  frequencyUnit: string;
  photoOption: string;
  creativity: number;
}

interface RequirementsModalProps {
  open: boolean;
  onClose: () => void;
  agent: {
    name: string;
    description: string;
    tags: string[];
    websiteLink: string;
    icon: string;
    
  };
  onContinue: (requirements: AgentRequirements) => void;
}

const RequirementsModal = memo(function RequirementsModal({ open, onClose, agent, onContinue }: RequirementsModalProps) {
  const [duration, setDuration] = useState(1);
  const [frequency, setFrequency] = useState(1);
  const [frequencyUnit, setFrequencyUnit] = useState('day');
  const [photoOption, setPhotoOption] = useState('generate');
  const [creativity, setCreativity] = useState(50);

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

  const handleContinue = () => {
    onContinue({
      duration,
      frequency,
      frequencyUnit,
      photoOption,
      creativity
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="requirements-modal"
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
      <Box className="relative bg-theme-bg-primary overflow-hidden
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
        <div className="relative z-10 overflow-hidden">
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

          {/* Requirements Form */}
          <Stack spacing={4} className="bg-theme-panel-bg backdrop-blur-xl rounded-lg p-6 border border-theme-border-primary">
            <TextField
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
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
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
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
                  value={frequencyUnit}
                  onChange={(e) => setFrequencyUnit(e.target.value)}
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
                value={photoOption}
                onChange={(e) => setPhotoOption(e.target.value)}
                label="Photo Options"
              >
                <MenuItem value="generate">Generate AI Photos</MenuItem>
                <MenuItem value="upload">Upload Own Photos</MenuItem>
              </Select>
            </FormControl>

            <div>
              <Typography className="text-theme-text-primary mb-2 font-medium tracking-tight">
                Creativity Level: <span className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent">{creativity}%</span>
              </Typography>
              <Slider
                value={creativity}
                onChange={(_, value) => setCreativity(value as number)}
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

            <Button
              variant="contained"
              size="large"
              className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover hover:from-theme-button-hover hover:to-theme-button-primary text-white mt-4"
              onClick={handleContinue}
            >
              Continue to Review
            </Button>
          </Stack>
        </div>
      </Box>
    </Modal>
  );
});

export default RequirementsModal;
