'use client';

import { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Editor } from '@monaco-editor/react';
import type * as monaco from 'monaco-editor';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

export default function Room() {
    const { id } = useParams<{ id: string }>();
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null); // Reference to the Monaco editor instance.
    const ydoc = useRef<Y.Doc | null>(null); // Reference to the Yjs document representing the shared state.
    const provider = useRef<WebsocketProvider | null>(null); // Reference to the Yjs websocket provider for syncing with server and peers.
    const yText = useRef<Y.Text | null>(null); // Reference to the shared Yjs text type used for collaborative editing.
    const isApplyingRemoteChanges = useRef<boolean>(false);

    useEffect(() => {
        ydoc.current = new Y.Doc(); // Create a new Yjs document for this client/session.

        // Connect to the Yjs websocket server.
        // npx y-websocket-server --port 1234
        provider.current = new WebsocketProvider(
            'ws://localhost:1234',
            id,
            ydoc.current
        );

        yText.current = ydoc.current.getText('monaco'); // Create or access a shared collaborative text object called "monaco" inside the Yjs document.

        // Listen for remote changes to the shared text and update Monaco editor accordingly.
        yText.current.observe(() => {
            if (!editorRef.current) {
                return; // Editor not mounted yet.
            }

            const selection = editorRef.current.getSelection(); // Save current cursor/selection so we can restore it after updating content.

            isApplyingRemoteChanges.current = true; // Indicate that remote changes are being applied to prevent local event feedback loops.
            editorRef.current.setValue(yText.current?.toString() ?? ''); // Replace the entire content of Monaco editor with the latest shared text.

            // Restore cursor/selection position if available.
            if (selection) {
                editorRef.current.setSelection(selection);
            }

            isApplyingRemoteChanges.current = false; // Done applying remote changes.
        });

        // Cleanup: destroy the provider and Yjs document when component unmounts.
        return () => {
            provider.current?.destroy();
            ydoc.current?.destroy();
        };
    }, []);

    function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
        editorRef.current = editor; // Save editor instance reference.

        // When editor mounts, check if yText has synced content.
        if (yText.current) {
            if (yText.current.length === 0) {
                yText.current?.insert(
                    0,
                    "print('Hello')\nprint('My name is Elder Price')"
                );
            }

            editor.setValue(yText.current.toString());
        }

        // Listen to local editor content changes.
        editor.onDidChangeModelContent((event) => {
            // Ignore changes that come from remote updates.
            if (isApplyingRemoteChanges.current) {
                return;
            }

            // For each change, update the shared Yjs text accordingly.
            event.changes.forEach((change) => {
                yText.current?.delete(change.rangeOffset, change.rangeLength); // Delete the replaced text range in the shared document.
                yText.current?.insert(change.rangeOffset, change.text); // Insert the new text in the shared document.
            });
        });
    }

    return (
        <>
            <div className="fixed right-0 top-0 w-[600px] h-screen bg-[#1e1e1e] pt-10">
                <Editor
                    theme="vs-dark"
                    width="100%"
                    height="100%"
                    defaultLanguage="python"
                    onMount={handleEditorDidMount}
                    options={{
                        minimap: { enabled: false },
                    }}
                />
            </div>
        </>
    );
}
