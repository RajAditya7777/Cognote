'use client';
import { useState, useEffect } from 'react';

export default function TestConnection() {
    const [status, setStatus] = useState('Testing...');
    const [response, setResponse] = useState(null);

    useEffect(() => {
        async function checkHealth() {
            try {
                const res = await fetch('http://localhost:4000/health');
                const data = await res.json();
                setResponse(data);
                if (res.ok) {
                    setStatus('Connected ✅');
                } else {
                    setStatus('Error ❌');
                }
            } catch (error) {
                console.error(error);
                setStatus('Failed to connect ❌ (Check console)');
            }
        }
        checkHealth();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white p-10">
            <h1 className="text-2xl font-bold mb-4">Backend Connection Test</h1>
            <div className="text-xl mb-4">Status: {status}</div>
            <pre className="bg-gray-800 p-4 rounded">
                {JSON.stringify(response, null, 2)}
            </pre>
        </div>
    );
}
