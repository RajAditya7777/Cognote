'use client';
import { useState } from 'react';
import { Maximize2, Minimize2, Loader2, Trash2, FileText, X } from 'lucide-react';

export default function SummaryPanel({ summary, isGenerating, onClose }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this summary?")) return;

        setIsDeleting(true);
        try {
            // Assuming summary object has fileId
            const fileId = summary?.fileId;

            if (!fileId) {
                console.error("No fileId found for deletion");
                return;
            }

            const res = await fetch(`http://localhost:4000/api/delete/summary/${fileId}`, {
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
                <h2 className="text-2xl text-white/90 font-medium mb-2">Generating Summary...</h2>
                <p className="text-white/50 text-sm">based on your source</p>
            </div>
        );
    }

    if (!summary || !summary.content) {
        return null;
    }

    return (
        <div className={`flex flex-col bg-black p-6 animate-in slide-in-from-right duration-500 overflow-hidden ${isMaximized ? 'fixed inset-0 z-50' : 'absolute inset-0'}`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-6 shrink-0">
                <div>
                    <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
                        <span>Studio</span>
                        <FileText className="w-4 h-4" />
                        <span>Summary</span>
                    </div>
                    <h2 className="text-2xl text-white font-medium mb-1">Summary</h2>
                    <p className="text-white/50 text-sm">Based on 1 source</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleDelete}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-red-400"
                        title="Delete Summary"
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto min-h-0 pr-2">
                <div className="prose prose-invert prose-lg max-w-none">
                    <div className="text-white/80 leading-relaxed whitespace-pre-wrap font-light text-lg">
                        {summary.content}
                    </div>
                </div>
            </div>
        </div>
    );
}
