'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Book, MoreVertical, Search } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

export default function NotebooksPage() {
    const router = useRouter();

    const notebooks = [
        { id: 1, title: 'Introduction to Cognote', date: 'Edited 2 hours ago' },
        { id: 2, title: 'Research Project 2024', date: 'Edited yesterday' },
        { id: 3, title: 'Meeting Notes', date: 'Edited 3 days ago' },
    ];

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
                                className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-white/20 w-64 transition-colors"
                            />
                        </div>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* New Notebook Card */}
                    <FadeIn delay={0.1}>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="group aspect-[4/3] rounded-3xl border-2 border-dashed border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 flex flex-col items-center justify-center gap-4 transition-all duration-300 w-full"
                        >
                            <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-blue-500/20 flex items-center justify-center transition-colors">
                                <Plus className="w-6 h-6 text-gray-400 group-hover:text-blue-400" />
                            </div>
                            <span className="font-medium text-gray-400 group-hover:text-blue-400">Create new notebook</span>
                        </button>
                    </FadeIn>

                    {/* Existing Notebooks */}
                    {notebooks.map((notebook, index) => (
                        <FadeIn key={notebook.id} delay={0.1 + (index + 1) * 0.1}>
                            <div
                                className="group aspect-[4/3] rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 p-6 flex flex-col justify-between relative cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                                        <Book className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <button className="p-1 hover:bg-white/10 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                                        <MoreVertical className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>

                                <div>
                                    <h3 className="font-medium text-lg mb-1 group-hover:text-blue-400 transition-colors">{notebook.title}</h3>
                                    <p className="text-sm text-gray-500">{notebook.date}</p>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </main>
        </div>
    );
}
