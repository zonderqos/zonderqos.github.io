import React, { Component } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected rendering error occurred.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('Error caught by ZonderqOS ErrorBoundary:', error, info);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#080B14] p-6 text-slate-100">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#111827] p-8 text-center shadow-2xl">
            <h1 className="text-2xl font-extrabold text-white">ZonderqOS — Display Recovery</h1>
            <p className="mt-3 text-sm text-slate-300">
              An unexpected client-side rendering error occurred while loading the website.
            </p>
            {this.state.errorMessage && (
              <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-[#060911] p-3 text-left font-mono text-xs text-rose-300">
                <code>{this.state.errorMessage}</code>
              </pre>
            )}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
