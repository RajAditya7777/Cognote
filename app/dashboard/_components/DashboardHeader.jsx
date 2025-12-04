import { Button } from "@/components/ui/button";
import { Settings, Share2, BarChart2, Plus, LogOut, Search, Bell, User } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardHeader({ user, notebook, onNotebookUpdate }) {
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);
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

    const handleCreateNotebook = async () => {
        if (!user?.id) return;
        setIsCreating(true);
        try {
            const res = await fetch('http://localhost:4000/api/notebooks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, title: 'Untitled Notebook' })
            });
            if (res.ok) {
                const notebook = await res.json();
                // Redirect to the new notebook or just refresh?
                // For now, let's redirect to the notebooks page or stay here.
                // Since the user is already on dashboard (which seems to be a single notebook view),
                // maybe we should redirect to /notebooks to see the list?
                // Or maybe reload the dashboard with the new notebook context?
                // Let's redirect to /notebooks for now as it lists them.
                router.push('/notebooks');
            }
        } catch (error) {
            console.error("Failed to create notebook", error);
        } finally {
            setIsCreating(false);
        }
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
                    className="bg-white text-black hover:bg-gray-200 rounded-full h-9 px-4 text-sm font-medium border-none"
                    onClick={handleCreateNotebook}
                    disabled={isCreating}
                >
                    {isCreating ? (
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                    ) : (
                        <Plus className="w-4 h-4 mr-2" />
                    )}
                    Create notebook
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
