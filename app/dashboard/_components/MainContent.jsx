import { Button } from "@/components/ui/button";
import { Upload, ArrowRight, SlidersHorizontal } from "lucide-react";

export default function MainContent() {
    return (
        <div className="flex-1 flex flex-col h-full bg-black relative border-x border-white/10">
            {/* Chat Header */}
            <div className="p-4 flex items-center justify-between">
                <h2 className="text-white/90 font-medium">Chat</h2>
                <SlidersHorizontal className="text-white/50 w-5 h-5" />
            </div>

            {/* Center Content */}
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mb-6">
                    <Upload className="w-6 h-6 text-blue-400" />
                </div>
                <h1 className="text-3xl text-white/90 font-normal mb-8">Add a source to get started</h1>
                <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/5 rounded-full px-8 py-6 h-auto text-base font-medium">
                    Upload a source
                </Button>
            </div>

            {/* Input Area */}
            <div className="p-6 pb-8 max-w-4xl mx-auto w-full">
                <div className="bg-white/5 rounded-full p-2 pl-6 flex items-center border border-white/10 h-16">
                    <input
                        type="text"
                        placeholder="Upload a source to get started"
                        className="bg-transparent text-white placeholder:text-white/30 flex-1 outline-none text-lg"
                        disabled
                    />
                    <span className="text-white/30 text-sm mr-4">0 sources</span>
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/30">
                        <ArrowRight className="w-6 h-6" />
                    </div>
                </div>
                <p className="text-center text-white/30 text-xs mt-3">
                    NotebookLM can be inaccurate; please double check its responses.
                </p>
            </div>
        </div>
    );
}
