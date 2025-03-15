# WhisperChat VS Code Extension

This VS Code extension provides integration with a local transcription service running on port 5174.

## Features

- Toggle recording with `Ctrl+M` (or `Cmd+M` on macOS)
- Visual status indicator in the status bar
- Automatically inserts transcribed text at the current cursor position
- Works in any text input field, not just the editor
- Configurable base URL for the transcription service

## Requirements

- A transcription service running with the following endpoints:
  - POST `/api/start` - Starts recording
  - POST `/api/stop` - Stops recording and returns transcription

## Usage

1. Configure the base URL of your transcription service in VS Code settings (defaults to `http://localhost:5174`)
2. Press `Ctrl+M` to start recording (the status bar will show "Recording...")
3. Press `Ctrl+M` again to stop recording
4. The transcribed text will be automatically inserted at your current cursor position

## Development

1. Clone this repository
2. Run `npm install`
3. Press F5 to start debugging in VS Code

## Extension Settings

This extension contributes the following settings:

* `whisperchat.baseUrl`: Base URL for the transcription service (default: "http://localhost:5174")

## Known Issues

- None reported yet

## Release Notes

### 0.0.3

- Added bundling support with esbuild for better performance
- Added .vscodeignore for optimized package size
- Optimized extension package structure

### 0.0.2

- Updated keyboard shortcut to Ctrl+Shift+M to avoid conflicts with terminal
- Added MIT License
- Added repository information

### 0.0.1

Initial release of WhisperChat VS Code extension 