import React from 'react';

export default function LandingPage({ onSelect }) {
    return (
        <div className="min-h-screen bg-[#2d2d2d] flex flex-col items-center justify-center text-white p-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 text-blue-500">AutoArch</h1>
                <p className="text-xl text-gray-400">Select your project type to get started</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
                {/* Mobile App Option */}
                <button
                    onClick={() => onSelect('mobile')}
                    className="bg-[#333333] border border-[#444444] rounded-xl p-8 hover:border-blue-500 hover:bg-[#3d3d3d] transition-all duration-300 group text-left"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-900/30 rounded-lg text-purple-400 group-hover:text-purple-300 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Mobile Application</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Design a robust mobile architecture with iOS/Android clients, API Gateways, and microservices.
                    </p>
                </button>

                {/* Web App Option */}
                <button
                    onClick={() => onSelect('web')}
                    className="bg-[#333333] border border-[#444444] rounded-xl p-8 hover:border-blue-500 hover:bg-[#3d3d3d] transition-all duration-300 group text-left"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-900/30 rounded-lg text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Web Application</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Build a scalable web architecture with React/Next.js frontends, Load Balancers, and distributed systems.
                    </p>
                </button>
            </div>
        </div>
    );
}
