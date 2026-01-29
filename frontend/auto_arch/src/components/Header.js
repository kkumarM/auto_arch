import React from 'react';

export default function Header({ title = 'AutoArch' }) {
  return (
    <header className="bg-transparent text-white/95 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a1 1 0 01.832.445l6 8A1 1 0 0116 12H4a1 1 0 01-.832-1.555l6-8A1 1 0 0110 2zM4 14a2 2 0 00-2 2v1a1 1 0 001 1h14a1 1 0 001-1v-1a2 2 0 00-2-2H4z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">{title}</span>
        </div>

        <nav className="hidden sm:flex items-center space-x-4 text-sm text-gray-300">
          <a href="#" className="hover:text-white transition-colors">Docs</a>
          <a href="#" className="hover:text-white transition-colors">Examples</a>
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
        </nav>
      </div>
    </header>
  );
}
