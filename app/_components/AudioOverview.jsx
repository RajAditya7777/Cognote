import React from 'react';
import { Mic, Play, Pause } from 'lucide-react';

const AudioOverview = () => {
    return (
        <section className="py-24 bg-black text-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
                    <div className="flex-1 space-y-6">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                            <Mic className="w-6 h-6 text-blue-400" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-medium leading-tight">
                            Audio Overview
                        </h2>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-lg">
                            Turn your documents into an engaging audio conversation. With one click, two AI hosts summarize your material, make connections between topics, and banter back and forth. You can even download the conversation and listen on the go.
                        </p>
                    </div>

                    <div className="flex-1 w-full">
                        <div className="relative aspect-[4/3] rounded-3xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center group">
                            {/* Abstract representation of audio player */}
                            <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                                {[...Array(20)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-2 bg-blue-500 rounded-full animate-pulse"
                                        style={{
                                            height: `${Math.random() * 60 + 20}%`,
                                            animationDelay: `${i * 0.1}s`
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="relative z-10 w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform duration-300">
                                <Play className="w-8 h-8 text-black ml-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AudioOverview;
