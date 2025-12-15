import React, { useState } from 'react';
import { HistoryItem, OutputType } from '../types';

interface ResultDisplayProps {
  item: HistoryItem;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ item }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(item.response, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = () => {
    try {
      if (item.type === OutputType.FLASHCARDS) {
        const cards = JSON.parse(item.response) as Array<{ front: string; back: string }>;
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cards.map((card, idx) => (
              <div key={idx} className="group perspective">
                <div className="relative w-full h-48 transition-all duration-500 preserve-3d group-hover:rotate-y-180 cursor-pointer">
                  {/* Front */}
                  <div className="absolute w-full h-full bg-white dark:bg-gray-800 border-2 border-indigo-100 dark:border-indigo-900 rounded-xl p-6 flex items-center justify-center text-center backface-hidden shadow-sm">
                    <div>
                      <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2 block">Front</span>
                      <p className="font-semibold text-lg">{card.front}</p>
                    </div>
                  </div>
                  {/* Back */}
                  <div className="absolute w-full h-full bg-gradient-to-br from-primary to-secondary text-white rounded-xl p-6 flex items-center justify-center text-center rotate-y-180 backface-hidden shadow-md">
                    <div>
                      <span className="text-xs font-bold text-white/80 uppercase tracking-wider mb-2 block">Back</span>
                      <p className="font-medium">{card.back}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      }

      if (item.type === OutputType.QUIZ) {
        const quiz = JSON.parse(item.response) as Array<{ question: string; options: string[]; correctIndex: number; explanation: string }>;
        return (
          <div className="space-y-6">
            {quiz.map((q, qIdx) => (
              <QuizQuestion key={qIdx} questionData={q} index={qIdx} />
            ))}
          </div>
        );
      }
      
      // Fallback for Summary/Feedback or regular text
      return (
        <div className="prose dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap">{item.response}</div>
        </div>
      );

    } catch (e) {
        // Fallback if JSON parse fails
        return (
             <div className="prose dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap">{item.response}</div>
            </div>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize">{item.topic}</h2>
          <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">{item.type} • {item.level}</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-gray-500 hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium"
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
};

const QuizQuestion: React.FC<{ 
    questionData: { question: string; options: string[]; correctIndex: number; explanation: string };
    index: number;
}> = ({ questionData, index }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
  };

  const isCorrect = selected === questionData.correctIndex;

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">
        {index + 1}. {questionData.question}
      </h3>
      <div className="space-y-3">
        {questionData.options.map((opt, i) => {
            let btnClass = "w-full text-left px-4 py-3 rounded-lg border transition-all ";
            if (showResult) {
                if (i === questionData.correctIndex) {
                    btnClass += "bg-green-100 border-green-500 text-green-900 dark:bg-green-900/30 dark:text-green-100";
                } else if (selected === i) {
                    btnClass += "bg-red-100 border-red-500 text-red-900 dark:bg-red-900/30 dark:text-red-100";
                } else {
                    btnClass += "border-gray-200 dark:border-gray-700 opacity-50";
                }
            } else {
                 btnClass += "border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-white dark:hover:bg-gray-800";
            }

            return (
                <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className={btnClass}
                    disabled={showResult}
                >
                    {opt}
                </button>
            )
        })}
      </div>
      {showResult && (
        <div className={`mt-4 text-sm p-4 rounded-lg ${isCorrect ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200' : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200'}`}>
          <p className="font-bold mb-1">{isCorrect ? 'Correct!' : 'Incorrect.'}</p>
          <p>{questionData.explanation}</p>
        </div>
      )}
    </div>
  );
};
