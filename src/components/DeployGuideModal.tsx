import React, { useState } from 'react';
import { X, Github, ExternalLink, Copy, Check, Terminal, ShieldCheck } from 'lucide-react';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const envCode = `GEMINI_API_KEY=your_gemini_api_key_here`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(envCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 shadow-2xl border-2 border-slate-900 dark:border-slate-800 max-w-lg w-full p-6 sm:p-8 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-300 dark:border-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 border-b-2 border-slate-200 dark:border-slate-800 pb-4">
          <div className="p-2.5 bg-emerald-600 text-white shrink-0 border border-emerald-800">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100">
              DEPLOYMENT GUIDE
            </h3>
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Host StudyMate AI on GitHub & Vercel in 3 steps
            </p>
          </div>
        </div>

        {/* Step 1: Export / GitHub */}
        <div className="space-y-4 text-xs text-slate-800 dark:text-slate-200">
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800">
            <h4 className="font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
              <span className="w-5 h-5 bg-indigo-600 text-white flex items-center justify-center text-[11px] font-black">
                1
              </span>
              Export or Push to GitHub
            </h4>
            <p className="text-slate-600 dark:text-slate-400 pl-7 leading-relaxed font-medium">
              Use AI Studio's <strong>Settings &gt; Export to GitHub</strong> or download the project ZIP and commit it to a new GitHub repository.
            </p>
          </div>

          {/* Step 2: Vercel */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800">
            <h4 className="font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
              <span className="w-5 h-5 bg-indigo-600 text-white flex items-center justify-center text-[11px] font-black">
                2
              </span>
              Connect to Vercel
            </h4>
            <p className="text-slate-600 dark:text-slate-400 pl-7 leading-relaxed font-medium">
              Import your repository in Vercel. Select <strong>Vite</strong> framework preset.
            </p>
          </div>

          {/* Step 3: API Key */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="w-5 h-5 bg-indigo-600 text-white flex items-center justify-center text-[11px] font-black">
                  3
                </span>
                Add Environment Variable
              </h4>
              <button
                onClick={handleCopyEnv}
                className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 flex items-center gap-1 hover:bg-slate-800"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                Copy Env
              </button>
            </div>
            <p className="text-slate-600 dark:text-slate-400 pl-7 leading-relaxed font-medium mb-2">
              In Vercel Settings &gt; Environment Variables, add:
            </p>
            <div className="pl-7">
              <code className="block p-2.5 bg-slate-950 text-indigo-400 font-mono text-[11px] border border-slate-800">
                {envCode}
              </code>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t-2 border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-700 border-2 border-indigo-800 transition-all"
          >
            GOT IT!
          </button>
        </div>
      </div>
    </div>
  );
};
