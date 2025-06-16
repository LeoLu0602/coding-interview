'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

export default function Home() {
    const ws = useRef<WebSocket | null>(null);
    const router = useRouter();
    const [isFinding, setIsFinding] = useState(false);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:1337');

        ws.current.onopen = () => {
            console.log('connected to WebSocket server');
        };

        ws.current.onmessage = (event: MessageEvent) => {
            console.log('received:', event.data);

            const { type, payload } = JSON.parse(event.data);
            const { roomId } = payload;

            switch (type) {
                case 'matchResponse':
                    console.log(`roomId: ${roomId}`);
                    setIsFinding(false);
                    router.push(`/rooms/${roomId}`);

                    break;
                default:
                    break;
            }
        };

        ws.current.onclose = () => {
            console.log('disconnected');
        };

        return () => {
            ws.current?.close();
        };
    }, []);

    function findInterviewBuddy() {
        if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
            return;
        }

        setIsFinding(true);

        ws.current.send(
            JSON.stringify({
                type: 'matchRequest',
                payload: {
                    userId: null,
                },
            })
        );
    }

    return (
        <>
            <main className="fixed left-0 top-0 w-full h-screen flex flex-col justify-center items-center">
                <button
                    className={clsx(
                        'bg-emerald-500 p-4 font-bold text-white rounded-xl',
                        {
                            'hover:bg-emerald-600 cursor-pointer': !isFinding,
                            'cursor-not-allowed': isFinding,
                        }
                    )}
                    onClick={findInterviewBuddy}
                    disabled={isFinding}
                >
                    {isFinding ? 'Searching...' : 'Find Your Interview Buddy!'}
                </button>
            </main>
        </>
    );
}
