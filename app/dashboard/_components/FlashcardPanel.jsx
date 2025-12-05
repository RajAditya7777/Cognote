'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Loader2, RotateCcw, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_URL from '@/config/api';

export default function FlashcardPanel({ flashcards, isGenerating, onClose }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);

    // Reset state when flashcards change
    useEffect(() => {
        setCurrentIndex(0);
        setIsFlipped(false);
    }, [flashcards]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrevious();
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                setIsFlipped(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, flashcards]); // Dependencies for correct state access

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete these flashcards?")) return;

        setIsDeleting(true);
        try {
            // Assuming flashcards object has fileId, or we pass it separately. 
            // If flashcards is an array, we might need the fileId passed as a prop or embedded in the array items.
            // Let's assume the parent passes the full object or we check the first item.
            const fileId = flashcards?.[0]?.fileId || flashcards?.fileId;

            if (!fileId) {
                console.error("No fileId found for deletion");
                return;
            }

            const res = await fetch(`${API_URL}/api/delete/flashcards/${fileId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                onClose();
            } else {
                console.error("Delete failed");
            }
        } catch (error) {
            console.error("Delete error", error);
        } finally {
            setIsDeleting(false);
        }
    };

    if (isGenerating) {
        return (
            <div className="absolute inset-0 bg-black z-10 flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
                <div className="flex items-center gap-4 mb-4">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
                <h2 className="text-2xl text-white/90 font-medium mb-2">Generating Flashcards...</h2>
                <p className="text-white/50 text-sm">based on your source</p>
            </div>
        );
    }

    if (!flashcards || flashcards.length === 0) {
        return null;
    }

    const currentCard = flashcards[currentIndex];

    const handleNext = () => {
        if (currentIndex < flashcards.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev + 1), 150); // Slight delay for flip reset
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
        }
    };

    return (
        <div className={`flex flex-col bg-black p-6 animate-in slide-in-from-right duration-500 overflow-hidden ${isMaximized ? 'fixed inset-0 z-50' : 'absolute inset-0'}`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-6 shrink-0">
                <div>
                    <h2 className="text-2xl text-white font-medium mb-1">Flashcards</h2>
                    <p className="text-white/50 text-sm">Based on 1 source</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleDelete}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-red-400"
                        title="Delete Flashcards"
                        disabled={isDeleting}
                    >
                        {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={() => setIsMaximized(!isMaximized)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title={isMaximized ? "Minimize" : "Maximize"}
                    >
                        {isMaximized ? <Minimize2 className="w-5 h-5 text-white/70" /> : <Maximize2 className="w-5 h-5 text-white/70" />}
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Close">
                        <X className="w-5 h-5 text-white/70" />
                    </button>
                </div>
            </div>

            {/* Instructions */}
            <div className="text-center text-white/30 text-xs mb-4 shrink-0">
                Press "Space" to flip, "← / →" to navigate
            </div>

            {/* Card Area */}
            <div className="flex-1 flex items-center justify-center perspective-1000 min-h-0 relative">
                <div
                    className="relative w-full max-w-md aspect-[3/4] cursor-pointer group perspective-1000"
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    <motion.div
                        className="w-full h-full relative preserve-3d transition-all duration-500"
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Front */}
                        <div className="absolute inset-0 backface-hidden bg-[#1a1a1a] rounded-3xl p-8 flex flex-col items-center justify-center text-center border border-white/5 shadow-2xl">
                            <h3 className="text-2xl md:text-3xl text-white font-medium leading-relaxed">
                                {currentCard.front}
                            </h3>
                            <p className="absolute bottom-8 text-white/30 text-sm font-medium">
                                See answer
                            </p>
                        </div>

                        {/* Back */}
                        <div
                            className="absolute inset-0 backface-hidden bg-[#111] rounded-3xl p-8 flex flex-col items-center justify-center text-center border border-blue-500/20 shadow-2xl shadow-blue-900/10"
                            style={{ transform: 'rotateY(180deg)' }}
                        >
                            <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light">
                                {currentCard.back}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center justify-between shrink-0">
                <button
                    onClick={() => {
                        setCurrentIndex(0);
                        setIsFlipped(false);
                    }}
                    className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4 bg-white/5 rounded-full p-1 px-2">
                    <button
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        className={`p-2 rounded-full transition-colors ${currentIndex === 0 ? 'text-white/20 cursor-not-allowed' : 'hover:bg-white/10 text-white'}`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="h-1 w-32 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
                        />
                    </div>
                    <span className="text-xs text-white/50 font-medium min-w-[60px] text-center">
                        {currentIndex + 1} / {flashcards.length} cards
                    </span>

                    <button
                        onClick={handleNext}
                        disabled={currentIndex === flashcards.length - 1}
                        className={`p-2 rounded-full transition-colors ${currentIndex === flashcards.length - 1 ? 'text-white/20 cursor-not-allowed' : 'hover:bg-white/10 text-white'}`}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="w-9" /> {/* Spacer for balance */}
            </div>
        </div>
    );
}
