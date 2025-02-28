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
import { StopIcon, MicrophoneOffIcon, PauseIcon, PlayArrowIcon } from './icons';

interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (audioPath: string) => void;
}

const RecordingModal: React.FC<RecordingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [audioData, setAudioData] = useState<Float32Array | null>(null);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (isOpen) {
      recorderRef.current = new AudioRecorder(
        (recording) => setIsRecording(recording),
        (data) => setAudioData(data)
      );
      
      // Start recording automatically when modal opens
      handleStartRecording();
      // Start timer
      startTimer();
    }
    
    return () => {
      if (recorderRef.current) {
        recorderRef.current.cancel();
      }
      stopTimer();
    };
  }, [isOpen]);
  
  const startTimer = () => {
    setRecordingTime(0);
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };
  
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  const pauseTimer = () => {
    stopTimer();
  };
  
  const resumeTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleStartRecording = async () => {
    try {
      await recorderRef.current?.start();
      setIsPaused(false);
      resumeTimer();
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };
  
  const handleStopRecording = async () => {
    try {
      if (recorderRef.current) {
        stopTimer();
        const audioPath = await recorderRef.current.stop();
        onComplete(audioPath);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };
  
  const handlePauseRecording = async () => {
    try {
      if (recorderRef.current) {
        await recorderRef.current.pause();
        setIsPaused(true);
        pauseTimer();
      }
    } catch (error) {
      console.error('Failed to pause recording:', error);
    }
  };
  
  const handleResumeRecording = async () => {
    try {
      if (recorderRef.current) {
        await recorderRef.current.resume();
        setIsPaused(false);
        resumeTimer();
      }
    } catch (error) {
      console.error('Failed to resume recording:', error);
    }
  };
  
  const handleCancelRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.cancel();
      stopTimer();
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
        if (isPaused) {
          handleResumeRecording();
        } else if (isRecording) {
          handlePauseRecording();
        } else {
          handleStartRecording();
        }
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isRecording, isPaused]);
  
  if (!isOpen) return null;
  
  return (
    <Dialog 
      open={isOpen}
      onClose={handleCancelRecording}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        elevation: 4,
        sx: { 
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
      BackdropProps={{
        sx: { backgroundColor: 'rgba(0, 0, 0, 0.6)' }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ 
          backgroundColor: 'background.default',
          p: 4,
          minHeight: '280px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 3
        }}>
          <Typography variant="h6" gutterBottom align="center" sx={{ fontWeight: 500 }}>
            {isPaused ? 'Recording Paused' : 'Recording in Progress'}
          </Typography>
          
          {/* Timer display */}
          <Typography 
            variant="h2" 
            sx={{ 
              fontFamily: 'monospace', 
              fontWeight: 300,
              my: 2,
              color: isPaused ? 'text.secondary' : 'primary.main'
            }}
          >
            {formatTime(recordingTime)}
          </Typography>
          
          {/* Waveform visualization */}
          <Box sx={{ 
            width: '100%', 
            height: '120px', 
            my: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            backgroundColor: 'rgba(98, 0, 238, 0.04)',
            borderRadius: 2,
            overflow: 'hidden'
          }}>
            {isRecording && audioData ? (
              <Waveform 
                audioData={audioData} 
                isPaused={isPaused} 
                color={isPaused ? '#9e9e9e' : '#6200ee'} 
              />
            ) : (
              <Box sx={{ 
                width: '100%', 
                height: '2px', 
                borderTop: '2px dashed',
                borderColor: 'divider'
              }} />
            )}
            
            {/* Recording status indicator */}
            <Box sx={{ 
              position: 'absolute', 
              left: '16px',
              top: '16px',
              display: 'flex', 
              alignItems: 'center', 
              gap: 1 
            }}>
              <Box 
                sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  bgcolor: isPaused ? 'warning.main' : (isRecording ? 'error.main' : 'grey.400'),
                  animation: (!isPaused && isRecording) ? 'pulse 1.5s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.4 },
                    '100%': { opacity: 1 }
                  }
                }}
              />
              <Typography 
                variant="caption" 
                color={isPaused ? 'text.secondary' : 'error'}
                sx={{ fontWeight: 500 }}
              >
                {isPaused ? 'PAUSED' : (isRecording ? 'RECORDING...' : '')}
              </Typography>
            </Box>
          </Box>
          
          {/* Control buttons */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2,
            width: '100%',
            mt: 2
          }}>
            {/* Primary action button */}
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleStopRecording}
              startIcon={<StopIcon />}
              sx={{ 
                borderRadius: 28,
                px: 3,
                py: 1
              }}
            >
              Stop
            </Button>
            
            {/* Pause/Resume button */}
            <Button
              variant={isPaused ? "contained" : "outlined"}
              color={isPaused ? "success" : "primary"}
              onClick={isPaused ? handleResumeRecording : handlePauseRecording}
              startIcon={isPaused ? <PlayArrowIcon /> : <PauseIcon />}
              sx={{ 
                borderRadius: 28,
                px: 3
              }}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            
            {/* Cancel button */}
            <Button
              variant="outlined"
              color="error"
              onClick={handleCancelRecording}
              startIcon={<MicrophoneOffIcon />}
              sx={{ 
                borderRadius: 28,
                px: 3
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RecordingModal;
