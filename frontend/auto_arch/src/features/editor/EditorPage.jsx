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
        console.log('[EditorPage] useEffect triggered', { projectConfig, hasCanvasRef: !!canvasRef.current });
        if (!projectConfig || !canvasRef.current) return;

        const initProject = async () => {
            if (projectConfig.mode === 'template' && projectConfig.templateId) {
                // Load Template
                console.log('[EditorPage] Loading template:', projectConfig.templateId);
                setTimeout(() => {
                    console.log('[EditorPage] Calling loadTemplate on canvasRef');
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
                        <div className="flex items-center mr-8">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h1 className="text-xl font-bold text-white tracking-tight">AutoArch</h1>
                        </div>

                        <div className="h-6 w-[1px] bg-white/10 mx-4"></div>

                        <div className="relative group">
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                className="bg-transparent border border-transparent hover:border-white/10 focus:border-blue-500/50 text-gray-300 text-sm rounded-md px-3 py-1.5 focus:text-white outline-none transition-all w-64 placeholder-gray-600"
                                placeholder="Project Name"
                            />
                            <div className="absolute inset-0 rounded-md bg-white/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onBack}
                            className="text-gray-500 hover:text-white transition-colors text-sm font-medium"
                        >
                            Back
                        </button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleGenerateCode}
                            isLoading={isGenerating}
                            className="bg-blue-600 hover:bg-blue-500 text-white border-none shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all px-6"
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
                    onLoadTemplate={handleLoadTemplate} />

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
