import React from 'react';
import { X, History, Trash2, ArrowRight, Clock, FileText, HelpCircle, BookOpen } from 'lucide-react';
import { StudySession } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: StudySession[];
  onSelectSession: (session: StudySession) => void;
  onDeleteSession: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  sessions,
  onSelectSession,
  onDeleteSession,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full shadow-2xl border-l-2 border-slate-900 dark:border-slate-800 p-6 flex flex-col justify-between overflow-hidden">
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-slate-100">
                SAVED SESSIONS ({sessions.length})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-300 dark:border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-2">
            Revisit saved study materials and practice quizzes.
          </p>

          {/* Session List */}
          <div className="mt-4 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
            {sessions.length === 0 ? (
              <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-bold uppercase tracking-wider">No saved study sessions yet.</p>
                <p className="text-[10px] font-mono mt-1 text-slate-400">
                  Generate summaries or MCQs to save them automatically.
                </p>
              </div>
            ) : (
              sessions.map((s) => (
                <div
                  key={s.id}
                  className="bg-slate-50 dark:bg-slate-950 p-4 border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-600 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-slate-100 line-clamp-1">
                        {s.title || 'UNTITLED SESSION'}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(s.id);
                        }}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                        title="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                      {s.snippet}
                    </p>

                    {/* Features Badges */}
                    <div className="flex items-center gap-1.5 mb-3">
                      {s.summary && (
                        <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest bg-indigo-600 text-white">
                          <FileText className="w-3 h-3 mr-0.5" /> SUMMARY
                        </span>
                      )}
                      {s.mcqs && s.mcqs.length > 0 && (
                        <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest bg-emerald-600 text-white">
                          <HelpCircle className="w-3 h-3 mr-0.5" /> 5 MCQS
                        </span>
                      )}
                      {s.vocabulary && s.vocabulary.length > 0 && (
                        <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest bg-amber-500 text-black">
                          <BookOpen className="w-3 h-3 mr-0.5" /> VOCAB
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(s.timestamp).toLocaleDateString()}
                    </span>

                    <button
                      onClick={() => {
                        onSelectSession(s);
                        onClose();
                      }}
                      className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      LOAD SESSION <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Clear All Footer */}
        {sessions.length > 0 && (
          <div className="pt-4 border-t-2 border-slate-200 dark:border-slate-800">
            <button
              onClick={onClearAll}
              className="w-full py-2.5 text-xs font-black uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-slate-950 hover:bg-red-100 dark:hover:bg-red-950/60 transition-all border-2 border-red-300 dark:border-red-900 flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> CLEAR ALL HISTORY
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
