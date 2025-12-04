import { Layers, FileText, HelpCircle, LayoutGrid, Trash2 } from "lucide-react";
import QuizPanel from "./QuizPanel";
import FlashcardPanel from "./FlashcardPanel";
import SummaryPanel from "./SummaryPanel";

export default function SidebarRight({
    onAction,
    quizData,
    isQuizGenerating,
    showQuiz,
    onCloseQuiz,
    flashcardsData,
    isFlashcardsGenerating,
    showFlashcards,
    onCloseFlashcards,
    summaryData,
    isSummaryGenerating,
    showSummary,
    onCloseSummary,
    files,
    onDeleteContent, // Callback to handle deletion
    userId
}) {
    const features = [
        { icon: Layers, label: "Flashcards", action: "flashcards" },
        { icon: FileText, label: "Summary", action: "summary" },
        { icon: HelpCircle, label: "Quiz", action: "quiz" },
    ];

    const handleFeatureClick = (action) => {
        onAction(action);
    };

    // Helper to format time
    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    // Get the active file (assuming single file selection for now, or just showing all content for the first file)
    const activeFile = files && files.length > 0 ? files[0] : null;

    return (
        <div className="w-full bg-black flex flex-col h-full shrink-0 relative overflow-hidden">
            {showQuiz && !isQuizGenerating ? (
                <QuizPanel
                    quiz={quizData}
                    isGenerating={isQuizGenerating}
                    onClose={onCloseQuiz}
                />
            ) : showFlashcards && !isFlashcardsGenerating ? (
                <FlashcardPanel
                    flashcards={flashcardsData}
                    isGenerating={isFlashcardsGenerating}
                    onClose={onCloseFlashcards}
                />
            ) : showSummary && !isSummaryGenerating ? (
                <SummaryPanel
                    summary={summaryData}
                    isGenerating={isSummaryGenerating}
                    onClose={onCloseSummary}
                />
            ) : (
                <>
                    <div className="p-4 flex items-center justify-between shrink-0">
                        <h2 className="text-white/90 font-medium">Studio</h2>
                        <LayoutGrid className="text-white/50 w-5 h-5" />
                    </div>

                    <div className="px-4 grid grid-cols-2 gap-3 mb-8 shrink-0">
                        {features.map((feature, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleFeatureClick(feature.action)}
                                className="bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-4 cursor-pointer flex flex-col justify-between h-24 text-left group"
                            >
                                <feature.icon className="w-5 h-5 text-white/70 group-hover:text-blue-400 transition-colors" />
                                <span className="text-white/90 text-sm font-medium">{feature.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Generated Content List */}
                    {activeFile && (
                        <div className="px-4 flex-1 overflow-y-auto min-h-0">
                            {(isQuizGenerating || isFlashcardsGenerating || isSummaryGenerating || (activeFile.flashcards?.length > 0 || activeFile.quiz?.length > 0 || activeFile.summary)) && (
                                <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-4 sticky top-0 bg-black py-2 z-10">Generated Content</h3>
                            )}

                            <div className="space-y-3 pb-4">
                                {/* Loading Cards */}
                                {isQuizGenerating && (
                                    <div className="bg-[#1a1a1a] rounded-xl p-4 flex items-center gap-4 border border-white/5 animate-pulse">
                                        <div className="p-2 bg-white/5 rounded-lg">
                                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white font-medium text-sm">Generating Quiz...</h4>
                                            <div className="text-white/30 text-xs mt-1">based on 1 source</div>
                                        </div>
                                    </div>
                                )}

                                {isFlashcardsGenerating && (
                                    <div className="bg-[#1a1a1a] rounded-xl p-4 flex items-center gap-4 border border-white/5 animate-pulse">
                                        <div className="p-2 bg-white/5 rounded-lg">
                                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white font-medium text-sm">Generating Flashcards...</h4>
                                            <div className="text-white/30 text-xs mt-1">based on 1 source</div>
                                        </div>
                                    </div>
                                )}

                                {isSummaryGenerating && (
                                    <div className="bg-[#1a1a1a] rounded-xl p-4 flex items-center gap-4 border border-white/5 animate-pulse">
                                        <div className="p-2 bg-white/5 rounded-lg">
                                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white font-medium text-sm">Generating Summary...</h4>
                                            <div className="text-white/30 text-xs mt-1">based on 1 source</div>
                                        </div>
                                    </div>
                                )}

                                {/* Existing Content */}
                                {activeFile.flashcards?.map((flashcardSet, index) => (
                                    <div
                                        key={flashcardSet.id || index}
                                        className="group bg-[#1a1a1a] hover:bg-[#222] transition-colors rounded-xl p-4 flex items-center gap-4 cursor-pointer border border-transparent hover:border-white/5"
                                    >
                                        <div className="p-2 bg-white/5 rounded-lg">
                                            <Layers className="w-5 h-5 text-white/70" />
                                        </div>
                                        <div className="flex-1 min-w-0" onClick={() => onAction('open_flashcards')}>
                                            <h4 className="text-white font-medium text-sm truncate">{flashcardSet.name || `Generated Flashcards ${index + 1}`}</h4>
                                            <div className="flex items-center gap-2 text-white/30 text-xs mt-1">
                                                <span>1 source</span>
                                                <span>•</span>
                                                <span>{formatTime(flashcardSet.createdAt)}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDeleteContent('flashcards', flashcardSet.id); }}
                                            className="p-2 hover:bg-white/10 rounded-lg text-white/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}

                                {activeFile.quiz?.map((quizItem, index) => (
                                    <div
                                        key={quizItem.id || index}
                                        className="group bg-[#1a1a1a] hover:bg-[#222] transition-colors rounded-xl p-4 flex items-center gap-4 cursor-pointer border border-transparent hover:border-white/5"
                                    >
                                        <div className="p-2 bg-white/5 rounded-lg">
                                            <HelpCircle className="w-5 h-5 text-white/70" />
                                        </div>
                                        <div className="flex-1 min-w-0" onClick={() => onAction('open_quiz')}>
                                            <h4 className="text-white font-medium text-sm truncate">{quizItem.name || quizItem.title || `Generated Quiz ${index + 1}`}</h4>
                                            <div className="flex items-center gap-2 text-white/30 text-xs mt-1">
                                                <span>1 source</span>
                                                <span>•</span>
                                                <span>{formatTime(quizItem.createdAt)}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDeleteContent('quiz', quizItem.id); }}
                                            className="p-2 hover:bg-white/10 rounded-lg text-white/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}

                                {activeFile.summary && (
                                    <div className="group bg-[#1a1a1a] hover:bg-[#222] transition-colors rounded-xl p-4 flex items-center gap-4 cursor-pointer border border-transparent hover:border-white/5">
                                        <div className="p-2 bg-white/5 rounded-lg">
                                            <FileText className="w-5 h-5 text-white/70" />
                                        </div>
                                        <div className="flex-1 min-w-0" onClick={() => onAction('open_summary')}>
                                            <h4 className="text-white font-medium text-sm truncate">{activeFile.summary.name || 'Document Summary'}</h4>
                                            <div className="flex items-center gap-2 text-white/30 text-xs mt-1">
                                                <span>1 source</span>
                                                <span>•</span>
                                                <span>{formatTime(activeFile.summary.createdAt)}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDeleteContent('summary', activeFile.summary.id); }}
                                            className="p-2 hover:bg-white/10 rounded-lg text-white/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="mt-auto p-8 text-center shrink-0">
                        <div className="w-8 h-8 mx-auto mb-3 text-white/30">
                            <LayoutGrid className="w-full h-full" />
                        </div>
                        <p className="text-white/70 text-sm font-medium mb-1">Studio output will be saved here.</p>
                        <p className="text-white/40 text-xs">
                            After adding sources, click to add Audio Overview, Study Guide, Mind Map, and more!
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
