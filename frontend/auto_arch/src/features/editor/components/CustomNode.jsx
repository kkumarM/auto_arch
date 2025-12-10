import React, { useState, useEffect } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Icons } from './icons';

const colorMap = {
    'bg-slate-500': '#64748b',
    'bg-gray-500': '#6b7280',
    'bg-zinc-500': '#71717a',
    'bg-neutral-500': '#737373',
    'bg-stone-500': '#78716c',
    'bg-red-400': '#f87171',
    'bg-red-500': '#ef4444',
    'bg-red-600': '#dc2626',
    'bg-orange-500': '#f97316',
    'bg-amber-500': '#f59e0b',
    'bg-yellow-500': '#eab308',
    'bg-yellow-600': '#ca8a04',
    'bg-lime-500': '#84cc16',
    'bg-green-500': '#22c55e',
    'bg-green-600': '#16a34a',
    'bg-emerald-500': '#10b981',
    'bg-teal-500': '#14b8a6',
    'bg-teal-600': '#0d9488',
    'bg-cyan-500': '#06b6d4',
    'bg-sky-500': '#0ea5e9',
    'bg-blue-400': '#60a5fa',
    'bg-blue-500': '#3b82f6',
    'bg-blue-600': '#2563eb',
    'bg-blue-800': '#1e40af',
    'bg-indigo-500': '#6366f1',
    'bg-indigo-600': '#4f46e5',
    'bg-violet-500': '#8b5cf6',
    'bg-purple-500': '#a855f7',
    'bg-purple-600': '#9333ea',
    'bg-fuchsia-500': '#d946ef',
    'bg-pink-500': '#ec4899',
    'bg-rose-500': '#f43f5e',
};

const CustomNode = ({ id, data }) => {
    const { setNodes } = useReactFlow();
    const [isEditing, setIsEditing] = useState(false);
    const [label, setLabel] = useState(data.label);

    useEffect(() => {
        setLabel(data.label);
    }, [data.label, data]); // Watch data for changes

    const onDelete = () => {
        setNodes((nodes) => nodes.filter((node) => node.id !== id));
    };

    const handleLabelChange = (evt) => {
        setLabel(evt.target.value);
    };

    const handleLabelBlur = () => {
        setIsEditing(false);
        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === id) {
                    return { ...node, data: { ...node.data, label: label } };
                }
                return node;
            })
        );
    };

    const handleKeyDown = (evt) => {
        if (evt.key === 'Enter') {
            handleLabelBlur();
        }
    };

    // Helper to get hex color
    const getBackgroundColor = () => {
        if (!data.color) return '#333333';
        return colorMap[data.color] || data.color; // Fallback to original string if not in map (e.g. if it's already a hex)
    };

    return (
        <div className="shadow-md rounded-md bg-[#2d2d2d] border border-[#444444] min-w-[150px] group hover:border-blue-500 transition-colors relative">
            {/* Handles */}
            <Handle type="target" position={Position.Top} id="top" className="w-3 h-3 bg-blue-500" />
            <Handle type="target" position={Position.Left} id="left" className="w-3 h-3 bg-blue-500" />

            <div
                className="flex items-center justify-between px-3 py-2 border-b border-[#444444] rounded-t-md"
                style={{ backgroundColor: getBackgroundColor() }}
            >
                <div className="flex items-center">
                    <div className={`mr-2 ${data.color ? data.color.replace('bg-', 'text-') : 'text-gray-400'} group-hover:text-white`}>
                        {data.customIcon ? (
                            <img src={data.customIcon} alt="icon" className="w-5 h-5 object-contain rounded-sm bg-white/10" />
                        ) : (
                            Icons[data.icon] || <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        )}
                    </div>
                    <span className="text-xs font-semibold text-gray-200 uppercase tracking-wider">
                        {data.type || 'Component'}
                    </span>
                </div>
                <button
                    className="text-gray-500 hover:text-red-500 transition-colors"
                    onClick={onDelete}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="p-3 relative">
                {/* Add a colored strip on the left to indicate layer */}
                <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: getBackgroundColor() }}></div>
                <div className="text-sm font-medium text-white text-center pl-2" onDoubleClick={() => setIsEditing(true)}>
                    {isEditing ? (
                        <input
                            type="text"
                            value={label}
                            onChange={handleLabelChange}
                            onBlur={handleLabelBlur}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="w-full bg-[#444444] text-white px-1 rounded outline-none border border-blue-500"
                        />
                    ) : (
                        label
                    )}
                </div>
            </div>

            <Handle type="source" position={Position.Right} id="right" className="w-3 h-3 bg-blue-500" />
            <Handle type="source" position={Position.Bottom} id="bottom" className="w-3 h-3 bg-blue-500" />
        </div>
    );
};

export default CustomNode;
