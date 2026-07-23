import React from 'react';
import {
  FileText,
  Sparkles,
  HelpCircle,
  BookOpen,
  X,
  Brain,
  Leaf,
  Cpu,
  Globe,
  Zap,
} from 'lucide-react';
import { SAMPLE_NOTES, SampleNote } from '../data/sampleNotes';

interface NotesInputProps {
  notes: string;
  setNotes: (value: string) => void;
  isLoading: boolean;
  activeProcessingType: string | null;
  onGenerateSummary: () => void;
  onGenerateMCQs: () => void;
  onExplainVocabulary: () => void;
  onProcessAll: () => void;
}

export const NotesInput: React.FC<NotesInputProps> = ({
  notes,
  setNotes,
  isLoading,
  activeProcessingType,
  onGenerateSummary,
  onGenerateMCQs,
  onExplainVocabulary,
  onProcessAll,
}) => {
  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;
  const charCount = notes.length;

  const getSampleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain':
        return <Brain className="w-3.5 h-3.5 text-purple-500" />;
      case 'Leaf':
        return <Leaf className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Cpu':
        return <Cpu className="w-3.5 h-3.5 text-cyan-500" />;
      case 'Globe':
        return <Globe className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <BookOpen className="w-3.5 h-3.5 text-indigo-500" />;
    }
  };

  const handleSelectSample = (sample: SampleNote) => {
    setNotes(sample.notes);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-800 p-5 sm:p-6 transition-colors duration-200">
      {/* Top Title & Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-800 px-2 py-0.5 border border-indigo-200 dark:border-indigo-900">
              Source Material
            </span>
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2 mt-1">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Paste Study Notes Below
          </h2>
        </div>

        {/* Clear Button */}
        {notes && (
          <button
            id="clear-notes-btn"
            onClick={() => setNotes('')}
            disabled={isLoading}
            className="self-start sm:self-auto text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 border border-slate-300 dark:border-slate-800 px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Clear Text
          </button>
        )}
      </div>

      {/* Preset Quick Fill Pills */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Sample Topics:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_NOTES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all cursor-pointer disabled:opacity-50"
            >
              {getSampleIcon(sample.iconName)}
              <span>{sample.topic}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          id="study-notes-textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={isLoading}
          placeholder="Paste lecture notes, textbook chapters, or exam study material here..."
          className="w-full h-48 sm:h-56 p-4 text-sm leading-relaxed bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition-all resize-none font-sans"
        />

        {/* Word and Character Count Counter */}
        <div className="absolute bottom-3 right-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-white/90 dark:bg-slate-900/90 px-2 py-1 border border-slate-300 dark:border-slate-800">
          {wordCount} WORDS | {charCount} CHARS
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Process All */}
        <button
          id="process-all-btn"
          onClick={onProcessAll}
          disabled={isLoading || !notes.trim()}
          className="w-full sm:col-span-2 lg:col-span-1 px-4 py-3.5 font-black text-xs uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 border-2 border-indigo-700 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
          <span>
            {isLoading && activeProcessingType === 'all'
              ? 'PROCESSING ALL...'
              : '⚡ PROCESS ALL NOTES'}
          </span>
        </button>

        {/* Generate Summary */}
        <button
          id="generate-summary-btn"
          onClick={onGenerateSummary}
          disabled={isLoading || !notes.trim()}
          className="w-full px-4 py-3.5 font-black text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 border-2 border-slate-300 dark:border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>
            {isLoading && activeProcessingType === 'summary'
              ? 'SUMMARIZING...'
              : 'SUMMARY'}
          </span>
        </button>

        {/* Generate 5 MCQs */}
        <button
          id="generate-mcqs-btn"
          onClick={onGenerateMCQs}
          disabled={isLoading || !notes.trim()}
          className="w-full px-4 py-3.5 font-black text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 border-2 border-slate-300 dark:border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>
            {isLoading && activeProcessingType === 'mcqs'
              ? 'CREATING MCQS...'
              : '5X MCQS'}
          </span>
        </button>

        {/* Explain Difficult Words */}
        <button
          id="explain-words-btn"
          onClick={onExplainVocabulary}
          disabled={isLoading || !notes.trim()}
          className="w-full px-4 py-3.5 font-black text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 border-2 border-slate-300 dark:border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>
            {isLoading && activeProcessingType === 'vocabulary'
              ? 'EXPLAINING...'
              : 'EXPLAIN WORDS'}
          </span>
        </button>
      </div>
    </div>
  );
};
