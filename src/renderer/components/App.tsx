import React, { useState, useEffect } from 'react';
import RecordingModal from './RecordingModal';
import Transcription from './Transcription';
import ApiKeyModal from './ApiKeyModal';
import elevenlabsService, { TranscriptionResponse } from '../services/elevenlabsService';
import { MicrophoneIcon, SettingsIcon } from './icons';
const { ipcRenderer } = window.require('electron');

const App: React.FC = () => {
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [transcription, setTranscription] = useState<TranscriptionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyStatus, setApiKeyStatus] = useState<boolean>(false);

  // Check if API key exists on component mount
  useEffect(() => {
    const checkApiKey = async () => {
      const apiKey = await ipcRenderer.invoke('get-api-key');
      if (!apiKey) {
        setIsApiKeyModalOpen(true);
        setApiKeyStatus(false);
      } else {
        setApiKeyStatus(true);
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
  };

  const openSettings = () => {
    setIsApiKeyModalOpen(true);
  };

  return (
    <div className="app-container">
      {/* Header with App Title and Settings */}
      <div className="header">
        <h1 className="app-logo">Scribe</h1>
        <p className="app-subtitle">Record your voice and get an instant transcription</p>
        <button className="settings-button" onClick={openSettings}>
          <SettingsIcon />
        </button>
      </div>
      
      <div className="content">
        {/* Home Screen - Record Button */}
        {!isRecordingModalOpen && !isLoading && !transcription && (
          <div className="record-button-container">
            <button className="record-button" onClick={handleStartRecording}>
              <MicrophoneIcon />
            </button>
            <span className="record-label">Click to record</span>
          </div>
        )}
        
        {/* Loading State */}
        {isLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Transcribing your audio...</p>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="error-container">
            <p className="error">{error}</p>
            <button className="error-dismiss" onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}
        
        {/* Transcription Results */}
        {transcription && (
          <Transcription 
            transcription={transcription} 
            onSave={handleSaveTranscription}
            onNewRecording={() => {
              setTranscription(null);
              handleStartRecording();
            }}
          />
        )}
        
        {/* Modals */}
        <RecordingModal 
          isOpen={isRecordingModalOpen}
          onClose={() => setIsRecordingModalOpen(false)}
          onComplete={handleRecordingComplete}
        />
        
        <ApiKeyModal
          isOpen={isApiKeyModalOpen}
          onClose={() => setIsApiKeyModalOpen(false)}
          onSave={handleApiKeySave}
        />
      </div>

      {/* API Status Indicator */}
      <div className="api-status">
        <div className={`api-status-dot ${apiKeyStatus ? '' : 'disconnected'}`}></div>
        <span>{apiKeyStatus ? 'Connected to Eleven Labs' : 'API Key Required'}</span>
      </div>
    </div>
  );
};

export default App;
