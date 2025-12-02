import React from 'react';
import { Lock } from 'lucide-react';

const Privacy = () => {
    return (
        <section className="py-24 bg-black text-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-8">
                    <Lock className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-4xl md:text-5xl font-medium leading-tight mb-6">
                    Your data stays yours
                </h2>
                <p className="text-xl text-gray-400 leading-relaxed">
                    NotebookLM never trains on your personal data. Your sources are private to you and the people you choose to share them with.
                </p>
            </div>
        </section>
    );
};

export default Privacy;
