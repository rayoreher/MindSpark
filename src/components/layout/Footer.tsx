import { Brain } from "lucide-react";
const year = new Date().getFullYear();
export default function Footer() {
  return (
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="w-6 h-6 text-primary-600" />
              <span className="text-lg font-semibold text-gray-900">MindSpark</span>
            </div>
            <p className="text-gray-600 text-sm">
              © {year} MindSpark. Learning made simple.
            </p>
          </div>
        </div>
      </footer>
  );
}