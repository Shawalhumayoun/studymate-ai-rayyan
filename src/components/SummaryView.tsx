import React, { useState } from 'react';
import { FileText, Copy, Check, Clock, CheckCircle2, BookmarkCheck } from 'lucide-react';
import { SummaryResult } from '../types';

interface SummaryViewProps {
  summary: SummaryResult;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ summary }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const formattedText = `# ${summary.title}
Read Time: ~${summary.estimatedReadTimeMinutes} min

## Key Takeaways
${summary.keyTakeaways.map((point) => `• ${point}`).join('\n')}

## Summary
${summary.detailedSummary}
`;
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-800 p-6 sm:p-8 transition-colors duration-200">
      {/* Header & Copy Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b-2 border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-slate-800 px-2 py-0.5 border border-emerald-200 dark:border-emerald-900">
              AI Generated Output
            </span>
            <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-indigo-500" />
              READ TIME ~{summary.estimatedReadTimeMinutes || 2} MIN
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 uppercase leading-none underline decoration-4 decoration-indigo-500 underline-offset-4 mt-2">
            {summary.title || 'SUMMARY KEYPOINTS'}
          </h2>
        </div>

        {/* Copy Button */}
        <button
          id="copy-summary-btn"
          onClick={handleCopy}
          className="self-start sm:self-auto text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 border-2 border-slate-900 dark:border-slate-700 px-3.5 py-2 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">COPIED!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>COPY RESULT</span>
            </>
          )}
        </button>
      </div>

      {/* Key Takeaways Section */}
      <div className="mb-6 bg-slate-50 dark:bg-slate-950 p-5 border-l-4 border-indigo-600 dark:border-indigo-500 border-y border-r border-slate-200 dark:border-slate-800">
        <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-4">
          <BookmarkCheck className="w-4 h-4" />
          KEY TAKEAWAYS
        </h3>
        <div className="space-y-3">
          {summary.keyTakeaways.map((point, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <span className="text-indigo-600 dark:text-indigo-400 font-black text-lg italic shrink-0 leading-none">
                {String(idx + 1).padStart(2, '0')}.
              </span>
              <p className="text-slate-900 dark:text-slate-100 text-sm font-bold uppercase leading-tight">
                {point}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Summary */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">
          Detailed Explanation
        </h3>
        <div className="text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line space-y-3 bg-slate-50/50 dark:bg-slate-950/50 p-4 border border-slate-200 dark:border-slate-800">
          {summary.detailedSummary}
        </div>
      </div>
    </div>
  );
};
