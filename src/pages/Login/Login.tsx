import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Brain, Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get the page user was trying to access before login
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        setError('root', {
          message: error.message
        });
      } else {
        // Successful login - redirect to intended page or home
        navigate(from, { replace: true });
      }
    } catch (error) {
      setError('root', {
        message: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="max-w-md w-full relative">
        {/* Back to Home Link */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
                <Brain className="w-8 h-8 text-primary-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('login.title')}
            </h1>
            <p className="text-gray-600">
              {t('login.subtitle')}
            </p>
            
            {/* Show message if redirected from protected route */}
            {from !== '/' && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Please sign in to access the upload page.
                </p>
              </div>
            )}
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <Input
                {...register('email')}
                type="email"
                label={t('login.form.email')}
                placeholder="Enter your email address"
                error={errors.email?.message}
                autoComplete="email"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  label={t('login.form.password')}
                  placeholder="Enter your password"
                  error={errors.password?.message}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Form Error */}
            {errors.root && (
              <div className="p-3 bg-error-50 border border-error-200 rounded-lg">
                <p className="text-sm text-error-700">{errors.root.message}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              icon={LogIn}
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? t('login.form.signingIn') : t('login.form.signIn')}
            </Button>
          </form>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            {t('login.securityNotice')}
          </p>
        </div>
      </div>
    </div>
  );
};