import { Button } from "@/components/ui/button";
import { Upload, ArrowRight, SlidersHorizontal, Loader2, Send, User, Bot } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function MainContent({ files = [], onUploadSuccess, userId }) {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [isThinking, setIsThinking] = useState(false);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory, isThinking]);

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !userId) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('userId', userId);

        try {
            const res = await fetch('http://localhost:4000/api/pdf/upload', {
                method: 'POST',
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

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        const userMessage = { role: 'user', content: message };
        setChatHistory(prev => [...prev, userMessage]);
        setMessage("");
        setIsThinking(true);

        try {
            // Use the most recent file as context if available
            const fileId = files.length > 0 ? files[0].id : null;

            const res = await fetch('http://localhost:4000/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage.content,
                    fileId,
                    conversationHistory: chatHistory
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
        <div className="flex-1 flex flex-col h-full bg-black relative border-x border-white/10">
            {/* Chat Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/5">
                <h2 className="text-white/90 font-medium">Chat</h2>
                <SlidersHorizontal className="text-white/50 w-5 h-5" />
            </div>

            {/* Center Content */}
            <div className="flex-1 flex flex-col p-6 overflow-y-auto" ref={chatContainerRef}>
                {files.length === 0 && chatHistory.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-6">
                            <Upload className="w-8 h-8 text-blue-400" />
                        </div>
                        <h1 className="text-3xl text-white/90 font-normal mb-8 text-center">Add a source to get started</h1>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf"
                            onChange={handleFileSelect}
                        />
                        <Button
                            variant="outline"
                            className="bg-transparent border-white/20 text-white hover:bg-white/5 rounded-full px-8 py-6 h-auto text-base font-medium"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                        >
                            {uploading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Upload className="w-5 h-5 mr-2" />}
                            {uploading ? 'Uploading...' : 'Upload a source'}
                        </Button>
                    </div>
                ) : (
                    <div className="flex-1 space-y-6">
                        {chatHistory.length === 0 && (
                            <div className="text-center text-white/50 mt-10">
                                <p>Ask a question about your sources...</p>
                            </div>
                        )}
                        {chatHistory.map((msg, idx) => (
                            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-white/10' : 'bg-blue-600/20'}`}>
                                    {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-blue-400" />}
                                </div>
                                <div className={`rounded-2xl p-4 max-w-[80%] ${msg.role === 'user' ? 'bg-white/10 text-white' : 'bg-blue-600/10 text-blue-100'}`}>
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {isThinking && (
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
                                    <Bot className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="rounded-2xl p-4 bg-blue-600/10 text-blue-100">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 pb-8 max-w-4xl mx-auto w-full">
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
        </div>
    );
}
