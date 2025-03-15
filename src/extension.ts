import * as vscode from 'vscode';
import axios from 'axios';

let isRecording = false;
let statusBarItem: vscode.StatusBarItem;

function getBaseUrl(): string {
    return vscode.workspace.getConfiguration('whisperchat').get('baseUrl') || 'http://localhost:5174';
}

export function activate(context: vscode.ExtensionContext) {
    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(mic) Start Recording";
    statusBarItem.command = 'whisperchat.toggleRecording';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    let disposable = vscode.commands.registerCommand('whisperchat.toggleRecording', async () => {
        try {
            const baseUrl = getBaseUrl();

            if (!isRecording) {
                // Start recording
                await axios.post(`${baseUrl}/api/start`);
                isRecording = true;
                statusBarItem.text = "$(mic-full) Recording...";
                vscode.window.showInformationMessage('Started recording');
            } else {
                // Stop recording and get transcription
                const response = await axios.post(`${baseUrl}/api/stop`);
                isRecording = false;
                statusBarItem.text = "$(mic) Start Recording";

                const transcriptionText = response.data.transcription.text;

                // Get the active text editor
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    // Insert the text at the current cursor position
                    editor.edit((editBuilder: vscode.TextEditorEdit) => {
                        const position = editor.selection.active;
                        editBuilder.insert(position, transcriptionText);
                    });
                } else {
                    // If no editor is active, try to send text as keyboard input
                    await vscode.env.clipboard.writeText(transcriptionText);
                    // Simulate Ctrl+V to paste
                    await vscode.commands.executeCommand('editor.action.clipboardPasteAction');
                }

                vscode.window.showInformationMessage('Recording stopped and text inserted');
            }
        } catch (error) {
            console.error('Error:', error);
            vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
            // Reset state on error
            isRecording = false;
            statusBarItem.text = "$(mic) Start Recording";
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    if (isRecording) {
        // Try to stop recording if extension is deactivated while recording
        const baseUrl = getBaseUrl();
        axios.post(`${baseUrl}/api/stop`).catch(console.error);
    }
} 