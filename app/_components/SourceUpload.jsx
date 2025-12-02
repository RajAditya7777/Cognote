import React from 'react';
import { Upload, Sparkles } from 'lucide-react';

const SourceUpload = () => {
    return (
        <section className="py-24 bg-black text-white">
            <div className="max-w-7xl mx-auto px-6 space-y-32">
                {/* Row 1: Upload (Text Left, Visual Right) */}
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                            <Upload className="w-6 h-6 text-blue-400" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-medium leading-tight">
                            Upload your sources
                        </h2>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-lg">
                            CogNote is grounded in the sources you choose. You can upload PDFs, text files, Google Docs, or copy and paste text.
                        </p>
                    </div>

                    <div className="flex-1 w-full">
                        <div className="relative aspect-[4/3] rounded-3xl bg-white/5 border border-white/10 overflow-hidden group">
                            <video
                                className="w-full h-full object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                            >
                                <source src="/upload_your_sources.mp4" type="video/mp4" />
                            </video>
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Row 2: Insights (Visual Left, Text Right) */}
                <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
                    <div className="flex-1 space-y-6">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                            <Sparkles className="w-6 h-6 text-blue-400" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-medium leading-tight">
                            Instant insights
                        </h2>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-lg">
                            Once your sources are uploaded, NotebookLM instantly becomes an expert in the material. It can summarize, answer questions, and make connections.
                        </p>
                    </div>

                    <div className="flex-1 w-full">
                        <div className="relative aspect-[4/3] rounded-3xl bg-[#020704] border border-white/10 overflow-hidden group">
                            <img
                                src="/m2.png"
                                alt="Instant insights"
                                className="w-full h-full object-contain"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SourceUpload;
