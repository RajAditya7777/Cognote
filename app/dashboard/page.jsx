'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from './_components/DashboardHeader';
import SidebarLeft from './_components/SidebarLeft';
import SidebarRight from './_components/SidebarRight';
import MainContent from './_components/MainContent';
import API_URL from '@/config/api';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [notes, setNotes] = useState([]);
  const [currentNotebook, setCurrentNotebook] = useState(null);
  const [selectedFileIds, setSelectedFileIds] = useState([]);

  const toggleFileSelection = (fileId) => {
    setSelectedFileIds(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const [suggestedAction, setSuggestedAction] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [isQuizGenerating, setIsQuizGenerating] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const [flashcardsData, setFlashcardsData] = useState(null);
  const [isFlashcardsGenerating, setIsFlashcardsGenerating] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);

  const [summaryData, setSummaryData] = useState(null);
  const [isSummaryGenerating, setIsSummaryGenerating] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const [sidebarWidth, setSidebarWidth] = useState(320); // Default width 320px
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = (mouseDownEvent) => {
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (mouseMoveEvent) => {
    if (isResizing) {
      const newWidth = window.innerWidth - mouseMoveEvent.clientX;
      if (newWidth > 250 && newWidth < 800) { // Min 250px, Max 800px
        setSidebarWidth(newWidth);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing]);

  const fetchUserData = async (userId, notebookId = null) => {
    try {
      const body = { userId };
      if (notebookId) {
        body.notebookId = notebookId;
      }

      const res = await fetch(`${API_URL}/api/user/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
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

  const fetchOrCreateNotebook = async (userId) => {
    try {
      // Fetch user's notebooks
      const res = await fetch(`${API_URL}/api/notebooks/${userId}`);
      if (res.ok) {
        const notebooks = await res.json();
        if (notebooks.length > 0) {
          // Use the most recent notebook
          setCurrentNotebook(notebooks[0]);
        } else {
          // Create a default notebook
          const createRes = await fetch(`${API_URL}/api/notebooks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, title: 'Untitled Notebook' })
          });
          if (createRes.ok) {
            const newNotebook = await createRes.json();
            setCurrentNotebook(newNotebook);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch/create notebook", error);
    }
  };

  const handleAction = async (action) => {
    // Use selected files if any, otherwise default to the first file
    const targetFileIds = selectedFileIds.length > 0 ? selectedFileIds : (files.length > 0 ? [files[0].id] : []);
    const primaryFileId = targetFileIds.length > 0 ? targetFileIds[0] : null;

    if (!primaryFileId) return;

    if (action === 'quiz') {
      setShowQuiz(true);
      setIsQuizGenerating(true);
      if (sidebarWidth < 400) setSidebarWidth(500);

      try {
        const res = await fetch(`${API_URL}/api/ai/quiz`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileIds: targetFileIds, // Send array of IDs
            fileId: primaryFileId,  // Keep for backward compatibility/saving
            count: 5
          })
        });

        if (res.ok) {
          const data = await res.json();
          setQuizData({
            title: "Generated Quiz",
            questions: data.quiz,
            fileId: primaryFileId
          });
          if (user) fetchUserData(user.id);
        }
      } catch (error) {
        console.error("Failed to generate quiz", error);
      } finally {
        setIsQuizGenerating(false);
      }
    } else if (action === 'flashcards') {
      setShowFlashcards(true);
      setIsFlashcardsGenerating(true);
      if (sidebarWidth < 400) setSidebarWidth(500);

      try {
        const res = await fetch(`${API_URL}/api/ai/flashcards`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileIds: targetFileIds,
            fileId: primaryFileId,
            count: 10
          })
        });

        if (res.ok) {
          const data = await res.json();
          setFlashcardsData(data.flashcards.map(fc => ({ ...fc, fileId: primaryFileId })));
          if (user) fetchUserData(user.id);
        }
      } catch (error) {
        console.error("Failed to generate flashcards", error);
      } finally {
        setIsFlashcardsGenerating(false);
      }
    } else if (action === 'summary') {
      setShowSummary(true);
      setIsSummaryGenerating(true);
      if (sidebarWidth < 400) setSidebarWidth(500);

      try {
        const res = await fetch(`${API_URL}/api/ai/summarize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileIds: targetFileIds,
            fileId: primaryFileId
          })
        });

        if (res.ok) {
          const data = await res.json();
          setSummaryData({ content: data.summary, fileId: primaryFileId });
          if (user) fetchUserData(user.id);
        }
      } catch (error) {
        console.error("Failed to generate summary", error);
      } finally {
        setIsSummaryGenerating(false);
      }
    } else if (action === 'open_quiz') {
      const file = files.find(f => f.id === primaryFileId);
      if (file && file.quiz && file.quiz.length > 0) {
        setQuizData({
          title: file.quiz[0].title || "Generated Quiz",
          questions: file.quiz, // The backend returns an array of questions directly in the quiz relation? No, wait.
          // Prisma returns an array of Quiz objects. My schema has `model Quiz`.
          // `file.quiz` is an array of Quiz records.
          // Wait, my schema says `quiz Quiz[]`.
          // And `Quiz` model has `question`, `options`, `answer`.
          // So `file.quiz` IS the array of questions!
          // Yes, that matches.
          questions: file.quiz,
          fileId: primaryFileId
        });
        setShowQuiz(true);
        if (sidebarWidth < 400) setSidebarWidth(500);
      }
    } else if (action === 'open_flashcards') {
      const file = files.find(f => f.id === primaryFileId);
      if (file && file.flashcards && file.flashcards.length > 0) {
        setFlashcardsData(file.flashcards.map(fc => ({ ...fc, fileId: primaryFileId })));
        setShowFlashcards(true);
        if (sidebarWidth < 400) setSidebarWidth(500);
      }
    } else if (action === 'open_summary') {
      const file = files.find(f => f.id === primaryFileId);
      if (file && file.summary) {
        setSummaryData({ content: file.summary.content, fileId: primaryFileId });
        setShowSummary(true);
        if (sidebarWidth < 400) setSidebarWidth(500);
      }
    } else {
      setSuggestedAction(action);
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
          fetchOrCreateNotebook(parsedUser.id);
        } catch (e) {
          console.error("Error parsing user data", e);
        }
        setLoading(false);
      }
    }
  }, [router]);

  // Refetch data when notebook changes
  useEffect(() => {
    if (user && currentNotebook) {
      fetchUserData(user.id, currentNotebook.id);
    }
  }, [currentNotebook]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden font-sans">
      <DashboardHeader
        user={user}
        notebook={currentNotebook}
        onNotebookUpdate={(updatedNotebook) => setCurrentNotebook(updatedNotebook)}
      />
      <div className="flex-1 flex overflow-hidden">
        <SidebarLeft
          files={files}
          onUploadSuccess={() => user && currentNotebook && fetchUserData(user.id, currentNotebook.id)}
          userId={user?.id}
          notebookId={currentNotebook?.id}
          selectedFileIds={selectedFileIds}
          onToggleFile={toggleFileSelection}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex min-w-0 overflow-hidden">
          <MainContent
            files={files}
            selectedFileIds={selectedFileIds}
            onUploadSuccess={() => user && currentNotebook && fetchUserData(user.id, currentNotebook.id)}
            userId={user?.id}
            notebookId={currentNotebook?.id}
            suggestedAction={suggestedAction}
            onActionComplete={() => setSuggestedAction(null)}
          />
        </div>

        {/* Resizer Handle */}
        <div
          className={`w-1 bg-white/10 hover:bg-blue-500 cursor-col-resize transition-colors z-50 flex items-center justify-center group ${isResizing ? 'bg-blue-500' : ''}`}
          onMouseDown={startResizing}
        >
          <div className="h-8 w-1 bg-white/20 rounded-full group-hover:bg-white/50" />
        </div>

        {/* Right Sidebar */}
        <div style={{ width: sidebarWidth }} className="shrink-0 flex flex-col h-full bg-black border-l border-white/10">
          <SidebarRight
            onAction={handleAction}
            quizData={quizData}
            isQuizGenerating={isQuizGenerating}
            showQuiz={showQuiz}
            onCloseQuiz={() => setShowQuiz(false)}
            flashcardsData={flashcardsData}
            isFlashcardsGenerating={isFlashcardsGenerating}
            showFlashcards={showFlashcards}
            onCloseFlashcards={() => setShowFlashcards(false)}
            summaryData={summaryData}
            isSummaryGenerating={isSummaryGenerating}
            showSummary={showSummary}
            onCloseSummary={() => setShowSummary(false)}
            files={files}
            onDeleteContent={async (type, id) => {
              try {
                let endpoint = `${API_URL}/api/delete/${type}/${id}`;

                // Handle bulk delete
                if (type === 'quiz_all') {
                  endpoint = `${API_URL}/api/delete/quiz/file/${id}`;
                } else if (type === 'flashcards_all') {
                  endpoint = `${API_URL}/api/delete/flashcards/file/${id}`;
                } else if (type === 'quiz_set') {
                  endpoint = `${API_URL}/api/delete/quiz/set/${id}`;
                } else if (type === 'flashcards_set') {
                  endpoint = `${API_URL}/api/delete/flashcards/set/${id}`;
                }

                const res = await fetch(endpoint, {
                  method: 'DELETE'
                });
                if (res.ok) {
                  // Refresh data
                  if (user) fetchUserData(user.id);
                  // Close panel if open
                  if (type.includes('quiz')) setShowQuiz(false);
                  if (type.includes('flashcards')) setShowFlashcards(false);
                  if (type === 'summary') setShowSummary(false);
                }
              } catch (error) {
                console.error("Delete failed", error);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}