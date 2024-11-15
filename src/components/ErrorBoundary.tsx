import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (    <div
        style={{
          backgroundImage: `linear-gradient(rgba(255, 0, 0, 0.5), rgba(128, 128, 128, 0.5))`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: `100%`,
          height: `100%`,
          position: 'relative',
        }}
        className="flex"
      >
        <div className="flex">
          <article className="flex w-full h-full relative bg-blue-500">
            <div className="absolute bottom-0 left-0 text-center bg-gray-800 w-3/5 mx-auto">
              <h3 className="text-5xl break-words pl-0.5">
                TED2025
              </h3>
            </div>
            <h4 className="text-3xl break-words pl-0.5">
              Humanity Reimagined
            </h4>
          </article>
        </div>
  
      </div>);
    }

    return this.props.children;
  }
}
