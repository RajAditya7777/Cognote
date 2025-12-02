import { Button } from "@/components/ui/button";
import { Settings, Share2, BarChart2, Plus, LogOut } from "lucide-react";

export default function DashboardHeader({ user }) {
    return (
        <header className="h-16 border-b border-white/10 bg-black flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-black rounded-full" />
                </div>
                <span className="text-white text-lg font-medium">Untitled notebook</span>
            </div>

            <div className="flex items-center gap-3">
                <Button variant="outline" className="bg-white text-black hover:bg-gray-200 rounded-full h-9 px-4 text-sm font-medium border-none">
                    <Plus className="w-4 h-4 mr-2" />
                    Create notebook
                </Button>

                <div className="h-6 w-[1px] bg-white/20 mx-1" />

                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-9 px-3 text-sm font-medium">
                    <BarChart2 className="w-4 h-4 mr-2" />
                    Analytics
                </Button>
                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-9 px-3 text-sm font-medium">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                </Button>
                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-9 w-9 p-0">
                    <Settings className="w-5 h-5" />
                </Button>

                <Button
                    variant="ghost"
                    className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-9 w-9 p-0 ml-1"
                    onClick={() => {
                        document.cookie = 'token=; path=/; max-age=0; SameSite=Strict';
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/';
                    }}
                    title="Logout"
                >
                    <LogOut className="w-5 h-5" />
                </Button>

                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium ml-2 cursor-pointer">
                    {user?.name?.[0] || user?.email?.[0] || 'A'}
                </div>
            </div>
        </header>
    );
}
