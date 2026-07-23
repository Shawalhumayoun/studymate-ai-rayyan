import React from 'react';
import { Sparkles, Moon, Sun, History, Github, Share2, BookOpen } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean | ((prev: boolean) => boolean)) => void;
  onOpenHistory: () => void;
  onOpenDeployModal: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  onOpenHistory,
  onOpenDeployModal,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-600 text-white flex items-center justify-center font-black">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl sm:text-3xl font-black tracking-tighter text-slate-900 dark:text-slate-50 uppercase">
                STUDYMATE <span className="text-indigo-600 dark:text-indigo-500">AI.</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-indigo-50 dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/80">
                <Sparkles className="w-3 h-3 mr-1 text-indigo-500 animate-pulse" />
                Gemini 3.6
              </span>
            </div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 hidden md:block mt-0.5">
              Knowledge Compression Engine v2.4
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Saved History Button */}
          <button
            id="history-toggle-btn"
            onClick={onOpenHistory}
            className="relative px-3 py-2 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center space-x-1.5 border border-slate-300 dark:border-slate-800"
            title="Saved Sessions"
          >
            <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">History</span>
            {savedCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-black text-white bg-indigo-600 dark:bg-indigo-500 ml-1">
                {savedCount}
              </span>
            )}
          </button>

          {/* Vercel & GitHub Deploy Info */}
          <button
            id="deploy-guide-btn"
            onClick={onOpenDeployModal}
            className="px-3 py-2 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center space-x-1.5 border border-slate-300 dark:border-slate-800"
            title="Deploy to Vercel & GitHub"
          >
            <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden md:inline">Deploy Guide</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            id="dark-mode-btn"
            onClick={() => setDarkMode((prev) => !prev)}
            className="p-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-300 dark:border-slate-800"
            aria-label="Toggle Dark Mode"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
