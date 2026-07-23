import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, BookOpen, FileText } from 'lucide-react';

interface LoadingSkeletonProps {
  type: string | null;
}

const QUOTES = [
  "Reading and structuring your study notes...",
  "Distilling complex concepts into key exam takeaways...",
  "Drafting 5 practice multiple-choice questions...",
  "Simplifying academic jargon into plain English...",
  "Synthesizing detailed explanations...",
  "Finalizing your AI study assistant package...",
];

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type }) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const getTitle = () => {
    switch (type) {
      case 'summary':
        return 'GENERATING CONCISE SUMMARY...';
      case 'mcqs':
        return 'GENERATING 5 PRACTICE MCQS...';
      case 'vocabulary':
        return 'EXPLAINING HARD WORDS...';
      case 'all':
      default:
        return 'PROCESSING STUDY PACKAGE...';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-800 p-6 sm:p-8 transition-colors duration-200">
      <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-6">
        {/* Animated Icon Ring */}
        <div className="relative mb-5">
          <div className="w-16 h-16 bg-indigo-600 text-white flex items-center justify-center font-black animate-bounce border-2 border-slate-900 shadow-sm">
            <Brain className="w-8 h-8" />
          </div>
          <div className="absolute -top-1 -right-1 p-1 bg-amber-400 text-black border border-black animate-pulse">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100 mb-2">
          {getTitle()}
        </h3>

        {/* Rotating Progress Quote */}
        <p className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-6 h-5 transition-all duration-300">
          {QUOTES[quoteIndex]}
        </p>

        {/* Progress bar animation */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 border border-slate-300 dark:border-slate-800 overflow-hidden mb-8">
          <div className="bg-indigo-600 h-full w-full animate-pulse" />
        </div>

        {/* Skeleton cards preview */}
        <div className="w-full space-y-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 w-3/4 animate-pulse" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 w-full animate-pulse" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 w-5/6 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
