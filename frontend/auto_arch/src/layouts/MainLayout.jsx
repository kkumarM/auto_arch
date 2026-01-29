import React from 'react';
import Footer from '../components/Footer';

export default function MainLayout({ children, header }) {
    return (
        <div className="flex flex-col min-h-screen bg-[#020617] text-white overflow-hidden">
            {header && (
                <header className="bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 z-30 relative">
                    <div className="w-full px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            {header}
                        </div>
                    </div>
                    {/* Subtle glow line */}
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
                </header>
            )}

            <main className="flex-1 overflow-hidden relative flex flex-col">
                {children}
            </main>

            <Footer />
        </div>
    );
}
