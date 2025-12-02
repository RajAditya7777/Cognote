import React from 'react';
import { Quote } from 'lucide-react';

const Citations = () => {
    return (
        <section className="py-24 bg-black text-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                            <Quote className="w-6 h-6 text-blue-400" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-medium leading-tight">
                            See the source, not just the answer
                        </h2>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-lg">
                            Every response from NotebookLM comes with citations. Click on a citation to jump directly to the passage in your source material that the AI used.
                        </p>
                    </div>

                    <div className="flex-1 w-full">
                        <div className="relative aspect-[4/3] rounded-3xl bg-white/5 border border-white/10 overflow-hidden group">
                            {/* Abstract representation of citations */}
                            <div className="absolute top-8 left-8 right-8 bottom-8 bg-black/40 rounded-xl border border-white/5 p-6 space-y-4">
                                <div className="flex gap-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                    <div className="h-2 w-2 rounded-full bg-red-500" />
                                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                </div>
                                <div className="space-y-3">
                                    <div className="h-3 bg-white/20 rounded w-full" />
                                    <div className="h-3 bg-white/20 rounded w-5/6" />
                                    <div className="h-3 bg-white/20 rounded w-4/5" />
                                </div>

                                {/* Citation Popover */}
                                <div className="absolute bottom-12 right-12 bg-blue-900/90 backdrop-blur-md p-4 rounded-xl border border-blue-500/30 shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="text-xs text-blue-200 mb-1">Source 1</div>
                                    <div className="h-2 bg-blue-200/50 rounded w-32" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Citations;
