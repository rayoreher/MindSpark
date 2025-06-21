import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AppRouter } from './router/AppRouter';
import { ErrorFallback } from './components/error';
import './i18n/config';

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AppRouter />
    </ErrorBoundary>
  );
}

export default App;