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
  const [files, setFiles] = useState([]);
  const [notes, setNotes] = useState([]);

  const fetchUserData = async (userId) => {
    try {
      const res = await fetch('http://localhost:4000/api/user/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
        setNotes(data.notes || []);
      }
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        router.push('/auth');
      } else {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          fetchUserData(parsedUser.id);
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
        <SidebarLeft files={files} onUploadSuccess={() => user && fetchUserData(user.id)} userId={user?.id} />
        <MainContent files={files} onUploadSuccess={() => user && fetchUserData(user.id)} userId={user?.id} />
        <SidebarRight />
      </div>
    </div>
  );
}