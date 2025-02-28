import axios from 'axios';
const { ipcRenderer } = window.require('electron');

export interface TranscriptionResponse {
  language_code: string;
  language_probability: number;
  text: string;
  words: {
    text: string;
    type: string;
    start: number;
    end: number;
    speaker_id?: string;
    characters?: {
      text: string;
      start: number;
      end: number;
    }[];
  }[];
}

export class ElevenLabsService {
  private apiKey: string = '';
  private baseUrl: string = 'https://api.elevenlabs.io/v1';

  constructor() {
    this.loadApiKey();
  }

  private async loadApiKey() {
    this.apiKey = await ipcRenderer.invoke('get-api-key');
  }

  public async saveApiKey(apiKey: string): Promise<boolean> {
    this.apiKey = apiKey;
    return await ipcRenderer.invoke('save-api-key', apiKey);
  }

  public async transcribeAudio(audioFile: string): Promise<TranscriptionResponse> {
    // Make sure we have an API key
    if (!this.apiKey) {
      this.apiKey = await ipcRenderer.invoke('get-api-key');
      if (!this.apiKey) {
        throw new Error('API key is required');
      }
    }

    const formData = new FormData();
    formData.append('model_id', 'scribe_v1');
    formData.append('file', await this.fileToBlob(audioFile));
    formData.append('tag_audio_events', 'true');
    formData.append('timestamps_granularity', 'word');

    try {
      const response = await axios.post(
        `${this.baseUrl}/speech-to-text`,
        formData,
        {
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }

  private async fileToBlob(filePath: string): Promise<Blob> {
    // In Electron, we can use Node.js to read the file
    const fs = window.require('fs');
    const buffer = fs.readFileSync(filePath);
    return new Blob([buffer]);
  }
}

export default new ElevenLabsService();
