import React, { useState } from 'react';
import { StudyRequest, OutputType, DifficultyLevel } from '../types';
import { OUTPUT_TYPE_LABELS, LEVEL_LABELS } from '../constants';

interface StudyFormProps {
  onSubmit: (request: StudyRequest) => void;
  isLoading: boolean;
}

export const StudyForm: React.FC<StudyFormProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState<OutputType>(OutputType.SUMMARY);
  const [level, setLevel] = useState<DifficultyLevel>(DifficultyLevel.BEGINNER);
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit({ topic, type, level, details });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6 border border-gray-100 dark:border-gray-700">
      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          What do you want to master?
        </label>
        <input
          id="topic"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Photosynthesis, The French Revolution, React Hooks"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Output Format
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as OutputType)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary outline-none cursor-pointer"
          >
            {Object.entries(OUTPUT_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Difficulty Level
          </label>
          <select
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value as DifficultyLevel)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary outline-none cursor-pointer"
          >
            {Object.entries(LEVEL_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="details" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Additional Details / Context (Optional)
        </label>
        <textarea
          id="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={3}
          placeholder="Paste text to analyze, or add specific instructions..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !topic.trim()}
        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-primary/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]
          ${isLoading || !topic.trim() ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-primary to-secondary hover:shadow-primary/50'}
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Thinking...
          </span>
        ) : (
          'Generate Study Material'
        )}
      </button>
    </form>
  );
};
