import { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VoiceCommander() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            setTranscript(command);
            handleCommand(command);
        };

        if (isListening) {
            recognition.start();
        } else {
            recognition.stop();
        }

        return () => recognition.stop();
    }, [isListening]);

    const handleCommand = (cmd) => {
        if (cmd.includes('dashboard') || cmd.includes('home')) navigate('/');
        else if (cmd.includes('ingest') || cmd.includes('upload')) navigate('/ingest');
        else if (cmd.includes('search') || cmd.includes('find')) navigate('/search');
        else if (cmd.includes('analytics') || cmd.includes('report')) navigate('/analytics');
        else if (cmd.includes('admin') || cmd.includes('security')) navigate('/admin');
    };

    const toggleListen = () => setIsListening(!isListening);

    if (!('webkitSpeechRecognition' in window)) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <div className={`p-4 rounded-full shadow-lg cursor-pointer transition-all border ${isListening ? 'bg-red-500 border-red-400 animate-pulse' : 'bg-cyber-dark border-cyber-primary'}`}
                onClick={toggleListen}>
                {isListening ? <Mic className="text-white" /> : <MicOff className="text-gray-400" />}
            </div>
            {transcript && isListening && (
                <div className="absolute bottom-16 right-0 bg-black/80 text-white text-xs px-2 py-1 rounded w-32 text-center">
                    "{transcript}"
                </div>
            )}
        </div>
    );
}
