import { Button } from "@/components/ui/button";
import { Plus, FileText, Loader2, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import API_URL from '@/config/api';

export default function SidebarLeft({ files = [], onUploadSuccess, userId, notebookId, selectedFileIds, onToggleFile }) {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

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
        if (!token) return;

        try {
            const res = await fetch(`${API_URL}/api/pdf/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token} `
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

    const handleDeleteFile = async (e, fileId) => {
        e.stopPropagation(); // Prevent triggering file selection
        if (!confirm("Are you sure you want to delete this file?")) return;

        setDeletingId(fileId);
        try {
            const res = await fetch(`${API_URL}/api/delete/file/${fileId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                onUploadSuccess?.();
            } else {
                console.error("Delete failed");
            }
        } catch (error) {
            console.error("Delete error", error);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="w-80 border-r border-white/10 bg-black flex flex-col h-full shrink-0">
            <div className="p-4 flex items-center justify-between">
                <h2 className="text-white/90 font-medium">Sources</h2>
                <FileText className="text-white/50 w-5 h-5" />
            </div>

            <div className="px-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileSelect}
                />
                <Button
                    variant="outline"
                    className="w-full bg-transparent border-white/20 text-white hover:bg-white/5 justify-center py-6 rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                >
                    {uploading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Plus className="w-5 h-5 mr-2" />}
                    {uploading ? 'Uploading...' : 'Add sources'}
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {files.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center p-6 mt-10">
                        <FileText className="w-12 h-12 text-white/20 mb-4" />
                        <p className="text-white/70 text-sm mb-1">Saved sources will appear here</p>
                        <p className="text-white/40 text-xs max-w-[240px]">
                            Click Add source above to add PDFs.
                        </p>
                    </div>
                ) : (
                    files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer group transition-colors">
                            <div className="flex items-center overflow-hidden">
                                <div className="mr-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                                    <input
                                        type="checkbox"
                                        checked={selectedFileIds?.includes(file.id)}
                                        onChange={(e) => { e.stopPropagation(); onToggleFile?.(file.id); }}
                                        className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-blue-500 checked:border-blue-500 transition-colors cursor-pointer"
                                    />
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center mr-3 shrink-0">
                                    <FileText className="w-5 h-5 text-red-400" />
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="text-white/90 text-sm font-medium truncate">{file.filename}</h3>
                                    <p className="text-white/40 text-xs truncate">PDF • {new Date(file.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <button
                                onClick={(e) => handleDeleteFile(e, file.id)}
                                className="p-2 text-white/30 hover:text-red-400 hover:bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                disabled={deletingId === file.id}
                            >
                                {deletingId === file.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
