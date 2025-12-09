import React, { memo } from 'react';
import { NodeResizer } from 'reactflow';

const GroupNode = ({ data, selected }) => {
    return (
        <>
            <NodeResizer
                minWidth={100}
                minHeight={100}
                isVisible={selected}
                lineClassName="border-blue-500"
                handleClassName="h-3 w-3 bg-white border-2 border-blue-500 rounded"
            />
            <div
                className={`h-full w-full rounded-md border-2 border-dashed transition-colors ${selected ? 'border-blue-500 bg-blue-500/5' : 'border-gray-600 bg-gray-800/20'
                    }`}
                style={{
                    backgroundColor: data.color ? data.color.replace('bg-', '').replace('-600', '20').replace('-500', '20') : undefined // Hacky opacity
                }}
            >
                <div className="absolute -top-7 left-0 px-2 py-1 bg-[#2d2d2d] border border-gray-600 rounded-t-md text-xs font-bold text-gray-300 uppercase tracking-wider">
                    {data.label}
                </div>
            </div>
        </>
    );
};

export default memo(GroupNode);
