import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  HelpCircle,
  BookOpen,
  Zap,
  Sparkles,
  ArrowDown,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { Header } from './components/Header';
import { NotesInput } from './components/NotesInput';
import { SummaryView } from './components/SummaryView';
import { MCQView } from './components/MCQView';
import { VocabularyView } from './components/VocabularyView';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorAlert } from './components/ErrorAlert';
import { DeployGuideModal } from './components/DeployGuideModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import {
  SummaryResult,
  MCQItem,
  VocabItem,
  StudySession,
  ActiveTab,
} from './types';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('studymate_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Main input state
  const [notes, setNotes] = useState<string>('');

  // Results state
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [mcqs, setMcqs] = useState<MCQItem[] | null>(null);
  const [vocabulary, setVocabulary] = useState<VocabItem[] | null>(null);

  // Active view tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('notes');

  // Async states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeProcessingType, setActiveProcessingType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modals and Drawers
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [deployModalOpen, setDeployModalOpen] = useState<boolean>(false);

  // Saved history in localStorage
  const [history, setHistory] = useState<StudySession[]>(() => {
    try {
      const saved = localStorage.getItem('studymate_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const resultsRef = useRef<HTMLDivElement>(null);

  // Dark mode side effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('studymate_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('studymate_theme', 'light');
    }
  }, [darkMode]);

  // Persist history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('studymate_history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  }, [history]);

  // Helper to save current session to history
  const saveSessionToHistory = (
    sumData?: SummaryResult,
    mcqData?: MCQItem[],
    vocabData?: VocabItem[]
  ) => {
    if (!notes.trim()) return;

    const sessionTitle =
      sumData?.title ||
      notes.trim().split('\n')[0].replace(/[^a-zA-Z0-9 ]/g, '').slice(0, 40) ||
      'Study Notes Session';

    const newSession: StudySession = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      title: sessionTitle,
      snippet: notes.slice(0, 120) + '...',
      notes: notes,
      summary: sumData || summary || undefined,
      mcqs: mcqData || mcqs || undefined,
      vocabulary: vocabData || vocabulary || undefined,
    };

    setHistory((prev) => [newSession, ...prev.filter((item) => item.id !== newSession.id)].slice(0, 20));
  };

  const scrollToResults = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  // API Call: Summarize
  const handleGenerateSummary = async () => {
    if (!notes.trim()) return;
    setIsLoading(true);
    setActiveProcessingType('summary');
    setError(null);

    try {
      const res = await fetch('/api/study/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate summary.');
      }

      setSummary(data);
      setActiveTab('summary');
      saveSessionToHistory(data, undefined, undefined);
      scrollToResults();
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
      setActiveProcessingType(null);
    }
  };

  // API Call: MCQs
  const handleGenerateMCQs = async () => {
    if (!notes.trim()) return;
    setIsLoading(true);
    setActiveProcessingType('mcqs');
    setError(null);

    try {
      const res = await fetch('/api/study/mcqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate MCQs.');
      }

      setMcqs(data.questions);
      setActiveTab('mcqs');
      saveSessionToHistory(undefined, data.questions, undefined);
      scrollToResults();
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
      setActiveProcessingType(null);
    }
  };

  // API Call: Vocabulary
  const handleExplainVocabulary = async () => {
    if (!notes.trim()) return;
    setIsLoading(true);
    setActiveProcessingType('vocabulary');
    setError(null);

    try {
      const res = await fetch('/api/study/vocabulary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to explain vocabulary.');
      }

      setVocabulary(data.vocabulary);
      setActiveTab('vocabulary');
      saveSessionToHistory(undefined, undefined, data.vocabulary);
      scrollToResults();
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
      setActiveProcessingType(null);
    }
  };

  // API Call: Process All
  const handleProcessAll = async () => {
    if (!notes.trim()) return;
    setIsLoading(true);
    setActiveProcessingType('all');
    setError(null);

    try {
      const res = await fetch('/api/study/process-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process study materials.');
      }

      setSummary(data.summary);
      setMcqs(data.mcqs);
      setVocabulary(data.vocabulary);
      setActiveTab('summary');
      saveSessionToHistory(data.summary, data.mcqs, data.vocabulary);
      scrollToResults();
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
      setActiveProcessingType(null);
    }
  };

  // Load selected history item
  const handleSelectSession = (session: StudySession) => {
    setNotes(session.notes);
    if (session.summary) setSummary(session.summary);
    if (session.mcqs) setMcqs(session.mcqs);
    if (session.vocabulary) setVocabulary(session.vocabulary);

    if (session.summary) setActiveTab('summary');
    else if (session.mcqs) setActiveTab('mcqs');
    else if (session.vocabulary) setActiveTab('vocabulary');

    scrollToResults();
  };

  const handleDeleteSession = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllHistory = () => {
    setHistory([]);
  };

  const hasAnyResults = Boolean(summary || mcqs || vocabulary);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Watermark */}
      <div className="absolute -top-12 -left-10 text-[16rem] sm:text-[22rem] font-black text-slate-300/40 dark:text-slate-900/60 leading-none select-none pointer-events-none z-0">
        STUDY
      </div>

      {/* Header Bar */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenDeployModal={() => setDeployModalOpen(true)}
        savedCount={history.length}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Welcome Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white border border-indigo-700">
            <GraduationCap className="w-4 h-4 text-yellow-300" />
            <span>KNOWLEDGE COMPRESSION ENGINE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase text-slate-900 dark:text-slate-50 leading-none">
            STUDY SMARTER. <span className="text-indigo-600 dark:text-indigo-500">LEARN FASTER.</span>
          </h1>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Compress long lecture notes into key summaries, 5 exam MCQs, and simplified jargon in seconds.
          </p>
        </div>

        {/* Input Section */}
        <NotesInput
          notes={notes}
          setNotes={setNotes}
          isLoading={isLoading}
          activeProcessingType={activeProcessingType}
          onGenerateSummary={handleGenerateSummary}
          onGenerateMCQs={handleGenerateMCQs}
          onExplainVocabulary={handleExplainVocabulary}
          onProcessAll={handleProcessAll}
        />

        {/* Error Alert Display */}
        {error && (
          <ErrorAlert
            message={error}
            onRetry={() => {
              if (activeProcessingType === 'summary') handleGenerateSummary();
              else if (activeProcessingType === 'mcqs') handleGenerateMCQs();
              else if (activeProcessingType === 'vocabulary') handleExplainVocabulary();
              else handleProcessAll();
            }}
          />
        )}

        {/* Loading Skeleton */}
        {isLoading && <LoadingSkeleton type={activeProcessingType} />}

        {/* Results Container */}
        {!isLoading && hasAnyResults && (
          <div ref={resultsRef} className="space-y-6 pt-4">
            {/* View Switching Tabs */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 dark:border-slate-800 pb-3 overflow-x-auto gap-2">
              <div className="flex items-center space-x-2">
                {summary && (
                  <button
                    onClick={() => setActiveTab('summary')}
                    className={`px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer border-2 ${
                      activeTab === 'summary'
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-800 hover:border-indigo-500'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Summary</span>
                  </button>
                )}

                {mcqs && mcqs.length > 0 && (
                  <button
                    onClick={() => setActiveTab('mcqs')}
                    className={`px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer border-2 ${
                      activeTab === 'mcqs'
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-800 hover:border-emerald-500'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>5 Practice MCQs</span>
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-black text-white">
                      {mcqs.length}
                    </span>
                  </button>
                )}

                {vocabulary && vocabulary.length > 0 && (
                  <button
                    onClick={() => setActiveTab('vocabulary')}
                    className={`px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer border-2 ${
                      activeTab === 'vocabulary'
                        ? 'bg-amber-500 text-black border-amber-600 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-800 hover:border-amber-500'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Vocabulary ({vocabulary.length})</span>
                  </button>
                )}
              </div>

              {/* Show All Toggle if multiple results exist */}
              {((summary && mcqs) || (summary && vocabulary) || (mcqs && vocabulary)) && (
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-2 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-1.5 border-2 ${
                    activeTab === 'all'
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-black dark:border-white'
                      : 'text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:border-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Show All Views</span>
                </button>
              )}
            </div>

            {/* Active Tab View */}
            {activeTab === 'summary' && summary && <SummaryView summary={summary} />}
            {activeTab === 'mcqs' && mcqs && <MCQView mcqs={mcqs} />}
            {activeTab === 'vocabulary' && vocabulary && (
              <VocabularyView vocabulary={vocabulary} />
            )}

            {/* Combined View when 'all' tab selected */}
            {activeTab === 'all' && (
              <div className="space-y-8">
                {summary && <SummaryView summary={summary} />}
                {mcqs && mcqs.length > 0 && <MCQView mcqs={mcqs} />}
                {vocabulary && vocabulary.length > 0 && (
                  <VocabularyView vocabulary={vocabulary} />
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer / Status Bar */}
      <footer className="relative z-10 border-t-2 border-slate-900 dark:border-slate-800 bg-slate-950 text-slate-400 py-4 px-6 sm:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono font-bold uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-slate-300">GEMINI 3.6 CONNECTED</span>
            </div>
            <div className="h-3 w-px bg-slate-800 hidden sm:block"></div>
            <span className="text-slate-500 hidden md:block">KNOWLEDGE COMPRESSION ENGINE V2.4</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-500">PRO PLAN</span>
            <span className="px-2 py-0.5 bg-indigo-600 text-white font-black text-[9px]">STUDYMATE AI</span>
          </div>
        </div>
      </footer>

      {/* Deploy Guide Modal */}
      <DeployGuideModal
        isOpen={deployModalOpen}
        onClose={() => setDeployModalOpen(false)}
      />

      {/* Saved History Drawer */}
      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        sessions={history}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onClearAll={handleClearAllHistory}
      />
    </div>
  );
}
