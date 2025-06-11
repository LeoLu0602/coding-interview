'use client';

import { useParams } from 'next/navigation';
import { Editor } from '@monaco-editor/react';

export default function Room() {
    const { id } = useParams();

    return (
        <>
            <Editor
                height="90vh"
                defaultLanguage="javascript"
                defaultValue={"print('hello')"}
            />
        </>
    );
}
