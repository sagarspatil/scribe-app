import React, { useState } from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSave(apiKey.trim());
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="api-key-modal">
      <div className="api-key-modal-content">
        <h2>Enter Eleven Labs API Key</h2>
        <p>
          An API key is required to use the transcription service.
          You can get your API key from the{' '}
          <a 
            href="https://elevenlabs.io/app" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Eleven Labs dashboard
          </a>.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="apiKey">API Key:</label>
            <input
              type="text"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Eleven Labs API key"
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={!apiKey.trim()}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApiKeyModal;
