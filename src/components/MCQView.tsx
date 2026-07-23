import React, { useState } from 'react';
import {
  HelpCircle,
  Copy,
  Check,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MCQItem } from '../types';

interface MCQViewProps {
  mcqs: MCQItem[];
}

export const MCQView: React.FC<MCQViewProps> = ({ mcqs }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [copied, setCopied] = useState(false);
  const [quizMode, setQuizMode] = useState<'all' | 'interactive'>('interactive');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (showResults) return; // Locked once results are checked
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    mcqs.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const handleCheckAnswers = () => {
    setShowResults(true);
    const score = calculateScore();
    if (score === mcqs.length) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setCurrentQuestionIndex(0);
  };

  const handleCopyQuiz = () => {
    const formattedText = `# Practice MCQs (${mcqs.length} Questions)

${mcqs
  .map(
    (q, idx) => `Question ${idx + 1}: ${q.question}
${q.options.map((opt, oIdx) => `  [${String.fromCharCode(65 + oIdx)}] ${opt}`).join('\n')}
Correct Answer: [${String.fromCharCode(65 + q.correctIndex)}] ${q.options[q.correctIndex]}
Explanation: ${q.explanation}
`
  )
  .join('\n---\n\n')}`;

    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalQuestions = mcqs.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const currentQ = mcqs[currentQuestionIndex];

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-800 p-6 sm:p-8 transition-colors duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b-2 border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-slate-800 px-2 py-0.5 border border-emerald-200 dark:border-emerald-900">
              Exam Self-Test
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 uppercase leading-none underline decoration-4 decoration-emerald-500 underline-offset-4 mt-2">
            5X PRACTICE MCQS ({totalQuestions} QUESTIONS)
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Mode switch */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 flex items-center border border-slate-300 dark:border-slate-700">
            <button
              onClick={() => setQuizMode('interactive')}
              className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all ${
                quizMode === 'interactive'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Step-by-Step
            </button>
            <button
              onClick={() => setQuizMode('all')}
              className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all ${
                quizMode === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All MCQs
            </button>
          </div>

          {/* Copy Button */}
          <button
            id="copy-mcqs-btn"
            onClick={handleCopyQuiz}
            className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 border-2 border-slate-900 dark:border-slate-700 px-3 py-1.5 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">COPIED!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>COPY QUIZ</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Score / Results Banner */}
      {showResults && (
        <div className="mb-6 p-5 bg-emerald-50 dark:bg-slate-950 border-2 border-emerald-600 dark:border-emerald-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600 text-white font-black shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                QUIZ COMPLETED!
                {calculateScore() === totalQuestions && (
                  <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase bg-amber-400 text-black border border-amber-500">
                    <Sparkles className="w-3 h-3 mr-1" /> PERFECT 100%!
                  </span>
                )}
              </h3>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mt-1">
                YOU SCORED <span className="text-emerald-600 dark:text-emerald-400 font-black">{calculateScore()}</span> OUT OF {totalQuestions} ({Math.round((calculateScore() / totalQuestions) * 100)}%).
              </p>
            </div>
          </div>

          <button
            id="retry-quiz-btn"
            onClick={handleResetQuiz}
            className="px-4 py-2 text-xs font-black uppercase tracking-widest text-emerald-900 dark:text-emerald-300 bg-white dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 border-2 border-emerald-600 transition-all flex items-center gap-1.5 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            RETAKE QUIZ
          </button>
        </div>
      )}

      {/* Quiz Body */}
      {quizMode === 'interactive' ? (
        /* STEP BY STEP INTERACTIVE VIEW */
        currentQ && (
          <div className="space-y-5">
            {/* Question Progress Bar */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              <span>
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span>
                Answered: {answeredCount}/{totalQuestions}
              </span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                }}
              />
            </div>

            {/* Question Card */}
            <div className="bg-slate-50 dark:bg-slate-950 p-5 border-2 border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-black uppercase text-slate-900 dark:text-slate-100 mb-4">
                {currentQuestionIndex + 1}. {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, oIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === oIdx;
                  const isCorrect = currentQ.correctIndex === oIdx;

                  let optionStyle =
                    'border-2 border-slate-300 dark:border-slate-800 hover:border-indigo-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200';

                  if (showResults) {
                    if (isCorrect) {
                      optionStyle =
                        'border-2 border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-100 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optionStyle =
                        'border-2 border-red-500 bg-red-50 dark:bg-red-950 text-red-950 dark:text-red-100';
                    } else {
                      optionStyle =
                        'border-2 border-slate-200 dark:border-slate-800 opacity-60 bg-white dark:bg-slate-900';
                    }
                  } else if (isSelected) {
                    optionStyle =
                      'border-2 border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-950 dark:text-indigo-100 font-bold';
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(currentQ.id, oIdx)}
                      className={`w-full p-3.5 border text-left text-sm transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
                    >
                      <span className="w-6 h-6 bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center text-xs font-black shrink-0">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="flex-1 font-bold leading-snug mt-0.5">{option}</span>
                      {showResults && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {showResults && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {showResults && (
                <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-900 border-l-4 border-indigo-600 text-xs font-semibold leading-relaxed text-slate-800 dark:text-slate-200">
                  <span className="font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-1">
                    EXPLANATION:
                  </span>
                  {currentQ.explanation}
                </div>
              )}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 disabled:opacity-40 transition-all flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              {!showResults ? (
                answeredCount === totalQuestions ? (
                  <button
                    onClick={handleCheckAnswers}
                    className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-emerald-600 hover:bg-emerald-500 border-2 border-emerald-700 transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    SUBMIT & GRADE QUIZ
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))
                    }
                    disabled={currentQuestionIndex === totalQuestions - 1}
                    className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-900 border-2 border-indigo-300 dark:border-indigo-800 disabled:opacity-40 transition-all flex items-center gap-1"
                  >
                    Next Question
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )
              ) : (
                <button
                  onClick={() =>
                    setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))
                  }
                  disabled={currentQuestionIndex === totalQuestions - 1}
                  className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 disabled:opacity-40 transition-all flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )
      ) : (
        /* ALL QUESTIONS LIST VIEW */
        <div className="space-y-6">
          {mcqs.map((q, idx) => (
            <div
              key={q.id}
              className="bg-slate-50 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800"
            >
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">
                {idx + 1}. {q.question}
              </h3>

              <div className="space-y-2">
                {q.options.map((option, oIdx) => {
                  const isSelected = selectedAnswers[q.id] === oIdx;
                  const isCorrect = q.correctIndex === oIdx;

                  let optionStyle =
                    'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200';

                  if (showResults) {
                    if (isCorrect) {
                      optionStyle =
                        'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      optionStyle =
                        'border-red-400 bg-red-50/80 dark:bg-red-950/60 text-red-950 dark:text-red-100';
                    } else {
                      optionStyle =
                        'border-slate-200 dark:border-slate-800 opacity-60 bg-white dark:bg-slate-900';
                    }
                  } else if (isSelected) {
                    optionStyle =
                      'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-950 dark:text-indigo-100 font-semibold';
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(q.id, oIdx)}
                      className={`w-full p-3 rounded-xl border text-left text-sm transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold shrink-0">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="flex-1 leading-relaxed mt-0.5">{option}</span>
                      {showResults && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      )}
                      {showResults && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {showResults && (
                <div className="mt-3 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-0.5">
                    💡 Explanation:
                  </span>
                  {q.explanation}
                </div>
              )}
            </div>
          ))}

          {!showResults && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleCheckAnswers}
                className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Grade Quiz Answers ({answeredCount}/{totalQuestions} Answered)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
