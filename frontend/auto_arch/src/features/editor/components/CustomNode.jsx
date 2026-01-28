import React, { useState, useEffect } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Icons } from './icons';

// colorMap removed (unused) — gradients are derived from color class names

const CustomNode = ({ id, data, selected }) => {
    const { setNodes } = useReactFlow();
    const [isEditing, setIsEditing] = useState(false);
    const [label, setLabel] = useState(data.label);

    useEffect(() => {
        setLabel(data.label);
    }, [data.label, data]);

    const onDelete = (e) => {
        e.stopPropagation(); // Prevent node selection when clicking delete
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

    // Helper to get gradient based on color class
    const getGradient = () => {
        const color = data.color || 'bg-blue-500';
        // Map common tailwind colors to gradients
        if (color.includes('black')) return 'from-gray-800 to-gray-600';
        if (color.includes('red')) return 'from-red-600 to-red-400';
        if (color.includes('green')) return 'from-green-600 to-green-400';
        if (color.includes('yellow')) return 'from-yellow-600 to-yellow-400';
        if (color.includes('orange')) return 'from-orange-600 to-orange-400';
        if (color.includes('purple')) return 'from-purple-600 to-purple-400';
        if (color.includes('pink')) return 'from-pink-600 to-pink-400';
        if (color.includes('cyan')) return 'from-cyan-600 to-cyan-400';
        if (color.includes('teal')) return 'from-teal-600 to-teal-400';
        if (color.includes('indigo')) return 'from-indigo-600 to-indigo-400';
        if (color.includes('gray') || color.includes('slate')) return 'from-gray-600 to-gray-400';
        return 'from-blue-600 to-blue-400'; // Default
    };

    const getGlowColor = () => {
        const color = data.color || 'bg-blue-500';
        if (color.includes('red')) return 'shadow-red-500/50 border-red-500/50';
        if (color.includes('green')) return 'shadow-green-500/50 border-green-500/50';
        if (color.includes('yellow')) return 'shadow-yellow-500/50 border-yellow-500/50';
        if (color.includes('orange')) return 'shadow-orange-500/50 border-orange-500/50';
        if (color.includes('purple')) return 'shadow-purple-500/50 border-purple-500/50';
        return 'shadow-blue-500/50 border-blue-500/50';
    };

    // Apply a strong visible outline when a node was just dropped to make validation obvious
    const justDroppedClass = data && data._justDropped ? 'ring-4 ring-blue-400/60 animate-pulse' : '';

    return (
        <div className={`
            relative min-w-[180px] rounded-xl transition-all duration-300 group
            ${selected ? `shadow-[0_0_30px_rgba(255,255,255,0.1)] scale-105 z-50 ${getGlowColor().split(' ')[0]}` : 'shadow-lg hover:shadow-blue-500/20'}
            ${justDroppedClass}
        `}>
            {/* Glassmorphic Background */}
            <div className={`absolute inset-0 bg-[#1e293b]/90 backdrop-blur-xl rounded-xl border overflow-hidden ${selected ? 'border-blue-400' : 'border-white/10'}`}>
                {/* Gradient Header */}
                <div className={`
                    h-14 w-full bg-gradient-to-r ${getGradient()}
                    flex items-center justify-between px-4
                    border-b border-white/10
                `}>
                    <div className="flex items-center text-white font-bold tracking-wide text-sm uppercase">
                        {data.customIcon ? (
                            <img src={data.customIcon} alt="icon" className="w-4 h-4 mr-2 object-contain" />
                        ) : (
                            <span className="mr-2 opacity-90">{Icons[data.icon]}</span>
                        )}
                        {data.type || 'Component'}
                    </div>

                    <button
                        className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                        onClick={onDelete}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 bg-gradient-to-b from-transparent to-black/20">
                    <div className="text-center" onDoubleClick={() => setIsEditing(true)}>
                        {isEditing ? (
                            <input
                                type="text"
                                value={label}
                                onChange={handleLabelChange}
                                onBlur={handleLabelBlur}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                className="w-full bg-black/30 text-white px-2 py-1 rounded outline-none border border-blue-500/50 text-center text-lg font-medium"
                            />
                        ) : (
                            <div className="text-lg font-semibold text-white/95 drop-shadow-md">
                                {label}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Selection Glow Border (Outer) */}
            {selected && (
                <div className="absolute -inset-[1px] rounded-xl bg-blue-500 opacity-50 blur-sm -z-10"></div>
            )}

            {/* Handles - Custom Styled */}
            <Handle
                type="target"
                position={Position.Top}
                id="top"
                className="!w-3 !h-3 !bg-white !border-2 !border-blue-500 !shadow-[0_0_10px_rgba(59,130,246,0.8)] hover:!scale-125 transition-transform"
            />
            <Handle
                type="target"
                position={Position.Left}
                id="left"
                className="!w-3 !h-3 !bg-white !border-2 !border-blue-500 !shadow-[0_0_10px_rgba(59,130,246,0.8)] hover:!scale-125 transition-transform"
            />
            <Handle
                type="source"
                position={Position.Right}
                id="right"
                className="!w-3 !h-3 !bg-white !border-2 !border-blue-500 !shadow-[0_0_10px_rgba(59,130,246,0.8)] hover:!scale-125 transition-transform"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="bottom"
                className="!w-3 !h-3 !bg-white !border-2 !border-blue-500 !shadow-[0_0_10px_rgba(59,130,246,0.8)] hover:!scale-125 transition-transform"
            />
        </div>
    );
};

export default CustomNode;
