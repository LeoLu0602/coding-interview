'use client';

import { useState } from 'react';
// import { useParams } from 'next/navigation';
import { Editor } from '@monaco-editor/react';

export default function Room() {
    // const { id } = useParams();
    const [code, setCode] = useState<string>(
        "print('Hello!')\nprint('My name is Elder Price.')"
    );

    function handleCodeChange(value: string | undefined) {
        setCode(value ?? '');
    }

    return (
        <>
            <div className="fixed right-0 top-0 w-1/2 h-screen bg-[#1e1e1e]">
                <Editor
                    theme="vs-dark"
                    width="100%"
                    height="100%"
                    defaultLanguage="python"
                    value={code}
                    onChange={handleCodeChange}
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
