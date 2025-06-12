'use client';

import { useEffect, useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import type * as monaco from 'monaco-editor';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

export default function Room() {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const ydoc = useRef<Y.Doc | null>(null);
    const provider = useRef<WebsocketProvider | null>(null);
    const yText = useRef<Y.Text | null>(null);
    const isApplyingRemoteChanges = useRef<boolean>(false);

    useEffect(() => {
        ydoc.current = new Y.Doc();
        provider.current = new WebsocketProvider(
            'wss://localhost:1234',
            '1',
            ydoc.current
        );
        yText.current = ydoc.current.getText('monaco');

        // Apply remote changes to Monaco.
        yText.current.observe((event) => {
            if (!editorRef.current) {
                return;
            }

            const selection = editorRef.current.getSelection();

            isApplyingRemoteChanges.current = true;
            editorRef.current.setValue(yText.current?.toString() ?? '');

            if (selection) {
                editorRef.current.setSelection(selection);
            }

            isApplyingRemoteChanges.current = false;
        });

        return () => {
            provider.current?.destroy();
            ydoc.current?.destroy();
        };
    }, []);

    function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
        editorRef.current = editor;
        editor.setValue('');

        editor.onDidChangeModelContent((event) => {
            if (isApplyingRemoteChanges.current) {
                return;
            }

            event.changes.forEach((change) => {
                yText.current?.delete(change.rangeOffset, change.rangeLength);
                yText.current?.insert(change.rangeOffset, change.text);
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
                        minimap: {
                            enabled: false,
                        },
                    }}
                />
            </div>
        </>
    );
}
