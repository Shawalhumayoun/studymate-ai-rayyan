import React, { useState } from 'react';
import { BookOpen, Copy, Check, Search, Sparkles, Lightbulb, MessageSquareQuote } from 'lucide-react';
import { VocabItem } from '../types';

interface VocabularyViewProps {
  vocabulary: VocabItem[];
}

export const VocabularyView: React.FC<VocabularyViewProps> = ({ vocabulary }) => {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVocabulary = vocabulary.filter(
    (item) =>
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.simpleDefinition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyVocabulary = () => {
    const formattedText = `# Vocabulary Simplified (${vocabulary.length} Terms)

${vocabulary
  .map(
    (item) => `## ${item.term}
• Definition: ${item.simpleDefinition}
• Example: ${item.contextExample}
• Analogy/Synonym: ${item.analogyOrSynonym}`
  )
  .join('\n\n')}`;

    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-800 p-6 sm:p-8 transition-colors duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b-2 border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-slate-800 px-2 py-0.5 border border-amber-200 dark:border-amber-900">
              Vocabulary Decoder
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 uppercase leading-none underline decoration-4 decoration-amber-500 underline-offset-4 mt-2">
            HARD WORDS EXPLAINED SIMPLY ({vocabulary.length})
          </h2>
        </div>

        {/* Copy Button */}
        <button
          id="copy-vocabulary-btn"
          onClick={handleCopyVocabulary}
          className="self-start sm:self-auto text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 border-2 border-slate-900 dark:border-slate-700 px-3.5 py-2 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">COPIED!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>COPY VOCABULARY</span>
            </>
          )}
        </button>
      </div>

      {/* Search Input Filter */}
      {vocabulary.length > 3 && (
        <div className="relative mb-5">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search terms or definitions..."
            className="w-full pl-10 pr-4 py-2.5 text-xs font-bold bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>
      )}

      {/* Grid of Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVocabulary.map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-50 dark:bg-slate-950 p-5 border-2 border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3 hover:border-amber-500 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center px-3 py-1 text-xs font-black uppercase tracking-wider bg-amber-400 text-black border border-amber-500">
                  <Sparkles className="w-3 h-3 mr-1 text-black" />
                  {item.term}
                </span>
              </div>

              {/* Simple Definition */}
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug uppercase mb-3">
                {item.simpleDefinition}
              </p>

              {/* Context Example */}
              <div className="text-xs font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3.5 border-l-4 border-amber-500 border-y border-r border-slate-200 dark:border-slate-800 leading-relaxed flex items-start gap-2">
                <MessageSquareQuote className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-black text-slate-900 dark:text-slate-100 uppercase block text-[10px] tracking-wider mb-0.5">Context Example:</strong>
                  <span>{item.contextExample}</span>
                </div>
              </div>
            </div>

            {/* Analogy / Synonym */}
            <div className="pt-2.5 border-t-2 border-slate-200 dark:border-slate-800 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wide">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Analogy / Synonym: {item.analogyOrSynonym}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredVocabulary.length === 0 && (
        <div className="text-center py-8 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          No vocabulary terms matching "{searchQuery}"
        </div>
      )}
    </div>
  );
};
