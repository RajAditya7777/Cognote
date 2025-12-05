"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, User, Mail, AtSign, Sparkles } from "lucide-react";
import Link from "next/link";
import API_URL from '@/config/api';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        customPrompt: ""
    });

    useEffect(() => {
        // Fetch user data
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            fetchProfile(parsedUser.id);
        }
    }, []);

    const fetchProfile = async (userId) => {
        try {
            const res = await fetch(`${API_URL}/api/user/settings/${userId}`);
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    name: data.name || "",
                    username: data.username || "",
                    customPrompt: data.customPrompt || ""
                });
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        try {
            const res = await fetch(`${API_URL}/api/user/settings/profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    ...formData
                })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Profile updated successfully!");
                // Update local storage if name changed
                const updatedUser = { ...user, name: formData.name };
                localStorage.setItem("user", JSON.stringify(updatedUser));
            } else {
                setMessage(data.error || "Failed to update profile");
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
            setMessage("An error occurred");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <div className="max-w-2xl mx-auto p-6">
                <div className="mb-8">
                    <Link href="/dashboard" className="inline-flex items-center text-white/50 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold">Profile Settings</h1>
                    <p className="text-white/50 mt-2">Manage your account details and AI preferences.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Info Section */}
                    <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-400" />
                            Personal Information
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-white/50 uppercase tracking-wider font-medium mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                                        placeholder="Enter your name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-white/50 uppercase tracking-wider font-medium mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                                        placeholder="Choose a username"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-white/50 uppercase tracking-wider font-medium mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <input
                                        type="email"
                                        value={user?.email || ""}
                                        disabled
                                        className="w-full bg-black/30 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white/50 text-sm cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-white/20 text-xs mt-2">Email cannot be changed.</p>
                            </div>
                        </div>
                    </div>



                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-4">
                        <p className={`text-sm ${message.includes("success") ? "text-green-400" : "text-red-400"}`}>
                            {message}
                        </p>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-white text-black hover:bg-white/90 font-medium py-3 px-8 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
