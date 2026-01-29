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

    const colorClass = data.color || 'bg-blue-500';
    const colorKey = colorClass.replace(/^bg-/, '').split('-')[0]; // e.g. bg-blue-600 -> blue

    const GRADIENTS = {
        red: 'from-red-600 to-red-400',
        orange: 'from-orange-600 to-orange-400',
        yellow: 'from-yellow-600 to-yellow-400',
        amber: 'from-amber-600 to-amber-400',
        green: 'from-green-600 to-green-400',
        emerald: 'from-emerald-600 to-emerald-400',
        lime: 'from-lime-600 to-lime-400',
        teal: 'from-teal-600 to-teal-400',
        cyan: 'from-cyan-600 to-cyan-400',
        sky: 'from-sky-600 to-sky-400',
        blue: 'from-blue-600 to-blue-400',
        indigo: 'from-indigo-600 to-indigo-400',
        violet: 'from-violet-600 to-violet-400',
        purple: 'from-purple-600 to-purple-400',
        pink: 'from-pink-600 to-pink-400',
        rose: 'from-rose-600 to-rose-400',
        gray: 'from-gray-700 to-gray-500',
        slate: 'from-slate-700 to-slate-500',
        zinc: 'from-zinc-700 to-zinc-500',
        neutral: 'from-neutral-700 to-neutral-500',
        stone: 'from-stone-700 to-stone-500',
        black: 'from-gray-900 to-gray-700',
    };

    const GLOWS = {
        red: 'shadow-red-500/50 border-red-500/50',
        orange: 'shadow-orange-500/50 border-orange-500/50',
        yellow: 'shadow-yellow-500/50 border-yellow-500/50',
        amber: 'shadow-amber-500/50 border-amber-500/50',
        green: 'shadow-green-500/50 border-green-500/50',
        emerald: 'shadow-emerald-500/50 border-emerald-500/50',
        lime: 'shadow-lime-500/50 border-lime-500/50',
        teal: 'shadow-teal-500/50 border-teal-500/50',
        cyan: 'shadow-cyan-500/50 border-cyan-500/50',
        sky: 'shadow-sky-500/50 border-sky-500/50',
        blue: 'shadow-blue-500/50 border-blue-500/50',
        indigo: 'shadow-indigo-500/50 border-indigo-500/50',
        violet: 'shadow-violet-500/50 border-violet-500/50',
        purple: 'shadow-purple-500/50 border-purple-500/50',
        pink: 'shadow-pink-500/50 border-pink-500/50',
        rose: 'shadow-rose-500/50 border-rose-500/50',
        gray: 'shadow-gray-500/50 border-gray-500/50',
        slate: 'shadow-slate-500/50 border-slate-500/50',
        zinc: 'shadow-zinc-500/50 border-zinc-500/50',
        neutral: 'shadow-neutral-500/50 border-neutral-500/50',
        stone: 'shadow-stone-500/50 border-stone-500/50',
        black: 'shadow-gray-700/50 border-gray-700/50',
    };

    const getGradient = () => GRADIENTS[colorKey] || GRADIENTS.blue;
    const getGlowColor = () => GLOWS[colorKey] || GLOWS.blue;
    const BORDER = {
        red: "border-red-400",
        orange: "border-orange-400",
        yellow: "border-yellow-400",
        amber: "border-amber-400",
        green: "border-green-400",
        emerald: "border-emerald-400",
        lime: "border-lime-400",
        teal: "border-teal-400",
        cyan: "border-cyan-400",
        sky: "border-sky-400",
        blue: "border-blue-400",
        indigo: "border-indigo-400",
        violet: "border-violet-400",
        purple: "border-purple-400",
        pink: "border-pink-400",
        rose: "border-rose-400",
        gray: "border-gray-400",
        slate: "border-slate-400",
        zinc: "border-zinc-400",
        neutral: "border-neutral-400",
        stone: "border-stone-400",
        black: "border-gray-500",
    };
    const borderClass = BORDER[colorKey] || BORDER.blue;

    // Apply a strong visible outline when a node was just dropped to make validation obvious
    const justDroppedClass = data && data._justDropped ? 'ring-4 ring-blue-400/60 animate-pulse' : '';
    const errorClass = data && data._error ? 'ring-2 ring-red-400/70' : '';

    return (
        <div className={`
            relative min-w-[180px] rounded-xl transition-all duration-300 group border-2 ${borderClass}
            ${selected ? `shadow-[0_0_30px_rgba(255,255,255,0.1)] scale-105 z-50 ${getGlowColor().split(' ')[0]}` : 'shadow-lg hover:shadow-blue-500/20'}
            ${justDroppedClass} ${errorClass}
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
