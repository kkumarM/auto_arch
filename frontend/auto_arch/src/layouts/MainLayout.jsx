import React from 'react';

export default function MainLayout({ children, header }) {
    return (
        <div className="flex flex-col h-screen bg-[#2d2d2d] text-white">
            {header && (
                <header className="bg-[#333333] shadow-md z-10 border-b border-[#444444]">
                    <div className="w-full px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-14">
                            {header}
                        </div>
                    </div>
                </header>
            )}
            <main className="flex-1 overflow-hidden relative flex flex-col">
                {children}
            </main>
        </div>
    );
}
