import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  TextField,
  Typography,
  Link,
  Box,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  currentApiKey?: string;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  currentApiKey = '' 
}) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [showMaskedKey, setShowMaskedKey] = useState<boolean>(false);
  
  useEffect(() => {
    // If we have a currentApiKey, set it in the state
    if (currentApiKey) {
      setApiKey(currentApiKey);
    } else {
      setApiKey('');
    }
  }, [currentApiKey, isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSave(apiKey.trim());
    }
  };
  
  // Create a masked version of the API key (first 4 chars visible, rest masked)
  const getMaskedApiKey = (): string => {
    if (!currentApiKey) return '';
    
    const visiblePart = currentApiKey.slice(0, 4);
    const maskedPart = '*'.repeat(Math.max(currentApiKey.length - 4, 8));
    return visiblePart + maskedPart;
  };
  
  if (!isOpen) return null;
  
  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        elevation: 2,
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        Enter Eleven Labs API Key
      </DialogTitle>
      
      <DialogContent sx={{ pb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          An API key is required to use the transcription service.
          You can get your API key from the{' '}
          <Link 
            href="https://elevenlabs.io/app" 
            target="_blank" 
            rel="noopener noreferrer"
            underline="hover"
          >
            Eleven Labs dashboard
          </Link>.
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            autoFocus
            margin="dense"
            id="apiKey"
            label="API Key"
            type={showMaskedKey ? "text" : "password"}
            fullWidth
            variant="outlined"
            value={currentApiKey && !apiKey.startsWith(currentApiKey.slice(0, 4)) ? getMaskedApiKey() : apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Eleven Labs API key"
            required
            InputProps={{
              endAdornment: currentApiKey && (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle API key visibility"
                    onClick={() => setShowMaskedKey(!showMaskedKey)}
                    edge="end"
                  >
                    {showMaskedKey ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 6, px: 3 }}
        >
          CANCEL
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disableElevation
          sx={{ borderRadius: 6, px: 3 }}
        >
          SAVE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApiKeyModal;
