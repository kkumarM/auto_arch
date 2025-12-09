import React, { useState, useRef } from 'react';
// Force update
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import PropertiesPanel from "./components/PropertiesPanel";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ui/Button";
import { generateCode } from "../../lib/api";

export default function EditorPage() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);
    const [projectName, setProjectName] = useState('my-awesome-project');
    const canvasRef = useRef(null);

    const handleElementUpdate = (updatedElement) => {
        setSelectedNode(updatedElement);
        if (canvasRef.current) {
            if (updatedElement.source) {
                // It's an edge
                canvasRef.current.updateEdgeData(updatedElement.id, updatedElement.data);
            } else {
                // It's a node
                canvasRef.current.updateNodeData(updatedElement.id, updatedElement.data);
            }
        }
    };

    const handleDeleteElement = () => {
        if (selectedNode && canvasRef.current) {
            canvasRef.current.deleteElement(selectedNode.id);
            setSelectedNode(null);
        }
    };

    const handleGenerateCode = async () => {
        if (!canvasRef.current) return;
        setIsGenerating(true);
        try {
            const diagram = canvasRef.current.getDiagram();
            // Pass project name
            const response = await generateCode({ ...diagram, project_name: projectName });
            alert(`Code generated successfully at: ${response.path}`);
        } catch (error) {
            console.error("Error generating code:", error);
            alert("Failed to generate code. See console for details.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleLoadTemplate = (templateId) => {
        if (canvasRef.current) {
            canvasRef.current.loadTemplate(templateId);
        }
    };

    return (
        <MainLayout
            header={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-gray-200 mr-4">AutoArch</h1>
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="bg-[#2d2d2d] border border-[#444444] text-gray-300 text-sm rounded px-2 py-1 focus:border-blue-500 outline-none transition-colors w-48"
                            placeholder="Project Name"
                        />
                    </div>
                    <div className="flex space-x-2">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleGenerateCode}
                            isLoading={isGenerating}
                            className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                        >
                            Generate Code
                        </Button>
                    </div>
                </div>
            }
        >
            <div className="flex h-full overflow-hidden">
                <Sidebar onDragStart={(event, nodeType, color, icon) => {
                    event.dataTransfer.setData("application/reactflow", nodeType);
                    event.dataTransfer.setData("application/reactflow/label", nodeType); // Default label
                    if (color) event.dataTransfer.setData("application/reactflow/color", color);
                    if (icon) event.dataTransfer.setData("application/reactflow/icon", icon);
                    event.dataTransfer.effectAllowed = "move";
                }} onLoadTemplate={handleLoadTemplate} />

                <div className="flex-grow relative">
                    <Canvas
                        ref={canvasRef}
                        onNodeSelect={setSelectedNode}
                        selectedNodeId={selectedNode?.id}
                    />
                </div>

                {selectedNode && (
                    <PropertiesPanel
                        selectedNode={selectedNode}
                        onChange={handleElementUpdate}
                        onDelete={handleDeleteElement}
                        onClose={() => setSelectedNode(null)}
                    />
                )}
            </div>
        </MainLayout>
    );
}
