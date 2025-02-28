import React, { useState, useEffect, useRef } from 'react';
import AudioRecorder from '../services/audioRecorder';
import Waveform from './Waveform';
import { 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Dialog, 
  DialogContent, 
  DialogActions,
  Paper,
  Fade,
  Chip
} from '@mui/material';
import { StopIcon, MicrophoneOffIcon } from './icons';

interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (audioPath: string) => void;
}

const RecordingModal: React.FC<RecordingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioData, setAudioData] = useState<Float32Array | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  
  useEffect(() => {
    if (isOpen) {
      recorderRef.current = new AudioRecorder(
        (recording) => setIsRecording(recording),
        (data) => setAudioData(data)
      );
      
      // Start recording automatically when modal opens
      handleStartRecording();
    }
    
    return () => {
      if (recorderRef.current) {
        recorderRef.current.cancel();
      }
    };
  }, [isOpen]);
  
  const handleStartRecording = async () => {
    try {
      await recorderRef.current?.start();
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };
  
  const handleStopRecording = async () => {
    try {
      if (recorderRef.current) {
        const audioPath = await recorderRef.current.stop();
        onComplete(audioPath);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };
  
  const handleCancelRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.cancel();
    }
    onClose();
  };
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        handleCancelRecording();
      } else if (e.key === ' ' || e.code === 'Space') {
        if (isRecording) {
          handleStopRecording();
        } else {
          handleStartRecording();
        }
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isRecording]);
  
  if (!isOpen) return null;
  
  return (
    <Dialog 
      open={isOpen}
      onClose={handleCancelRecording}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        elevation: 2,
        sx: { borderRadius: 2 }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ 
          backgroundColor: 'background.default',
          p: 3,
          minHeight: '200px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <Typography variant="h6" gutterBottom align="center">
            Recording in Progress
          </Typography>
          
          <Box sx={{ 
            width: '100%', 
            height: '120px', 
            my: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {isRecording && audioData ? (
              <Waveform audioData={audioData} />
            ) : (
              <Box sx={{ 
                width: '100%', 
                height: '2px', 
                borderTop: '2px dashed',
                borderColor: 'divider'
              }} />
            )}
            
            <Box sx={{ 
              position: 'absolute', 
              left: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1 
            }}>
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  bgcolor: isRecording ? 'error.main' : 'grey.400',
                  animation: isRecording ? 'pulse 1.5s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.4 },
                    '100%': { opacity: 1 }
                  }
                }}
              />
              {isRecording && (
                <Chip 
                  label="RECORDING" 
                  color="error" 
                  size="small" 
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: 2,
            width: '100%'
          }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleStopRecording}
              startIcon={<StopIcon />}
            >
              Stop Recording
            </Button>
            
            <Button
              variant="outlined"
              color="error"
              onClick={handleCancelRecording}
              startIcon={<MicrophoneOffIcon />}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        justifyContent: 'center', 
        pb: 2, 
        px: 2, 
        backgroundColor: 'background.paper'
      }}>
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          <Typography variant="caption" color="text.secondary">
            Press <Box component="span" sx={{ fontFamily: 'monospace', bgcolor: 'action.hover', px: 1, borderRadius: 1 }}>Space</Box> to stop recording, 
            <Box component="span" sx={{ fontFamily: 'monospace', bgcolor: 'action.hover', px: 1, borderRadius: 1, ml: 1 }}>Esc</Box> to cancel
          </Typography>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default RecordingModal;
