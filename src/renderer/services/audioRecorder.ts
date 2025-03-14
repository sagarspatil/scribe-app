const { ipcRenderer } = window.require('electron');

export default class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private onStateChange: (recording: boolean) => void;
  private onAudioProcess: (audioData: Float32Array) => void;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private isPaused: boolean = false;

  constructor(
    onStateChange: (recording: boolean) => void,
    onAudioProcess: (audioData: Float32Array) => void
  ) {
    this.onStateChange = onStateChange;
    this.onAudioProcess = onAudioProcess;
  }

  public async start(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.audioChunks = [];
      this.isPaused = false;

      this.mediaRecorder.addEventListener('dataavailable', (event) => {
        this.audioChunks.push(event.data);
      });

      this.mediaRecorder.addEventListener('stop', () => {
        this.onStateChange(false);
      });

      this.mediaRecorder.start();
      this.onStateChange(true);

      // Set up audio processing for visualization
      this.setupAudioProcessing();
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  public stop(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No recording in progress'));
        return;
      }

      this.mediaRecorder.addEventListener('stop', async () => {
        try {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          const arrayBuffer = await audioBlob.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          
          // Save the file using Electron's main process
          const filePath = await ipcRenderer.invoke('save-audio-file', buffer);
          
          // Clean up
          this.cleanupAudioProcessing();
          
          resolve(filePath);
        } catch (error) {
          reject(error);
        }
      });

      this.mediaRecorder.stop();
      this.stream?.getTracks().forEach(track => track.stop());
    });
  }

  public pause(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (!this.mediaRecorder || this.isPaused) {
          reject(new Error('Cannot pause recording'));
          return;
        }

        // MediaRecorder doesn't have a native pause method in all browsers
        // So we'll implement our own pause by stopping the media tracks
        if (this.stream) {
          this.stream.getTracks().forEach(track => {
            track.enabled = false;
          });
          
          this.isPaused = true;
          resolve();
        } else {
          reject(new Error('No active stream to pause'));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  public resume(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (!this.mediaRecorder || !this.isPaused) {
          reject(new Error('Cannot resume recording'));
          return;
        }

        // Re-enable the tracks to resume
        if (this.stream) {
          this.stream.getTracks().forEach(track => {
            track.enabled = true;
          });
          
          this.isPaused = false;
          resolve();
        } else {
          reject(new Error('No active stream to resume'));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  public cancel(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.stream?.getTracks().forEach(track => track.stop());
      this.cleanupAudioProcessing();
    }
  }

  private setupAudioProcessing(): void {
    if (!this.stream) return;

    this.audioContext = new AudioContext();
    const source = this.audioContext.createMediaStreamSource(this.stream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    
    source.connect(this.analyser);
    
    // Use ScriptProcessorNode (deprecated but still works)
    this.processorNode = this.audioContext.createScriptProcessor(1024, 1, 1);
    this.analyser.connect(this.processorNode);
    this.processorNode.connect(this.audioContext.destination);
    
    this.processorNode.addEventListener('audioprocess', () => {
      if (this.isPaused) {
        // When paused, send a flat line
        const flatData = new Float32Array(this.analyser!.frequencyBinCount);
        this.onAudioProcess(flatData);
      } else {
        const dataArray = new Float32Array(this.analyser!.frequencyBinCount);
        this.analyser!.getFloatTimeDomainData(dataArray);
        this.onAudioProcess(dataArray);
      }
    });
  }

  private cleanupAudioProcessing(): void {
    if (this.processorNode) {
      this.processorNode.disconnect();
      this.processorNode = null;
    }
    
    if (this.analyser) {
      this.analyser.disconnect();
      this.analyser = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
