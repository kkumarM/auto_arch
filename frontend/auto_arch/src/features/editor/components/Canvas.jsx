import React, { useCallback, useRef, useState, useMemo, useImperativeHandle, forwardRef } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    Background,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';
import GroupNode from './GroupNode';
import { api } from "../../../lib/api";

const nodeTypes = {
    custom: CustomNode,
    group: GroupNode,
};

const edgeTypes = {
    custom: CustomEdge,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

const Canvas = forwardRef(({ onNodeSelect, selectedNodeId }, ref) => {
    const initialNodes = [];
    const initialEdges = [];

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = React.useState(null);

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
        getDiagram: () => {
            if (!reactFlowInstance) return { nodes: [], edges: [] };
            return reactFlowInstance.toObject();
        },
        loadTemplate: async (templateId) => {
            try {
                const template = await api.getTemplate(templateId);
                setNodes(template.nodes || []);
                setEdges(template.edges || []);
            } catch (error) {
                console.error("Error loading template:", error);
                alert(`Error loading template: ${error.message}`);
            }
        },
        updateNodeData: (nodeId, newData) => {
            setNodes((nds) =>
                nds.map((node) => {
                    if (node.id === nodeId) {
                        return { ...node, data: { ...node.data, ...newData } };
                    }
                    return node;
                })
            );
        },
        updateEdgeData: (edgeId, newData) => {
            setEdges((eds) =>
                eds.map((edge) => {
                    if (edge.id === edgeId) {
                        return { ...edge, data: { ...edge.data, ...newData } };
                    }
                    return edge;
                })
            );
        },
        deleteElement: (id) => {
            setNodes((nds) => nds.filter((n) => n.id !== id));
            setEdges((eds) => eds.filter((e) => e.id !== id));
        }
    }));

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    // Handle drop event from sidebar
    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const reactFlowBounds = event.currentTarget.getBoundingClientRect();
            const type = event.dataTransfer.getData("application/reactflow");
            const label = event.dataTransfer.getData("application/reactflow/label");
            const icon = event.dataTransfer.getData("application/reactflow/icon");
            const color = event.dataTransfer.getData("application/reactflow/color");

            // Check if the dropped element is valid
            if (typeof type === "undefined" || !type) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });

            const isGroup = type === 'group';
            const newNode = {
                id: getId(),
                type: type,
                position,
                data: { label: label || type, type: type, icon: icon, color: color },
                style: isGroup ? { width: 300, height: 200, zIndex: -1 } : undefined, // Default size and z-index for groups
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, setNodes],
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onNodeClick = useCallback((event, node) => {
        if (onNodeSelect) {
            onNodeSelect(node); // Pass the whole node object
        }
    }, [onNodeSelect]);

    const onEdgeClick = useCallback((event, edge) => {
        if (onNodeSelect) {
            onNodeSelect(edge); // Reuse onNodeSelect for edges too, or rename prop to onElementSelect
        }
    }, [onNodeSelect]);

    const onPaneClick = useCallback(() => {
        if (onNodeSelect) {
            onNodeSelect(null);
        }
    }, [onNodeSelect]);

    return (
        <div className="flex-grow h-full relative bg-[#2d2d2d]">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeClick={onNodeClick}
                onEdgeClick={onEdgeClick}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                defaultEdgeOptions={{ type: 'custom' }}
                fitView
                className="bg-[#1a1a1a]"
            >
                <Background color="#444444" gap={16} />
                <Controls className="bg-[#333333] border border-[#444444] shadow-sm rounded-md fill-white text-white [&>button]:!border-[#444444] [&>button]:!bg-[#333333] [&>button:hover]:!bg-[#444444] [&>button]:!fill-gray-200" />
            </ReactFlow>
        </div>
    );
});

export default Canvas;
