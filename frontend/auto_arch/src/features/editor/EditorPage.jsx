import React, { useState, useRef } from 'react';
// Force update
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import PropertiesPanel from "./components/PropertiesPanel";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ui/Button";
import { generateCode, generateFromPrompt } from "../../lib/api";

export default function EditorPage({ projectConfig, onBack }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);
    const [projectName, setProjectName] = useState(projectConfig?.name || 'my-awesome-project');
    const canvasRef = useRef(null);

    // Auto-load template or generate from AI
    React.useEffect(() => {
        if (!projectConfig || !canvasRef.current) return;

        const initProject = async () => {
            if (projectConfig.mode === 'template' && projectConfig.templateId) {
                // Load Template
                setTimeout(() => {
                    canvasRef.current.loadTemplate(projectConfig.templateId);
                }, 100);
            } else if (projectConfig.mode === 'ai' && projectConfig.description) {
                // Generate from AI
                setIsGenerating(true);
                try {
                    const diagram = await generateFromPrompt(projectConfig.description, projectConfig.projectType);
                    setTimeout(() => {
                        canvasRef.current.loadDiagram(diagram);
                    }, 100);
                } catch (error) {
                    console.error("AI Generation Error:", error);
                    alert("Failed to generate architecture from prompt.");
                } finally {
                    setIsGenerating(false);
                }
            } else if (projectConfig.mode === 'scratch') {
                // Auto-create root node based on platform
                const rootNode = {
                    id: 'root',
                    type: 'custom',
                    position: { x: 250, y: 50 },
                    data: {
                        label: projectConfig.projectType === 'mobile'
                            ? (projectConfig.platform === 'android' ? 'Android App' : 'iOS App')
                            : 'Web App',
                        type: projectConfig.projectType === 'mobile' ? 'Mobile App' : 'Web App',
                        icon: projectConfig.projectType === 'mobile' ? 'Mobile' : 'Web',
                        color: projectConfig.projectType === 'mobile'
                            ? (projectConfig.platform === 'android' ? 'bg-green-600' : 'bg-purple-600')
                            : 'bg-blue-500'
                    }
                };

                setTimeout(() => {
                    canvasRef.current.loadDiagram({ nodes: [rootNode], edges: [] });
                }, 100);
            }
        };

        initProject();
    }, [projectConfig]);

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
                        <button
                            onClick={onBack}
                            className="mr-4 text-gray-400 hover:text-white transition-colors flex items-center"
                            title="Back to Project Selection"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
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
                <Sidebar
                    projectType={projectConfig?.projectType}
                    onDragStart={(event, nodeType, color, icon) => {
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
