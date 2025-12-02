import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";

export default function SidebarLeft() {
    return (
        <div className="w-80 border-r border-white/10 bg-black flex flex-col h-full shrink-0">
            <div className="p-4 flex items-center justify-between">
                <h2 className="text-white/90 font-medium">Sources</h2>
                <FileText className="text-white/50 w-5 h-5" />
            </div>

            <div className="px-4">
                <Button variant="outline" className="w-full bg-transparent border-white/20 text-white hover:bg-white/5 justify-center py-6 rounded-full">
                    <Plus className="w-5 h-5 mr-2" />
                    Add sources
                </Button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <FileText className="w-12 h-12 text-white/20 mb-4" />
                <p className="text-white/70 text-sm mb-1">Saved sources will appear here</p>
                <p className="text-white/40 text-xs max-w-[240px]">
                    Click Add source above to add PDFs, websites, text, videos, or audio files. Or import a file directly from Google Drive.
                </p>
            </div>
        </div>
    );
}
