import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MainLayout } from '../../layouts/MainLayout';
import { FolderPlus, ArrowLeft, Save, Lock, Globe } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Toast } from '../../components/ui/Toast';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

const createBucketSchema = z.object({
  name: z.string().min(5, 'Name must be at least 5 characters long'),
  subject: z.string().min(5, 'Subject must be at least 5 characters long'),
  level: z.string().min(1, 'Please select a level'),
  training_type: z.string().min(1, 'Please select a training type'),
  visibility: z.string().min(1, 'Please select visibility')
});

type CreateBucketFormData = z.infer<typeof createBucketSchema>;

const levelOptions = [
  '1 year', '2 years', '3 years', '4 years', '5 years',
  '6 years', '7 years', '8 years', '9 years', '10 years',
  'junior', 'mid', 'mid senior', 'senior'
];

const trainingTypeOptions = [
  'interview', 'study'
];

const visibilityOptions = [
  { value: 'public', label: 'Public', icon: Globe, description: 'Anyone can view and use this bucket' },
  { value: 'private', label: 'Private', icon: Lock, description: 'Only you can access this bucket' }
];

export const CreateBucket: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch
  } = useForm<CreateBucketFormData>({
    resolver: zodResolver(createBucketSchema)
  });

  const watchedVisibility = watch('visibility');

  const onSubmit = async (data: CreateBucketFormData) => {
    if (!user) {
      setError('root', { message: 'You must be logged in to create a bucket' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data: bucketData, error } = await supabase
        .from('buckets')
        .insert([
          {
            name: data.name.trim(),
            subject: data.subject.trim(),
            level: data.level,
            training_type: data.training_type,
            visibility: data.visibility
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setToastMessage(`Bucket "${data.name}" created successfully!`);
      setToastType('success');
      setShowToast(true);
      
      // Navigate back to buckets page after a short delay
      setTimeout(() => {
        navigate('/buckets');
      }, 2000);

    } catch (error: any) {
      console.error('Error creating bucket:', error);
      setError('root', {
        message: error.message || 'Failed to create bucket. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/buckets');
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              variant="outline"
              icon={ArrowLeft}
              onClick={handleCancel}
            >
              Back to Buckets
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
                <FolderPlus className="w-8 h-8 text-primary-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Create New Bucket
            </h1>
            <p className="text-lg text-gray-600">
              Create a new question bucket to organize and share your content
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <div>
                <Input
                  {...register('name')}
                  label="Bucket Name"
                  placeholder="Enter a descriptive name for your bucket"
                  error={errors.name?.message}
                  helperText="Choose a clear, memorable name (minimum 5 characters)"
                  required
                />
              </div>

              {/* Subject Field */}
              <div>
                <Input
                  {...register('subject')}
                  label="Subject"
                  placeholder="Enter the main subject or topic"
                  error={errors.subject?.message}
                  helperText="What subject does this bucket cover? (minimum 5 characters)"
                  required
                />
              </div>

              {/* Level Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level <span className="text-error-500">*</span>
                </label>
                <select
                  {...register('level')}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                    errors.level ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a level</option>
                  {levelOptions.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                {errors.level && (
                  <p className="text-sm text-error-600 mt-1">{errors.level.message}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Choose the appropriate difficulty or experience level
                </p>
              </div>

              {/* Training Type Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Training Type <span className="text-error-500">*</span>
                </label>
                <select
                  {...register('training_type')}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                    errors.training_type ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select training type</option>
                  {trainingTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.training_type && (
                  <p className="text-sm text-error-600 mt-1">{errors.training_type.message}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  What type of training is this bucket designed for?
                </p>
              </div>

              {/* Visibility Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Visibility <span className="text-error-500">*</span>
                </label>
                <div className="space-y-3">
                  {visibilityOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <label
                        key={option.value}
                        className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          watchedVisibility === option.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          {...register('visibility')}
                          type="radio"
                          value={option.value}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-3 flex-1">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            watchedVisibility === option.value
                              ? 'bg-primary-100 text-primary-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className={`font-medium ${
                                watchedVisibility === option.value ? 'text-primary-700' : 'text-gray-900'
                              }`}>
                                {option.label}
                              </span>
                              {watchedVisibility === option.value && (
                                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                              )}
                            </div>
                            <p className={`text-sm mt-1 ${
                              watchedVisibility === option.value ? 'text-primary-600' : 'text-gray-500'
                            }`}>
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {errors.visibility && (
                  <p className="text-sm text-error-600 mt-1">{errors.visibility.message}</p>
                )}
              </div>

              {/* Form Error */}
              {errors.root && (
                <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
                  <p className="text-sm text-error-700">{errors.root.message}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 sm:flex-none"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  icon={Save}
                  className="flex-1 sm:flex-none"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Bucket'}
                </Button>
              </div>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              What happens after creation?
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your bucket will be created and ready to use</li>
              <li>• You can start adding questions to organize your content</li>
              <li>• {watchedVisibility === 'public' ? 'Other users will be able to discover and use your bucket' : 'Only you will have access to this bucket'}</li>
              <li>• You can always change the settings later</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast
            type={toastType}
            title={toastType === 'success' ? 'Success' : 'Error'}
            message={toastMessage}
            onClose={() => setShowToast(false)}
          />
        </div>
      )}
    </MainLayout>
  );
};