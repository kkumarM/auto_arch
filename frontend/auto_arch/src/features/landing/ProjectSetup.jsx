import React, { useState } from 'react';

export default function ProjectSetup({ projectType, onComplete, onBack }) {
    const [name, setName] = useState('');
    const [platform, setPlatform] = useState('ios'); // Default for mobile
    const [mode, setMode] = useState('scratch'); // 'scratch', 'template', 'ai'
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("Please enter a project name");
            return;
        }

        onComplete({
            name,
            projectType,
            platform: projectType === 'mobile' ? platform : 'web',
            templateId: mode === 'template' ? selectedTemplate : null,
            mode,
            description: mode === 'ai' ? description : null
        });
    };

    return (
        <div className="min-h-screen bg-[#2d2d2d] flex flex-col items-center justify-center text-white p-4">
            <div className="max-w-md w-full bg-[#333333] border border-[#444444] rounded-xl p-8 shadow-2xl">
                <div className="flex items-center mb-6">
                    <button onClick={onBack} className="text-gray-400 hover:text-white mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-bold">Project Setup</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Project Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Project Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="My Awesome App"
                            className="w-full bg-[#1a1a1a] border border-[#444444] rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                        />
                    </div>

                    {/* Platform Selection (Mobile Only) */}
                    {projectType === 'mobile' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Target Platform</label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`
                                    cursor-pointer border rounded-lg p-3 flex items-center justify-center transition-all
                                    ${platform === 'ios' ? 'border-blue-500 bg-blue-900/20 text-blue-400' : 'border-[#444444] bg-[#2d2d2d] text-gray-400 hover:border-gray-500'}
                                `}>
                                    <input type="radio" name="platform" value="ios" checked={platform === 'ios'} onChange={() => setPlatform('ios')} className="hidden" />
                                    <span>iOS</span>
                                </label>
                                <label className={`
                                    cursor-pointer border rounded-lg p-3 flex items-center justify-center transition-all
                                    ${platform === 'android' ? 'border-green-500 bg-green-900/20 text-green-400' : 'border-[#444444] bg-[#2d2d2d] text-gray-400 hover:border-gray-500'}
                                `}>
                                    <input type="radio" name="platform" value="android" checked={platform === 'android'} onChange={() => setPlatform('android')} className="hidden" />
                                    <span>Android</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Strategy Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Starting Point</label>
                        <div className="space-y-3">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="mode"
                                    value="scratch"
                                    checked={mode === 'scratch'}
                                    onChange={() => setMode('scratch')}
                                    className="mr-3 text-blue-500 focus:ring-blue-500 bg-[#1a1a1a] border-[#444444]"
                                />
                                <span className="text-gray-300">Start from Scratch</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="mode"
                                    value="template"
                                    checked={mode === 'template'}
                                    onChange={() => setMode('template')}
                                    className="mr-3 text-blue-500 focus:ring-blue-500 bg-[#1a1a1a] border-[#444444]"
                                />
                                <span className="text-gray-300">Use a Template</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="mode"
                                    value="ai"
                                    checked={mode === 'ai'}
                                    onChange={() => setMode('ai')}
                                    className="mr-3 text-blue-500 focus:ring-blue-500 bg-[#1a1a1a] border-[#444444]"
                                />
                                <span className="text-blue-400 font-semibold">AI Generated ✨</span>
                            </label>
                        </div>
                    </div>

                    {/* Template Selection */}
                    {mode === 'template' && (
                        <div className="pl-6 border-l-2 border-[#444444]">
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Select Template</label>
                            <select
                                value={selectedTemplate}
                                onChange={(e) => setSelectedTemplate(e.target.value)}
                                className="w-full bg-[#1a1a1a] border border-[#444444] rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors"
                            >
                                <option value="">-- Choose a Template --</option>
                                {projectType === 'mobile' ? (
                                    <>
                                        <option value="ios">iOS Standard Architecture</option>
                                        <option value="android">Android MVVM Architecture</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="react">React SPA</option>
                                        <option value="nextjs">Next.js Full Stack</option>
                                    </>
                                )}
                            </select>
                        </div>
                    )}

                    {/* AI Description */}
                    {mode === 'ai' && (
                        <div className="pl-6 border-l-2 border-blue-500/50">
                            <label className="block text-xs font-medium text-blue-400 uppercase mb-2">Describe your App</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="e.g. A food delivery app with real-time tracking, user profiles, and payment processing."
                                className="w-full bg-[#1a1a1a] border border-[#444444] rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors h-24 resize-none"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg"
                    >
                        Create Project
                    </button>
                </form>
            </div>
        </div>
    );
}
