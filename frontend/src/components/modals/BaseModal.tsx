import { Modal, Box, IconButton, Typography, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Code } from '@mui/icons-material';

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  tags?: string[];
  children: React.ReactNode;
}

const BaseModal = ({ open, onClose, title, tags, children }: BaseModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      className="flex items-center justify-center"
      slotProps={{
        backdrop: {
          style: { 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          },
          TransitionComponent: Fade
        }
      }}
      disableRestoreFocus
      disableEnforceFocus={false}
      disableAutoFocus
      disablePortal={false}
      style={{ position: 'fixed', zIndex: 200 }}
    >
      <Box 
        className="relative bg-theme-bg-primary/90 backdrop-blur-xl
          border border-theme-border-primary rounded-lg w-[95%] h-[90%] max-w-md" 
        sx={{ 
          position: 'relative',
          height: { xs: '600px', sm: '580px' }, // Fixed height for mobile and desktop
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Background gradients */}
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-theme-bg-primary via-theme-bg-secondary to-theme-bg-accent opacity-20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(167,139,250,0.15),transparent_50%)]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header - Fixed height */}
          <div className="flex justify-between items-start p-4 pb-2">
            <div className="flex items-center gap-3">
              <Code className="text-2xl text-theme-button-primary" />
              <div>
                <Typography variant="h5" className="text-base font-medium tracking-tight bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent">
                  {title}
                </Typography>
                {tags && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 text-[10px] rounded-full bg-gradient-to-r from-theme-button-primary to-theme-button-hover text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <IconButton 
              onClick={onClose} 
              className="text-theme-text-primary hover:text-theme-text-secondary -mt-1 -mr-2"
              size="small"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-thin scrollbar-thumb-theme-border-primary scrollbar-track-transparent">
            {children}
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default BaseModal;