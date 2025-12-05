'use client';
'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, FileText, Clock, Trash2 } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

export default function NotebooksPage() {
    const router = useRouter();
    const [notebooks, setNotebooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            fetchNotebooks(parsedUser.id);
        } else {
            router.push('/auth');
        }
    }, [router]);

    const fetchNotebooks = async (userId) => {
        try {
            const res = await fetch(`http://localhost:4000/api/notebooks/${userId}`);
            if (res.ok) {
                const data = await res.json();
                setNotebooks(data);
            }
        } catch (error) {
            console.error('Failed to fetch notebooks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNotebook = async () => {
        if (!user) return;
        try {
            const res = await fetch('http://localhost:4000/api/notebooks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, title: 'Untitled Notebook' })
            });
            if (res.ok) {
                const newNotebook = await res.json();
                setNotebooks([newNotebook, ...notebooks]);
            }
        } catch (error) {
            console.error('Failed to create notebook:', error);
        }
    };

    const handleDeleteNotebook = async (notebookId, e) => {
        e.stopPropagation(); // Prevent opening the notebook
        if (!confirm('Are you sure you want to delete this notebook? All associated files will be unlinked.')) {
            return;
        }

        try {
            const res = await fetch(`http://localhost:4000/api/notebooks/${notebookId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setNotebooks(notebooks.filter(n => n.id !== notebookId));
            }
        } catch (error) {
            console.error('Failed to delete notebook:', error);
        }
    };

    const filteredNotebooks = notebooks.filter(notebook =>
        notebook.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 sticky top-0 bg-black/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-semibold">Cognote</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <FadeIn>
                    <div className="flex items-center justify-between mb-12">
                        <h1 className="text-3xl font-medium">My Notebooks</h1>
                        <div className="relative">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search notebooks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-white/20 w-64 transition-colors"
                            />
                        </div>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* New Notebook Card */}
                    <FadeIn delay={0.1}>
                        <button
                            onClick={handleCreateNotebook}
                            className="group aspect-[4/3] rounded-3xl border-2 border-dashed border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 flex flex-col items-center justify-center gap-4 transition-all duration-300 w-full"
                        >
                            <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-blue-500/20 flex items-center justify-center transition-colors">
                                <Plus className="w-6 h-6 text-gray-400 group-hover:text-blue-400" />
                            </div>
                            <span className="font-medium text-gray-400 group-hover:text-blue-400">Create new notebook</span>
                        </button>
                    </FadeIn>

                    {/* Existing Notebooks */}
                    {filteredNotebooks.map((notebook, index) => (
                        <FadeIn key={notebook.id} delay={0.1 + (index + 1) * 0.1}>
                            <div
                                onClick={() => router.push('/dashboard')}
                                className="group aspect-[4/3] rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 p-6 flex flex-col justify-between relative cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <button
                                        onClick={(e) => handleDeleteNotebook(notebook.id, e)}
                                        className="p-2 hover:bg-red-500/20 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                        title="Delete notebook"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                    </button>
                                </div>

                                <div>
                                    <h3 className="font-medium text-lg mb-1 group-hover:text-blue-400 transition-colors">{notebook.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock className="w-3 h-3" />
                                        <p>{formatDate(notebook.updatedAt)}</p>
                                        {notebook._count && notebook._count.files > 0 && (
                                            <>
                                                <span>•</span>
                                                <p>{notebook._count.files} file{notebook._count.files !== 1 ? 's' : ''}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </main>
        </div>
    );
}
