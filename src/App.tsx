import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { AppRouter } from "./router/AppRouter";
import { ErrorFallback } from "./components/error";
import "./i18n/config";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ComponentType } from "react";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        FallbackComponent={
          ErrorFallback as unknown as ComponentType<FallbackProps>
        }
      >
        <AppRouter />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
