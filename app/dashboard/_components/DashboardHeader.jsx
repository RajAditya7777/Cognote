import { Button } from "@/components/ui/button";
import { Settings, Share2, BarChart2, Plus, LogOut, Search, Bell, User, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardHeader({ user, notebook, onNotebookUpdate }) {
    const router = useRouter();
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(notebook?.title || "Untitled Notebook");
    // Ideally we should get the notebook ID from props or context
    // For now we'll assume we're working with a specific notebook or the most recent one
    // But since the dashboard seems to be a general view, maybe we need to fetch the current notebook?
    // The user request implies "Untitled notebook" is the default.
    // Let's just make the UI work for now, assuming we might need to pass a notebook prop later.

    // Update title when notebook prop changes
    useEffect(() => {
        if (notebook?.title) {
            setTitle(notebook.title);
        } else {
            setTitle("Untitled Notebook"); // Reset if notebook is null/undefined
        }
    }, [notebook]);

    const handleRename = async (newTitle) => {
        setIsEditingTitle(false);
        if (!newTitle.trim()) {
            setTitle(notebook?.title || "Untitled Notebook");
            return;
        }

        // Don't save if title hasn't changed
        if (newTitle === notebook?.title) return;

        // Update local state immediately for better UX
        setTitle(newTitle);

        // Save to database
        if (notebook?.id) {
            console.log('Saving notebook title:', { id: notebook.id, title: newTitle });
            try {
                const res = await fetch(`http://localhost:4000/api/notebooks/${notebook.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: newTitle })
                });

                if (res.ok) {
                    const updatedNotebook = await res.json();
                    console.log('Notebook updated successfully:', updatedNotebook);
                    onNotebookUpdate?.(updatedNotebook);
                } else {
                    console.error('Failed to update notebook:', await res.text());
                    // Revert on error
                    setTitle(notebook.title);
                }
            } catch (error) {
                console.error("Failed to rename notebook", error);
            }
        }
    };

    const handleLogout = () => {
        // Clear user data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to auth page
        router.push('/auth');
    };

    return (
        <header className="h-16 border-b border-white/10 bg-black flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-black rounded-full" />
                </div>
                {isEditingTitle ? (
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={() => handleRename(title)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRename(title);
                            if (e.key === 'Escape') {
                                setIsEditingTitle(false);
                                // Reset to previous title if needed, but for now just cancel edit mode
                            }
                        }}
                        autoFocus
                        className="bg-transparent text-white text-lg font-medium outline-none border-b border-white/20 pb-0.5 w-64"
                    />
                ) : (
                    <span
                        onDoubleClick={() => setIsEditingTitle(true)}
                        className="text-white text-lg font-medium cursor-text hover:bg-white/5 px-2 py-1 rounded transition-colors select-none"
                        title="Double-click to rename"
                    >
                        {title}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    className="bg-white/5 text-white hover:bg-white/10 rounded-full h-9 px-4 text-sm font-medium border border-white/20"
                    onClick={() => router.push('/notebooks')}
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Notebooks
                </Button>

                <Button
                    variant="outline"
                    className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/30 rounded-full h-9 px-4 text-sm font-medium"
                    onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </Button>

                <div className="h-6 w-[1px] bg-white/20 mx-1" />



                <div className="flex items-center gap-4">

                    <Link href="/profile" className="flex items-center gap-3 pl-4 border-l border-white/10 hover:opacity-80 transition-opacity">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                            <p className="text-xs text-white/50">{user?.email}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-medium border border-white/10">
                            {user?.name?.[0] || <User className="w-4 h-4" />}
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
}
