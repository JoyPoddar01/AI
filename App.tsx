import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { StudyForm } from './components/StudyForm';
import { ResultDisplay } from './components/ResultDisplay';
import { HistorySidebar } from './components/HistorySidebar';
import { StudyRequest, HistoryItem, LoadingState } from './types';
import { generateStudyContent } from './services/aiService';
import { RECENT_TOPICS_KEY } from './constants';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentItem, setCurrentItem] = useState<HistoryItem | null>(null);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false });

  // Load history from local storage
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_TOPICS_KEY);
    if (saved) {
      setHistory(JSON.parse(saved));
    }
    // Check system preference for theme
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Save history to local storage
  useEffect(() => {
    localStorage.setItem(RECENT_TOPICS_KEY, JSON.stringify(history));
  }, [history]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleStudyRequest = async (request: StudyRequest) => {
    setLoading({ isLoading: true });
    setCurrentItem(null);
    
    try {
      const responseText = await generateStudyContent(request);
      
      const newItem: HistoryItem = {
        ...request,
        id: uuidv4(),
        timestamp: Date.now(),
        response: responseText
      };

      setHistory(prev => [newItem, ...prev].slice(0, 10)); // Keep last 10
      setCurrentItem(newItem);
    } catch (error: any) {
      setLoading({ isLoading: false, error: error.message });
      alert(error.message);
    } finally {
      setLoading({ isLoading: false });
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setCurrentItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    if(confirm('Are you sure you want to clear your history?')) {
        setHistory([]);
        localStorage.removeItem(RECENT_TOPICS_KEY);
    }
  };

  return (
    <Layout darkMode={darkMode} toggleTheme={toggleTheme}>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="flex-grow space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 py-8">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Master any topic in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">minutes</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Generate AI-powered summaries, flashcards, and quizzes instantly. 
              Just type a topic and let EduBot do the rest.
            </p>
          </div>

          <StudyForm onSubmit={handleStudyRequest} isLoading={loading.isLoading} />

          {loading.isLoading && (
            <div className="text-center py-12 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
                <p className="mt-4 text-gray-500">EduBot is crafting your study material...</p>
            </div>
          )}

          {currentItem && !loading.isLoading && (
            <div className="animate-fade-in-up">
               <ResultDisplay item={currentItem} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <HistorySidebar 
            history={history} 
            onSelect={handleSelectHistory} 
            onClear={handleClearHistory}
        />
      </div>
    </Layout>
  );
};

export default App;
