'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from './_components/DashboardHeader';
import SidebarLeft from './_components/SidebarLeft';
import SidebarRight from './_components/SidebarRight';
import MainContent from './_components/MainContent';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        router.push('/auth');
      } else {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.error("Error parsing user data", e);
        }
        setLoading(false);
      }
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden font-sans">
      <DashboardHeader user={user} />
      <div className="flex-1 flex overflow-hidden">
        <SidebarLeft />
        <MainContent />
        <SidebarRight />
      </div>
    </div>
  );
}