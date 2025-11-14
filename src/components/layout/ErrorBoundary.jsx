import React from 'react';
import Button from '../ui/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Optionally log the error to an error reporting service
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    // Optionally: reload route or retry fetch
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
          <h1 className="text-3xl font-extrabold mb-4 text-red-600 select-none">Oops! Something went wrong.</h1>
          <p className="mb-6 text-center text-gray-700 wrap-break-word">
            {this.state.error?.message || 'An unexpected error occurred. Please try refreshing or retry.'}
          </p>
          <Button onClick={this.handleRetry} fullWidth>
            Retry
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;