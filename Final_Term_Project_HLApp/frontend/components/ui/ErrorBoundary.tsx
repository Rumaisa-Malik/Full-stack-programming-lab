'use client';

import { ReactNode, Component, ErrorInfo } from 'react';
import { Card, CardHeader, CardBody } from './Card';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-base flex items-center justify-center p-4">
            <Card variant="glass" className="max-w-md w-full">
              <CardHeader title="Something went wrong" subtitle="An unexpected error occurred" />
              <CardBody>
                <p className="text-sm text-ink-soft mb-4">
                  {this.state.error?.message || 'Please try refreshing the page.'}
                </p>
                <Button
                  variant="primary"
                  onClick={() => {
                    this.setState({ hasError: false });
                    window.location.reload();
                  }}
                >
                  Refresh Page
                </Button>
              </CardBody>
            </Card>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
