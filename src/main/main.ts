import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

// Define a type for our store
interface StoreSchema {
  apiKey: string;
}

// Store will be initialized when the app is ready
let store: any;

let mainWindow: BrowserWindow | null = null;

async function initStore() {
  try {
    // Dynamically import electron-store
    const { default: Store } = await import('electron-store');
    
    store = new Store({
      schema: {
        apiKey: {
          type: 'string',
          default: ''
        }
      }
    });
    
    return store;
  } catch (error) {
    console.error('Failed to initialize store:', error);
    throw error;
  }
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  // Load the index.html of the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:8080');
    // Open the DevTools in development mode
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(
      path.join(__dirname, '../../dist/index.html')
    );
  }

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(async () => {
  try {
    await initStore();
    createWindow();
  } catch (error) {
    console.error('Failed to initialize app:', error);
    app.quit();
  }
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle IPC messages from renderer process

// Get API key from store
ipcMain.handle('get-api-key', async () => {
  try {
    if (!store) {
      await initStore();
    }
    return store.get('apiKey');
  } catch (error) {
    console.error('Error getting API key:', error);
    return '';
  }
});

// Save API key to store
ipcMain.handle('save-api-key', async (_, apiKey: string) => {
  try {
    if (!store) {
      await initStore();
    }
    store.set('apiKey', apiKey);
    return true;
  } catch (error) {
    console.error('Error saving API key:', error);
    return false;
  }
});

// Save recorded audio file
ipcMain.handle('save-audio-file', async (_, audioData: Buffer) => {
  try {
    const tempPath = path.join(app.getPath('temp'), 'recording.wav');
    await fs.promises.writeFile(tempPath, Buffer.from(audioData));
    return tempPath;
  } catch (error) {
    console.error('Error saving audio file:', error);
    throw error;
  }
});

// Save transcription to file
ipcMain.handle('save-transcription', async (_, text: string) => {
  try {
    const { filePath } = await dialog.showSaveDialog({
      title: 'Save Transcription',
      defaultPath: path.join(app.getPath('documents'), 'transcription.txt'),
      filters: [{ name: 'Text Files', extensions: ['txt'] }]
    });
    
    if (filePath) {
      await fs.promises.writeFile(filePath, text);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error saving transcription:', error);
    return false;
  }
});
