# Scribe

Scribe is a macOS desktop application that records audio and converts it to text using the Eleven Labs API. The application features a clean, minimalist UI with real-time audio waveform visualization.

## Features

- Record audio directly from your microphone
- Real-time audio waveform visualization
- Transcribe speech to text using Eleven Labs API
- Save transcriptions to text files
- Copy transcriptions to clipboard
- Keyboard shortcuts for convenient recording control

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- An Eleven Labs API key (obtain from [Eleven Labs Dashboard](https://elevenlabs.io/app))

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/scribe.git
   cd scribe
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the application:
   ```
   npm run build
   ```

4. Start the application:
   ```
   npm start
   ```

## Development

To run the application in development mode:

```
npm run dev
```

This will start the application with hot reloading enabled.

## Packaging

To create a distributable package for macOS:

```
npm run package
```

This will create a `.dmg` file in the `dist` directory.

## Keyboard Shortcuts

- **Space**: Start/Stop recording
- **Escape**: Cancel recording

## API Key

You'll need an Eleven Labs API key to use the transcription functionality. The application will prompt you to enter your API key when you first run it. You can obtain an API key from the [Eleven Labs Dashboard](https://elevenlabs.io/app).

## License

ISC
