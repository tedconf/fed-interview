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
  const [showFilters, setShowFilters] = useState(false);

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
        <div className="">
          <main className="flex">
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
