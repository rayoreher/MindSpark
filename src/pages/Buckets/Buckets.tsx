import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { FolderOpen, Plus, Search, Filter, Grid, List, Calendar, User, Lock, Globe, AlertCircle, RefreshCw, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { supabase } from '../../lib/supabase';

interface Bucket {
  id: string;
  name: string;
  subject: string;
  level: string;
  training_type: 'interview' | 'study';
  visibility: 'private' | 'public';
  question_number: Array<{ count: number }>;
}

export const Buckets: React.FC = () => {
  const navigate = useNavigate();
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterBy, setFilterBy] = useState<'all' | 'public' | 'private'>('all');

  useEffect(() => {
    fetchBuckets();
  }, []);

  const fetchBuckets = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('buckets')
        .select(`
          id,
          name,
          subject,
          level,
          training_type,
          visibility,
          question_number:questions(count)
        `)
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      setBuckets(data || []);
    } catch (err: any) {
      console.error('Error fetching buckets:', err);
      setError(err.message || 'Failed to load buckets');
    } finally {
      setIsLoading(false);
    }
  };

  const getQuestionCount = (bucket: Bucket): number => {
    return bucket.question_number[0]?.count || 0;
  };

  const filteredBuckets = buckets.filter(bucket => {
    const matchesSearch = bucket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bucket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bucket.level.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterBy === 'all' || bucket.visibility === filterBy;
    
    return matchesSearch && matchesFilter;
  });

  const handleCreateBucket = () => {
    navigate('/buckets/create');
  };

  const handleBucketClick = (bucketId: string) => {
    navigate(`/buckets/${bucketId}`);
  };

  const getTrainingTypeColor = (type: string) => {
    return type === 'interview' 
      ? 'bg-accent-100 text-accent-700 border-accent-200'
      : 'bg-secondary-100 text-secondary-700 border-secondary-200';
  };

  const getLevelColor = (level: string) => {
    if (level.includes('year')) {
      return 'bg-primary-100 text-primary-700 border-primary-200';
    }
    switch (level) {
      case 'junior':
        return 'bg-success-100 text-success-700 border-success-200';
      case 'mid':
        return 'bg-accent-100 text-accent-700 border-accent-200';
      case 'mid senior':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'senior':
        return 'bg-error-100 text-error-700 border-error-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Question Buckets
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Organize and discover curated collections of questions from the community
            </p>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search buckets, subjects, or levels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filters and Controls */}
              <div className="flex items-center space-x-4">
                {/* Filter */}
                <div className="flex items-center space-x-2">
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as 'all' | 'public' | 'private')}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Buckets</option>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                {/* Create Button */}
                <Button
                  icon={Plus}
                  onClick={handleCreateBucket}
                  className="whitespace-nowrap"
                >
                  Create Bucket
                </Button>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-8 bg-error-50 border border-error-200 rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-error-600 flex-shrink-0" />
                <div>
                  <h3 className="text-error-800 font-medium">Error Loading Buckets</h3>
                  <p className="text-error-700 text-sm mt-1">{error}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon={RefreshCw}
                  onClick={fetchBuckets}
                  className="ml-auto"
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* Results Count */}
          {!isLoading && !error && (
            <div className="mb-4">
              <p className="text-gray-600">
                Showing {filteredBuckets.length} of {buckets.length} buckets
                {searchTerm && (
                  <span className="ml-1">
                    for "<span className="font-medium text-gray-900">{searchTerm}</span>"
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <LoadingSkeleton className="w-24 h-6" />
                      <LoadingSkeleton className="w-16 h-4" />
                    </div>
                    <LoadingSkeleton className="w-full h-4" />
                    <LoadingSkeleton className="w-3/4 h-4" />
                    <div className="flex gap-2">
                      <LoadingSkeleton className="w-16 h-6" />
                      <LoadingSkeleton className="w-20 h-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBuckets.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
                <FolderOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No buckets found' : 'No buckets available'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                  : 'Create your first bucket to start organizing question collections.'
                }
              </p>
              {!searchTerm && (
                <Button
                  onClick={handleCreateBucket}
                  icon={Plus}
                  size="lg"
                >
                  Create Your First Bucket
                </Button>
              )}
            </div>
          ) : (
            /* Buckets Display */
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredBuckets.map((bucket) => {
                const questionCount = getQuestionCount(bucket);
                
                return (
                  <div
                    key={bucket.id}
                    onClick={() => handleBucketClick(bucket.id)}
                    className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-primary-200 transition-all duration-300 cursor-pointer group ${
                      viewMode === 'list' ? 'p-4' : 'p-6'
                    }`}
                  >
                    {viewMode === 'grid' ? (
                      /* Grid View */
                      <>
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors flex-shrink-0">
                              <FolderOpen className="w-5 h-5 text-primary-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                                {bucket.name}
                              </h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="flex items-center text-sm text-gray-500">
                                  {bucket.visibility === 'private' ? (
                                    <><Lock className="w-3 h-3 mr-1" /> Private</>
                                  ) : (
                                    <><Globe className="w-3 h-3 mr-1" /> Public</>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Question Count - Prominent Display */}
                        <div className="mb-4 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-100">
                          <div className="flex items-center justify-center space-x-2">
                            <MessageSquare className="w-5 h-5 text-primary-600" />
                            <span className="text-2xl font-bold text-primary-700">
                              {questionCount}
                            </span>
                            <span className="text-sm text-primary-600 font-medium">
                              {questionCount === 1 ? 'Question' : 'Questions'}
                            </span>
                          </div>
                        </div>

                        {/* Tags - Subject and Level */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {/* Subject Tag */}
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
                              📚 {bucket.subject}
                            </span>
                            
                            {/* Level Tag */}
                            <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getLevelColor(bucket.level)}`}>
                              🎯 {bucket.level}
                            </span>
                          </div>
                        </div>

                        {/* Training Type */}
                        <div className="mb-4">
                          <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${getTrainingTypeColor(bucket.training_type)}`}>
                            {bucket.training_type === 'interview' ? '💼' : '📖'} {bucket.training_type.charAt(0).toUpperCase() + bucket.training_type.slice(1)}
                          </span>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                          <div className="flex items-center">

                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs">Click to explore</span>
                            <span className="text-primary-500">→</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* List View */
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors flex-shrink-0">
                          <FolderOpen className="w-6 h-6 text-primary-600" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                              {bucket.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 flex-shrink-0">
                              <div className="flex items-center space-x-1 bg-primary-50 px-2 py-1 rounded">
                                <MessageSquare className="w-3 h-3 text-primary-600" />
                                <span className="font-bold text-primary-700">{questionCount}</span>
                              </div>
                              <div className="flex items-center">
                                {bucket.visibility === 'private' ? (
                                  <><Lock className="w-3 h-3 mr-1" /> Private</>
                                ) : (
                                  <><Globe className="w-3 h-3 mr-1" /> Public</>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {/* Subject Tag */}
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                                📚 {bucket.subject}
                              </span>
                              
                              {/* Level Tag */}
                              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getLevelColor(bucket.level)}`}>
                                🎯 {bucket.level}
                              </span>

                              {/* Training Type Tag */}
                              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTrainingTypeColor(bucket.training_type)}`}>
                                {bucket.training_type === 'interview' ? '💼' : '📖'} {bucket.training_type}
                              </span>
                            </div>
                            
                            <div className="flex items-center text-xs text-gray-500">
                              <span className="bg-gray-100 px-2 py-1 rounded font-mono">
                                {bucket.id.slice(0, 8)}...
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};