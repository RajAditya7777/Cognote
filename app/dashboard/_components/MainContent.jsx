import { Button } from "@/components/ui/button";
import { Upload, ArrowRight, SlidersHorizontal, Loader2, Send, User, Bot, X, Save } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function MainContent({ files = [], selectedFileIds = [], onUploadSuccess, userId, notebookId, suggestedAction, onActionComplete }) {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [isThinking, setIsThinking] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [customPrompt, setCustomPrompt] = useState("");
    const [isSavingPrompt, setIsSavingPrompt] = useState(false);
    const chatContainerRef = useRef(null);

    // Simple auto-scroll to bottom on new messages
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    useEffect(() => {
        if (suggestedAction) {
            setMessage(suggestedAction);
            // Small timeout to allow state update before sending
            const timer = setTimeout(() => {
                handleSendMessage(suggestedAction);
                onActionComplete?.();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [suggestedAction]);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!userId) return;
            try {
                // Use selected file if available, otherwise default to first file
                const targetFileId = selectedFileIds.length > 0 ? selectedFileIds[0] : (files.length > 0 ? files[0].id : null);

                let url = `http://localhost:4000/api/chat/history?userId=${userId}`;
                if (targetFileId) {
                    url += `&fileId=${targetFileId}`;
                }
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setChatHistory(data.map(msg => ({ role: msg.role, content: msg.content })));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch chat history", error);
            }
        };
        fetchHistory();
    }, [userId, files, selectedFileIds]);

    useEffect(() => {
        if (showSettings && userId) {
            // Fetch current custom prompt
            fetch(`http://localhost:4000/api/user/settings/${userId}`)
                .then(res => res.json())
                .then(data => {
                    setCustomPrompt(data.customPrompt || "");
                })
                .catch(err => console.error("Failed to fetch settings", err));
        }
    }, [showSettings, userId]);

    const handleSavePrompt = async () => {
        if (!userId) return;
        setIsSavingPrompt(true);
        try {
            const res = await fetch('http://localhost:4000/api/user/settings/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    customPrompt
                })
            });
            if (res.ok) {
                setShowSettings(false);
            }
        } catch (error) {
            console.error("Failed to save prompt", error);
        } finally {
            setIsSavingPrompt(false);
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !userId) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('userId', userId);
        if (notebookId) {
            formData.append('notebookId', notebookId);
        }

        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No auth token found");
            return;
        }

        try {
            const res = await fetch('http://localhost:4000/api/pdf/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                onUploadSuccess?.();
            } else {
                console.error("Upload failed");
            }
        } catch (error) {
            console.error("Upload error", error);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSendMessage = async (contentOverride = null) => {
        const contentToSend = contentOverride || message;
        if (!contentToSend.trim()) return;

        const userMessage = { role: 'user', content: contentToSend };
        setChatHistory(prev => [...prev, userMessage]);
        setMessage("");
        setIsThinking(true);

        try {
            // Use the most recent file as context if available
            const targetFileId = selectedFileIds.length > 0 ? selectedFileIds[0] : (files.length > 0 ? files[0].id : null);

            const res = await fetch('http://localhost:4000/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage.content,
                    fileId: targetFileId,
                    conversationHistory: chatHistory,
                    userId
                })
            });

            const data = await res.json();

            if (res.ok) {
                setChatHistory(prev => [...prev, { role: 'assistant', content: data.content }]);
            } else {
                setChatHistory(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error processing your request." }]);
            }
        } catch (error) {
            console.error("Chat error", error);
            setChatHistory(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't connect to the server." }]);
        } finally {
            setIsThinking(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-black relative border-x border-white/10 overflow-hidden min-h-0 h-full">
            {/* Chat Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/5 shrink-0">
                <h2 className="text-white/90 font-medium">Chat</h2>
                <button
                    onClick={() => setShowSettings(true)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <SlidersHorizontal className="text-white/50 w-5 h-5" />
                </button>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Chat Settings</h3>
                            <button
                                onClick={() => setShowSettings(false)}
                                className="text-white/50 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs text-white/50 uppercase tracking-wider font-medium mb-2">
                                Custom System Prompt
                            </label>
                            <textarea
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                                placeholder="e.g. Explain like I'm 5, or Focus on technical details..."
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-blue-500/50 min-h-[120px] resize-none placeholder:text-white/20 leading-relaxed"
                            />
                            <p className="text-white/30 text-xs mt-2">
                                This instruction will be appended to all AI responses.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowSettings(false)}
                                className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSavePrompt}
                                disabled={isSavingPrompt}
                                className="bg-white text-black hover:bg-white/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSavingPrompt ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Center Content */}
            <div
                className="flex-1 overflow-y-auto p-6 min-h-0"
                ref={chatContainerRef}
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
                }}
            >
                {files.length === 0 && chatHistory.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <Upload className="w-8 h-8 text-blue-400" />
                        </div>
                        <h1 className="text-3xl text-white/90 font-light mb-4 text-center tracking-tight">Add a source to get started</h1>
                        <p className="text-white/50 text-center max-w-md mb-8">Upload a PDF to unlock AI-powered insights, summaries, and Q&A.</p>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf"
                            onChange={handleFileSelect}
                        />
                        <Button
                            variant="outline"
                            className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-full px-8 py-6 h-auto text-base font-medium transition-all duration-300"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                        >
                            {uploading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Upload className="w-5 h-5 mr-2" />}
                            {uploading ? 'Uploading...' : 'Upload a source'}
                        </Button>
                    </div>
                ) : (
                    <div className="flex-1 space-y-8 max-w-3xl mx-auto w-full">
                        {chatHistory.length === 0 && (
                            <div className="text-center text-white/50 mt-20">
                                <Bot className="w-12 h-12 mx-auto mb-4 text-white/20" />
                                <p className="text-lg font-light">Ask a question about your sources...</p>
                            </div>
                        )}
                        {chatHistory.map((msg, idx) => (
                            <div key={idx} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-white/10' : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}>
                                    {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-6 h-6 text-white" />}
                                </div>
                                <div className={`rounded-2xl p-6 max-w-[85%] shadow-md ${msg.role === 'user' ? 'bg-white/10 text-white' : 'bg-[#1a1a1a] border border-white/5 text-gray-200'}`}>
                                    <div className="prose prose-invert prose-sm max-w-none leading-relaxed whitespace-pre-wrap font-light">
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isThinking && (
                            <div className="flex gap-6 animate-in fade-in duration-300">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div className="rounded-2xl p-6 bg-[#1a1a1a] border border-white/5 text-gray-200 shadow-md flex items-center gap-3">
                                    <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Thinking</span>
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 pb-8 max-w-4xl mx-auto w-full shrink-0 bg-black border-t border-white/5">
                <div className="bg-white/5 rounded-full p-2 pl-6 flex items-center border border-white/10 h-16 transition-colors focus-within:border-white/20">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={files.length === 0 ? "Upload a source or just chat..." : "Ask a question about your sources..."}
                        className="bg-transparent text-white placeholder:text-white/30 flex-1 outline-none text-lg"
                    />
                    {files.length > 0 && (
                        <span className="text-white/30 text-sm mr-4">{files.length} sources</span>
                    )}
                    <button
                        onClick={handleSendMessage}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${message.trim() ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}
                        disabled={!message.trim() || isThinking}
                    >
                        {isThinking ? <Loader2 className="w-5 h-5 animate-spin" /> : (files.length === 0 ? <ArrowRight className="w-6 h-6" /> : <Send className="w-5 h-5" />)}
                    </button>
                </div>
                <p className="text-center text-white/30 text-xs mt-3">
                    NotebookLM can be inaccurate; please double check its responses.
                </p>
            </div>
        </div >
    );
}
