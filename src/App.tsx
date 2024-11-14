import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TalkFilters } from './components/TalkFilters';
import { TalkList } from './components/TalkList';
import { useWindowSize } from './hooks/useWindowSize';

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

  // Use the custom hook to get window size
  const { width, height } = useWindowSize();

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-gray-900">
                TED Talks
              </h1>
              <p className="text-sm text-gray-500">
                Window size: {width} x {height}
              </p>
            </div>
          </header>

          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <TalkFilters
              onSearch={setSearchQuery}
              onTopicChange={setSelectedTopic}
              selectedTopic={selectedTopic}
            />
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
