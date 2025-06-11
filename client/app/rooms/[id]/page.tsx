'use client';

import { useParams } from 'next/navigation';
import { Editor } from '@monaco-editor/react';

export default function Room() {
    const { id } = useParams();

    return (
        <>
            <div className="fixed left-0 top-0 w-1/2 h-screen bg-[#1e1e1e]">
                <Editor
                    theme="vs-dark"
                    width="100%"
                    height="100%"
                    defaultLanguage="python"
                    defaultValue={
                        "print('Hello!')\nprint('My name is Elder Price.')"
                    }
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
