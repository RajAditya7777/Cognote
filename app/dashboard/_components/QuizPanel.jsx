'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Loader2, Flag, Trash2, X } from 'lucide-react';

export default function QuizPanel({ quiz, isGenerating, onClose }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [markedForReview, setMarkedForReview] = useState(new Set());
    const [showHint, setShowHint] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);

    const handleDeleteQuiz = async () => {
        if (!confirm("Are you sure you want to delete this quiz?")) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`http://localhost:4000/api/delete/quiz/${quiz.fileId}`, {
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
                <h2 className="text-2xl text-white/90 font-medium mb-2">Generating Quiz...</h2>
                <p className="text-white/50 text-sm">based on 1 source</p>
            </div>
        );
    }

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        return null;
    }

    const totalQuestions = quiz.questions.length;

    // Report View
    if (isSubmitted) {
        const score = quiz.questions.reduce((acc, q, idx) => {
            const selected = selectedAnswers[idx];
            const correctIndex = q.options.findIndex(opt => opt === q.answer);
            return acc + (selected === correctIndex ? 1 : 0);
        }, 0);

        const accuracy = Math.round((score / totalQuestions) * 100);
        const wrong = totalQuestions - score;
        const skipped = totalQuestions - Object.keys(selectedAnswers).length;

        return (
            <div className={`flex flex-col bg-black p-6 animate-in fade-in duration-500 overflow-hidden ${isMaximized ? 'fixed inset-0 z-50' : 'absolute inset-0'}`}>
                <div className="flex items-start justify-between mb-12">
                    <div>
                        <h2 className="text-2xl text-white font-medium mb-1">{quiz.title || 'Quiz'}</h2>
                        <p className="text-white/50 text-sm">Based on 1 source</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleDeleteQuiz}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-red-400"
                            title="Delete Quiz"
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

                <div className="flex-1 flex flex-col items-center justify-center text-center mb-12">
                    <h3 className="text-3xl text-white font-medium mb-8">You did it! Quiz Complete.</h3>

                    <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
                        <div className="bg-[#1a1a1a] rounded-2xl p-6 text-left">
                            <div className="text-white/70 text-sm mb-1">Score</div>
                            <div className="text-4xl text-white font-light">{score} / {totalQuestions}</div>
                        </div>
                        <div className="bg-[#1a1a1a] rounded-2xl p-6 text-left">
                            <div className="text-white/70 text-sm mb-1">Accuracy</div>
                            <div className="text-4xl text-white font-light">{accuracy}%</div>
                        </div>
                        <div className="bg-[#1a1a1a] rounded-2xl p-6 text-left flex flex-col justify-center gap-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-white/70">Right</span>
                                <span className="text-white">{score}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white/70">Wrong</span>
                                <span className="text-white">{wrong}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white/70">Skipped</span>
                                <span className="text-white">{skipped}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-auto">
                    <button
                        onClick={() => setIsSubmitted(false)}
                        className="px-6 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
                    >
                        Review Quiz
                    </button>
                    <button
                        onClick={() => {
                            setIsSubmitted(false);
                            setCurrentQuestion(0);
                            setSelectedAnswers({});
                            setMarkedForReview(new Set());
                        }}
                        className="px-6 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
                    >
                        Retake Quiz
                    </button>
                </div>
            </div>
        );
    }

    const question = quiz.questions[currentQuestion];
    const selectedAnswer = selectedAnswers[currentQuestion];
    const isMarked = markedForReview.has(currentQuestion);

    const handleAnswerSelect = (optionIndex) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestion]: optionIndex
        }));
        setShowHint(false);
    };

    const toggleReview = () => {
        const newMarked = new Set(markedForReview);
        if (newMarked.has(currentQuestion)) {
            newMarked.delete(currentQuestion);
        } else {
            newMarked.add(currentQuestion);
        }
        setMarkedForReview(newMarked);
    };

    const handleNext = () => {
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(prev => prev + 1);
            setShowHint(false);
        } else {
            setIsSubmitted(true);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
            setShowHint(false);
        }
    };

    return (
        <div className={`flex flex-col bg-black p-6 animate-in slide-in-from-right duration-500 overflow-hidden ${isMaximized ? 'fixed inset-0 z-50' : 'absolute inset-0'}`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
                        <span>Studio</span>
                        <ChevronRight className="w-4 h-4" />
                        <span>App</span>
                    </div>
                    <h2 className="text-2xl text-white font-medium mb-1">{quiz.title || 'Quiz'}</h2>
                    <p className="text-white/50 text-sm">Based on 1 source</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleDeleteQuiz}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-red-400"
                        title="Delete Quiz"
                        disabled={isDeleting}
                    >
                        {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={toggleReview}
                        className={`p-2 rounded-lg transition-colors ${isMarked ? 'bg-orange-500/20 text-orange-500' : 'hover:bg-white/10 text-white/70'
                            }`}
                        title="Mark for review"
                    >
                        <Flag className={`w-5 h-5 ${isMarked ? 'fill-current' : ''}`} />
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

            {/* Progress */}
            <div className="text-white/50 text-sm mb-6 flex justify-between items-center">
                <span>{currentQuestion + 1} / {totalQuestions}</span>
                {isMarked && <span className="text-orange-500 text-xs font-medium">Marked for review</span>}
            </div>

            {/* Question */}
            <div className="flex-1 overflow-y-auto min-h-0">
                <h3 className="text-white text-lg font-normal mb-6 leading-relaxed">
                    {question.question}
                </h3>

                {/* Options */}
                <div className="space-y-3">
                    {question.options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrect = option === question.answer;
                        const showFeedback = selectedAnswer !== undefined;
                        const optionLabel = String.fromCharCode(65 + index); // A, B, C, D

                        // Determine styling based on state
                        let containerClass = "w-full text-left p-4 rounded-xl transition-all duration-200 border-2 ";

                        if (showFeedback) {
                            if (isSelected) {
                                if (isCorrect) {
                                    containerClass += "bg-green-500/10 border-green-500";
                                } else {
                                    containerClass += "bg-red-500/10 border-red-500";
                                }
                            } else if (isCorrect) {
                                // Show correct answer even if not selected
                                containerClass += "bg-green-500/10 border-green-500";
                            } else {
                                containerClass += "bg-white/5 border-white/10 opacity-50";
                            }
                        } else {
                            containerClass += "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20";
                        }

                        return (
                            <div key={index} className="space-y-2">
                                <button
                                    onClick={() => !showFeedback && handleAnswerSelect(index)}
                                    disabled={showFeedback}
                                    className={containerClass}
                                >
                                    <div className="flex gap-3">
                                        <span className="text-white/70 font-medium shrink-0">{optionLabel}.</span>
                                        <span className="text-white/90">{option}</span>
                                    </div>
                                </button>

                                {/* Feedback Section */}
                                {showFeedback && (isSelected || (isCorrect && !isSelected && selectedAnswer !== undefined)) && question.explanations && (
                                    <div className={`text-sm p-3 rounded-lg ml-8 animate-in fade-in slide-in-from-top-1 ${option === question.answer ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                        <div className="font-bold mb-1">
                                            {option === question.answer ? '✓ Right answer' : '✕ Not quite'}
                                        </div>
                                        <div className="text-white/70">
                                            {question.explanations[index] || "No explanation available."}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Hint Button */}
                {question.hint && (
                    <div className="mt-6">
                        <button
                            onClick={() => setShowHint(!showHint)}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 text-sm transition-colors"
                        >
                            Hint ▼
                        </button>
                        {showHint && (
                            <div className="mt-3 p-4 bg-white/5 rounded-lg text-white/70 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
                                {question.hint}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-6">
                <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${currentQuestion === 0
                        ? 'bg-white/5 text-white/30 cursor-not-allowed'
                        : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${currentQuestion === totalQuestions - 1
                        ? 'bg-green-600 text-white hover:bg-green-500'
                        : 'bg-blue-600 text-white hover:bg-blue-500'
                        }`}
                >
                    {currentQuestion === totalQuestions - 1 ? 'Submit' : 'Next'}
                </button>
            </div>

            {/* Content Rating */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/10 mt-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 text-sm transition-colors">
                    <span>👍</span>
                    <span>Good content</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 text-sm transition-colors">
                    <span>👎</span>
                    <span>Bad content</span>
                </button>
            </div>
        </div>
    );
}
