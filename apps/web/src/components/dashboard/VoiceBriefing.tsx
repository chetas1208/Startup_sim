'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, Volume2, RotateCcw } from 'lucide-react';

interface Props { text: string | undefined; onClose: () => void; }

export default function VoiceBriefing({ text, onClose }: Props) {
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentWord, setCurrentWord] = useState(0);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const words = text?.split(' ') || [];
    const estimatedDuration = words.length * 0.35;

    useEffect(() => {
        return () => { window.speechSynthesis.cancel(); };
    }, []);

    const startSpeech = () => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.volume = 1;

        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
            (v) => v.name.includes('Samantha') || v.name.includes('Google US') || v.lang === 'en-US'
        );
        if (preferredVoice) utterance.voice = preferredVoice;

        let wordIndex = 0;
        utterance.onboundary = (event) => {
            if (event.name === 'word') {
                wordIndex++;
                setCurrentWord(wordIndex);
                setProgress((wordIndex / words.length) * 100);
            }
        };

        utterance.onend = () => {
            setPlaying(false);
            setProgress(100);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setPlaying(true);
    };

    const togglePlayback = () => {
        if (playing) {
            window.speechSynthesis.pause();
            setPlaying(false);
        } else if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            setPlaying(true);
        } else {
            startSpeech();
        }
    };

    const restart = () => {
        window.speechSynthesis.cancel();
        setProgress(0);
        setCurrentWord(0);
        setPlaying(false);
        setTimeout(startSpeech, 100);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl glass-panel p-6 animate-slide-up">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-sg-accent/10 border border-sg-accent/20 flex items-center justify-center">
                            <Volume2 className="w-5 h-5 text-sg-accent" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-sg-text">Market Briefing</h2>
                            <p className="text-xs text-sg-textDim">~{Math.ceil(estimatedDuration)}s voice summary</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-sg-surface text-sg-textMuted hover:text-sg-text transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="h-1 bg-sg-surface rounded-full mb-5 overflow-hidden">
                    <div className="h-full bg-sg-accent rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
                </div>

                <div className="flex items-center justify-center gap-4 mb-6">
                    <button onClick={restart} className="p-2 rounded-full hover:bg-sg-surface text-sg-textMuted hover:text-sg-text transition-colors">
                        <RotateCcw className="w-5 h-5" />
                    </button>
                    <button onClick={togglePlayback}
                        className="w-14 h-14 rounded-full bg-sg-accent flex items-center justify-center hover:bg-sg-accentDim transition-colors">
                        {playing ? <Pause className="w-6 h-6 text-sg-bg" /> : <Play className="w-6 h-6 text-sg-bg ml-0.5" />}
                    </button>
                    <div className="w-9" />
                </div>

                <div className="max-h-48 overflow-y-auto rounded-lg bg-sg-bg p-4 border border-sg-border">
                    <p className="text-sm leading-relaxed">
                        {words.map((word, i) => (
                            <span key={i} className={`${i < currentWord ? 'text-sg-text' : i === currentWord && playing ? 'text-sg-accent font-medium' : 'text-sg-textDim'
                                } transition-colors duration-100`}>
                                {word}{' '}
                            </span>
                        ))}
                    </p>
                </div>
            </div>
        </div>
    );
}
