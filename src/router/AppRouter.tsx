import React, { ComponentType } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Home } from '../pages/Home';
import { Upload } from '../pages/Upload';
import { Login } from '../pages/Login';
import { Quiz } from '../pages/Quiz';
import { Buckets, CreateBucket, BucketDetails } from '../pages/Buckets';
import { ProtectedRoute } from '../components/auth';
import { ErrorFallback } from '../components/error';

export const AppRouter: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary FallbackComponent={ErrorFallback as unknown as ComponentType<FallbackProps>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/buckets/:id/upload" 
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/buckets/:id/questions/:questionId" 
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/buckets" 
            element={
              <ProtectedRoute>
                <Buckets />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/buckets/create" 
            element={
              <ProtectedRoute>
                <CreateBucket />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/buckets/:id" 
            element={
              <ProtectedRoute>
                <BucketDetails />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<Login />} />
          {/* Additional routes will be added later */}
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};