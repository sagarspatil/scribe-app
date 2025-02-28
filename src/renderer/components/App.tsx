import React, { useState, useEffect } from 'react';
import RecordingModal from './RecordingModal';
import Transcription from './Transcription';
import ApiKeyModal from './ApiKeyModal';
import elevenlabsService, { TranscriptionResponse } from '../services/elevenlabsService';
import { 
  MicrophoneIcon, 
  SettingsIcon,
  NoteAddIcon,
  RecordIcon
} from './icons';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  IconButton, 
  Fab,
  Fade,
  AppBar,
  Toolbar,
  CircularProgress,
  Divider,
  Chip
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
const { ipcRenderer } = window.require('electron');

// Create a theme instance with Material Design
const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ee', // Material Design primary color
    },
    secondary: {
      main: '#03dac6', // Material Design secondary color
    },
    error: {
      main: '#b00020', // Material Design error color
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: '1rem',
      color: 'rgba(0, 0, 0, 0.6)',
    },
  },
  shape: {
    borderRadius: 8,
  },
});

const App: React.FC = () => {
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [transcription, setTranscription] = useState<TranscriptionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyStatus, setApiKeyStatus] = useState<boolean>(false);
  const [currentApiKey, setCurrentApiKey] = useState<string>('');

  // Check if API key exists on component mount
  useEffect(() => {
    const checkApiKey = async () => {
      const apiKey = await ipcRenderer.invoke('get-api-key');
      if (!apiKey) {
        setIsApiKeyModalOpen(true);
        setApiKeyStatus(false);
        setCurrentApiKey('');
      } else {
        setApiKeyStatus(true);
        setCurrentApiKey(apiKey);
      }
    };
    
    checkApiKey();
  }, []);

  const handleStartRecording = () => {
    setIsRecordingModalOpen(true);
  };

  const handleRecordingComplete = async (audioPath: string) => {
    setIsRecordingModalOpen(false);
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await elevenlabsService.transcribeAudio(audioPath);
      setTranscription(result);
    } catch (error) {
      console.error('Transcription error:', error);
      setError('Failed to transcribe audio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTranscription = async () => {
    if (transcription) {
      await ipcRenderer.invoke('save-transcription', transcription.text);
    }
  };

  const handleApiKeySave = (apiKey: string) => {
    elevenlabsService.saveApiKey(apiKey);
    setIsApiKeyModalOpen(false);
    setApiKeyStatus(true);
    setCurrentApiKey(apiKey);
  };

  const openSettings = () => {
    setIsApiKeyModalOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh',
        bgcolor: 'background.default'
      }}>
        <AppBar position="static" elevation={0} color="transparent">
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <RecordIcon sx={{ fontSize: 28, color: 'primary.main', mr: 1 }} />
              <Typography variant="h6" component="div">
                Scribe
              </Typography>
            </Box>
            <IconButton 
              edge="end" 
              color="primary" 
              aria-label="settings"
              onClick={openSettings}
            >
              <SettingsIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', py: 4 }}>
          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            
            {/* Home Screen */}
            {!isRecordingModalOpen && !isLoading && !transcription && (
              <Fade in={true}>
                <Box sx={{ textAlign: 'center' }}>
                  
                  <Box sx={{ '& > :not(style)': { m: 1 } }}>
                    <Fab
                      color="primary"
                      aria-label="record"
                      size="large"
                      onClick={handleStartRecording}
                      sx={{ 
                        width: 80, 
                        height: 80,
                        boxShadow: '0 8px 16px rgba(98, 0, 238, 0.2)'
                      }}
                    >
                      <MicrophoneIcon fontSize="large" />
                    </Fab>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Tap to start recording
                  </Typography>
                  
                  <Box sx={{ mt: 6 }}>
                    <Paper elevation={0} sx={{ 
                      p: 3, 
                      borderRadius: 2, 
                      bgcolor: 'rgba(98, 0, 238, 0.05)',
                      maxWidth: 400,
                      mx: 'auto'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'center' }}>
                        <NoteAddIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body1" fontWeight="medium">
                          Start a new transcription
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Record your voice, meetings, or any audio to get an accurate transcription powered by Eleven Labs.
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              </Fade>
            )}
            
            {/* Loading State */}
            {isLoading && (
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress size={60} thickness={4} />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Transcribing your audio...
                </Typography>
              </Box>
            )}
            
            {/* Error State */}
            {error && (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  bgcolor: 'rgba(176, 0, 32, 0.05)', 
                  borderRadius: 2,
                  maxWidth: 400,
                  mx: 'auto'
                }}
              >
                <Typography color="error" gutterBottom>
                  {error}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Fab
                    variant="extended"
                    size="small"
                    color="primary"
                    onClick={() => setError(null)}
                  >
                    Dismiss
                  </Fab>
                </Box>
              </Paper>
            )}
            
            {/* Transcription Results */}
            {transcription && (
              <Transcription 
                transcription={transcription} 
                onSave={handleSaveTranscription}
                onNewRecording={() => {
                  setTranscription(null);
                  setIsRecordingModalOpen(true);
                }}
              />
            )}
          </Box>
        </Container>
        

      </Box>
      
      {/* Modals */}
      {isRecordingModalOpen && (
        <RecordingModal 
          isOpen={isRecordingModalOpen}
          onClose={() => setIsRecordingModalOpen(false)}
          onComplete={handleRecordingComplete}
        />
      )}
      
      {isApiKeyModalOpen && (
        <ApiKeyModal 
          isOpen={isApiKeyModalOpen} 
          onClose={() => setIsApiKeyModalOpen(false)}
          onSave={handleApiKeySave}
          currentApiKey={currentApiKey}
        />
      )}
    </ThemeProvider>
  );
};

export default App;
