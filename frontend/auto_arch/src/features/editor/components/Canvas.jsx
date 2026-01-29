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
import { normalizeTemplateGraph } from "../utils/normalizeTemplate";

const nodeTypes = {
    custom: CustomNode,
    group: GroupNode,
};

const edgeTypes = {
    custom: CustomEdge,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

const Canvas = forwardRef(({ onNodeSelect, selectedNodeId, errorNodeIds = [] }, ref) => {
    const initialNodes = [];
    const initialEdges = [];

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = React.useState(null);
    const [templateApplied, setTemplateApplied] = React.useState(false);

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
        getDiagram: () => {
            if (!reactFlowInstance) return { nodes: [], edges: [] };
            return reactFlowInstance.toObject();
        },
        loadTemplate: async (templateId) => {
            try {
                const template = await api.getTemplate(templateId);
                const { nodes: normNodes, edges: normEdges } = normalizeTemplateGraph(template.nodes, template.edges);
                setNodes(normNodes);
                setEdges(normEdges);
                if (process.env.NODE_ENV !== "production") {
                    console.debug("[Template] applied", { nodes: normNodes.length, edges: normEdges.length });
                }
                setTemplateApplied(true);
            } catch (error) {
                console.error("Error loading template:", error);
                alert(`Error loading template: ${error.message}`);
            }
        },
        loadDiagram: (diagram) => {
            if (!diagram) return;
            const { nodes: normNodes, edges: normEdges } = normalizeTemplateGraph(diagram.nodes, diagram.edges);
            setNodes(normNodes);
            setEdges(normEdges);
            if (process.env.NODE_ENV !== "production") {
                console.debug("[Diagram] loaded", { nodes: normNodes.length, edges: normEdges.length });
            }
            setTemplateApplied(true);
        },
        applyTemplateGraph: (graph) => {
            const { nodes: normNodes, edges: normEdges } = normalizeTemplateGraph(graph.nodes, graph.edges);
            setNodes(normNodes);
            setEdges(normEdges);
            if (process.env.NODE_ENV !== "production") {
                console.debug("[Template] applied (local)", { nodes: normNodes.length, edges: normEdges.length });
            }
            setTemplateApplied(true);
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
        },
        selectNodeById: (nodeId) => {
            let target = null;
            setNodes((nds) => {
                const next = nds.map((n) => {
                    const isSel = n.id === nodeId;
                    if (isSel) target = { ...n, selected: true };
                    return { ...n, selected: isSel };
                });
                return next;
            });
            if (target && onNodeSelect) {
                // Defer to avoid setState during render warnings
                queueMicrotask(() => onNodeSelect(target));
            }
        },
        fitViewNow: () => {
            if (reactFlowInstance) {
                reactFlowInstance.setViewport({ x: 0, y: 0, zoom: 1 });
                reactFlowInstance.fitView({ padding: 0.2, duration: 300 });
            }
        },
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
            const draggedType = event.dataTransfer.getData("application/reactflow");
            const label = event.dataTransfer.getData("application/reactflow/label");
            const icon = event.dataTransfer.getData("application/reactflow/icon");
            const color = event.dataTransfer.getData("application/reactflow/color");

            // Check if the dropped element is valid
            if (typeof draggedType === "undefined" || !draggedType) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });

            const isGroup = draggedType === 'group';
            const nodeRendererType = isGroup ? 'group' : 'custom';

            const newNode = {
                id: getId(),
                type: nodeRendererType,
                position,
                data: {
                    label: label || draggedType,
                    type: draggedType,
                    icon: icon,
                    color: color,
                },
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

    // Run fitView after template apply when nodes have been set
    React.useEffect(() => {
        if (!templateApplied || !reactFlowInstance) return;
        const raf = requestAnimationFrame(() => {
            reactFlowInstance.setViewport({ x: 0, y: 0, zoom: 1 });
            reactFlowInstance.fitView({ padding: 0.2, duration: 300 });
        });
        setTemplateApplied(false);
        return () => cancelAnimationFrame(raf);
    }, [templateApplied, reactFlowInstance]);

    // Highlight nodes with validation errors
    React.useEffect(() => {
        if (!errorNodeIds || errorNodeIds.length === 0) {
            setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, _error: false } })));
            return;
        }
        setNodes((nds) =>
            nds.map((n) => ({
                ...n,
                data: { ...n.data, _error: errorNodeIds.includes(n.id) },
            }))
        );
    }, [errorNodeIds, setNodes]);

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

            {process.env.NODE_ENV !== "production" && (
                <div className="absolute bottom-3 left-3 bg-black/50 text-gray-300 text-xs px-3 py-1 rounded border border-white/10 pointer-events-none">
                    Nodes: {nodes.length} • Edges: {edges.length}
                </div>
            )}
        </div>
    );
});

export default Canvas;
