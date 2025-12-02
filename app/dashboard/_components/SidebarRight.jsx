import { Layers, FileText, HelpCircle, LayoutGrid } from "lucide-react";

export default function SidebarRight() {
    const features = [
        { icon: Layers, label: "Flashcards" },
        { icon: FileText, label: "Summary" },
        { icon: HelpCircle, label: "Quiz" },
    ];

    return (
        <div className="w-80 border-l border-white/10 bg-black flex flex-col h-full shrink-0">
            <div className="p-4 flex items-center justify-between">
                <h2 className="text-white/90 font-medium">Studio</h2>
                <LayoutGrid className="text-white/50 w-5 h-5" />
            </div>

            <div className="px-4 grid grid-cols-2 gap-3">
                {features.map((feature, idx) => (
                    <div key={idx} className="bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-4 cursor-pointer flex flex-col justify-between h-24">
                        <feature.icon className="w-5 h-5 text-white/70" />
                        <span className="text-white/90 text-sm font-medium">{feature.label}</span>
                    </div>
                ))}
            </div>

            <div className="mt-auto p-8 text-center">
                <div className="w-8 h-8 mx-auto mb-3 text-white/30">
                    <LayoutGrid className="w-full h-full" />
                </div>
                <p className="text-white/70 text-sm font-medium mb-1">Studio output will be saved here.</p>
                <p className="text-white/40 text-xs">
                    After adding sources, click to add Audio Overview, Study Guide, Mind Map, and more!
                </p>
            </div>
        </div>
    );
}
