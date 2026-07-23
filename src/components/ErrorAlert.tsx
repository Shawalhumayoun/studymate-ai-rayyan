import React from 'react';
import { AlertTriangle, RefreshCw, KeyRound } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onRetry: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onRetry }) => {
  const isKeyError = message.toLowerCase().includes('gemini_api_key') || message.toLowerCase().includes('key');

  return (
    <div className="bg-red-50 dark:bg-red-950/60 border-2 border-red-600 dark:border-red-900 p-5 sm:p-6 transition-colors duration-200">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 bg-red-600 text-white shrink-0 border border-red-800">
          <AlertTriangle className="w-5 h-5" />
        </div>

        <div className="flex-1">
          <h3 className="text-base font-black uppercase tracking-tight text-red-900 dark:text-red-100">
            GENERATION FAILED
          </h3>
          <p className="text-xs font-medium text-red-800 dark:text-red-200 mt-1 leading-relaxed">
            {message}
          </p>

          {isKeyError && (
            <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/60 border border-red-300 dark:border-red-800 text-xs text-red-900 dark:text-red-100 flex items-start gap-2">
              <KeyRound className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
              <span>
                Please configure <strong className="font-mono font-bold">GEMINI_API_KEY</strong> in your environment variables or Secrets panel.
              </span>
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={onRetry}
              className="px-4 py-2 text-xs font-black uppercase tracking-widest text-white bg-red-600 hover:bg-red-700 border-2 border-red-800 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              TRY AGAIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
