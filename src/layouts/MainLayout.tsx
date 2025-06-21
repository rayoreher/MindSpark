import React from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, Menu, X, LogIn, LogOut } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/">
              <div className="flex items-center space-x-2">
                <Brain className="w-8 h-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900">MindSpark</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {user && (
                <>
                  <Link to="/buckets" className="text-gray-700 hover:text-primary-600 font-medium">
                    Buckets
                  </Link>
                </>
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <Button variant="outline" icon={LogOut} onClick={handleSignOut}>
                  Sign Out
                </Button>
              ) : (
                <Button variant="outline" icon={LogIn} onClick={() => navigate('/login')}>
                  {t('navigation.login')}
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user && (
                <>
                  <a
                    href="/buckets"
                    className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium"
                  >
                    Buckets
                  </a>
                </>
              )}
            </div>
            <div className="px-4 py-3 border-t border-gray-200">
              {user ? (
                <Button 
                  variant="outline" 
                  icon={LogOut} 
                  className="w-full"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  icon={LogIn} 
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  {t('navigation.login')}
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="w-6 h-6 text-primary-600" />
              <span className="text-lg font-semibold text-gray-900">MindSpark</span>
            </div>
            <p className="text-gray-600 text-sm">
              © 2024 MindSpark. Learning made simple.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};