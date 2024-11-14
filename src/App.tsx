import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TalkFilters } from './components/TalkFilters';
// import { useWindowSize } from './hooks/useWindowSize';
import { TalkList } from './components/TalkList';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  // Use the custom hook to get window size
  // const { width, height } = useWindowSize();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === 't' && 
        !event.ctrlKey && 
        !event.altKey && 
        !(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)
      ) {
        setShowFilters(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          {/* <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-gray-900">
                TED Talks
              </h1>
              <p className="text-sm text-gray-500">
                Window size: {width} x {height}
              </p>
            </div>
          </header> */}

          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {showFilters && (
              <TalkFilters
                onSearch={setSearchQuery}
                onTopicChange={setSelectedTopic}
                selectedTopic={selectedTopic}
              />
            )}
            <TalkList
              searchQuery={searchQuery}
              topicFilter={selectedTopic}
            />
          </main>
        </div>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
