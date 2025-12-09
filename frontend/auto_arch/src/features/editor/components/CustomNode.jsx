import React, { useState, useEffect } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Icons } from './icons';

const CustomNode = ({ id, data }) => {
    const { setNodes } = useReactFlow();
    const [isEditing, setIsEditing] = useState(false);
    const [label, setLabel] = useState(data.label);

    useEffect(() => {
        setLabel(data.label);
    }, [data.label]);

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

    return (
        <div className="shadow-md rounded-md bg-[#2d2d2d] border border-[#444444] min-w-[150px] group hover:border-blue-500 transition-colors relative">
            {/* Handles */}
            <Handle type="target" position={Position.Top} id="top" className="w-3 h-3 bg-blue-500" />
            <Handle type="target" position={Position.Left} id="left" className="w-3 h-3 bg-blue-500" />

            <div
                className="flex items-center justify-between px-3 py-2 border-b border-[#444444] rounded-t-md"
                style={{ backgroundColor: data.color ? data.color.replace('bg-', '').replace('-600', '').replace('-500', '') : '#333333' }}
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
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${data.color || 'bg-gray-500'}`}></div>
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
