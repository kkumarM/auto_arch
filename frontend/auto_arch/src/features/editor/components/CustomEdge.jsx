import React, { useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useReactFlow } from 'reactflow';

export default function CustomEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
}) {
    const { setEdges } = useReactFlow();
    const [isHovered, setIsHovered] = useState(false);
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const onEdgeClick = (evt) => {
        evt.stopPropagation();
        setEdges((edges) => edges.filter((edge) => edge.id !== id));
    };

    return (
        <g
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Invisible wider path for easier interaction */}
            <BaseEdge
                path={edgePath}
                style={{ strokeWidth: 20, stroke: 'transparent', fill: 'none' }}
            />
            {/* Visible path */}
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{ ...style, stroke: isHovered ? '#3b82f6' : '#555' }}
            />

            {isHovered && (
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        fontSize: 12,
                        pointerEvents: 'all',
                    }}
                    className="nodrag nopan flex flex-col items-center"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <button
                        className="w-5 h-5 bg-[#2d2d2d] border border-[#444444] rounded-full text-gray-400 hover:text-red-500 hover:border-red-500 flex items-center justify-center text-xs transition-colors shadow-sm mb-1"
                        onClick={onEdgeClick}
                        aria-label="Delete Edge"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* TLS Lock Icon - Always visible if TLS is enabled */}
            {data?.tls && (
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            pointerEvents: 'none', // Don't block clicks
                        }}
                        className="nodrag nopan"
                    >
                        <div className="bg-[#2d2d2d] p-1 rounded-full border border-green-500 shadow-sm" title="TLS Encrypted">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </EdgeLabelRenderer>
            )}
        </g>
    );
}
