import React, { useState } from "react";
import { Icons } from "./icons";

const mobileCategories = [
    {
        name: "Infrastructure",
        items: [
            { type: 'Cloud', label: 'Cloud Provider', icon: 'Cloud' },
            { type: "API Gateway", label: "API Gateway", color: "bg-orange-500", icon: "Gateway" },
            { type: "CDN", label: "CDN", color: "bg-cyan-500", icon: "Cloud" },
            { type: "Firebase", label: "Firebase", color: "bg-yellow-500", icon: "Cloud" },
        ]
    },
    {
        name: "Backend Services",
        items: [
            { type: "Microservice", label: "Microservice", color: "bg-green-600", icon: "Microservice" },
            { type: "Database", label: "Database", color: "bg-red-600", icon: "Database" },
            { type: "Auth Service", label: "Auth Service", color: "bg-blue-500", icon: "Key" },
        ]
    }
];

const webCategories = [
    {
        name: "Infrastructure",
        items: [
            { type: "Load Balancer", label: "Load Balancer", color: "bg-blue-500", icon: "LoadBalancer" },
            { type: "Nginx", label: "Nginx", color: "bg-green-500", icon: "Nginx" },
            { type: "Docker", label: "Docker Container", icon: "Docker" },
            { type: "Kubernetes", label: "Kubernetes Cluster", icon: "Kubernetes" },
        ]
    },
    {
        name: "Backend Services",
        items: [
            { type: "Microservice", label: "Microservice", color: "bg-blue-400", icon: "Microservice" },
            { type: "Database", label: "Database", color: "bg-blue-600", icon: "Database" },
            { type: "Redis", label: "Redis Cache", color: "bg-red-500", icon: "Redis" },
            { type: "RabbitMQ/KAFKA", label: "Message Queue", color: "bg-blue-800", icon: "Queue" },
        ]
    }
];

export default function Sidebar({ onLoadTemplate, projectType, onDragStart: externalOnDragStart }) {
    const categories = projectType === 'mobile' ? mobileCategories : webCategories;

    const [isOpen, setIsOpen] = useState(true);
    const [expandedCategories, setExpandedCategories] = useState({});

    // Initialize expanded state when categories change
    React.useEffect(() => {
        setExpandedCategories(
            categories.reduce((acc, cat) => ({ ...acc, [cat.name]: true }), {})
        );
    }, [categories]);

    const toggleCategory = (categoryName) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryName]: !prev[categoryName]
        }));
    };

    const localOnDragStart = (event, nodeType, label, iconKey, color) => {
        console.debug('[Sidebar] dragstart', { nodeType, label, iconKey, color });
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.setData("application/reactflow/label", label);
        if (iconKey) event.dataTransfer.setData("application/reactflow/icon", iconKey);
        if (color) event.dataTransfer.setData("application/reactflow/color", color);
        event.dataTransfer.effectAllowed = "move";
        try {
            // Set a transparent drag image so browsers show a consistent ghost
            const img = document.createElement('img');
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3C/svg%3E';
            document.body.appendChild(img);
            event.dataTransfer.setDragImage(img, 0, 0);
            setTimeout(() => img.remove(), 0);
        } catch (e) {
            // ignore
        }
    };

    const onDragStart = (event, nodeType, label, iconKey, color) => {
        if (typeof externalOnDragStart === 'function') {
            // External handler signature used elsewhere: (event, nodeType, color, icon)
            try {
                externalOnDragStart(event, nodeType, color, iconKey);
                return;
            } catch (e) {
                // fallback to local handler
            }
        }
        localOnDragStart(event, nodeType, label, iconKey, color);
    };

    const handleItemClick = (item) => {
        if (item.templateId && onLoadTemplate) {
            onLoadTemplate(item.templateId);
        }
    };

    const renderItem = (item) => (
        <div
            key={item.label}
            draggable={!item.templateId}
            onDragStart={(event) => !item.templateId && onDragStart(event, item.type, item.label, item.icon, item.color)}
            onClick={() => handleItemClick(item)}
            className={`
                group relative flex items-center px-4 py-3 mb-3 rounded-lg cursor-grab active:cursor-grabbing
                border border-transparent hover:border-blue-500/20 hover:bg-white/4 transition-all duration-200
                ${item.templateId ? 'cursor-pointer' : ''}
            `}
            title={!isOpen ? item.label : ''}
        >
            {/* left accent for active/hover */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1 h-10 rounded-r-md bg-transparent group-hover:bg-blue-500/90 transition-all" />

            <div className={`
                flex items-center justify-center w-10 h-10 rounded-md mr-3 flex-shrink-0
                ${item.color ? item.color : 'bg-[#1e293b]'} text-white/90
                shadow-[inset_0_-6px_18px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-all duration-200
            `}>
                <div className="w-6 h-6 flex items-center justify-center">
                    {Icons[item.icon]}
                </div>
            </div>
            {isOpen && (
                <span className="text-gray-200 text-sm font-medium group-hover:text-white transition-colors">
                    {item.label}
                </span>
            )}
        </div>
    );

    return (
        <aside
            className={`${isOpen ? 'w-72' : 'w-20'} bg-[#0f172a] border-r border-white/10 flex flex-col z-20 transition-all duration-300 ease-in-out relative shadow-2xl`}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute -right-3 top-6 bg-[#1e293b] text-gray-400 rounded-full p-1.5 hover:text-white hover:bg-blue-600 border border-white/10 shadow-lg z-50 transition-all"
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                )}
            </button>

            <div className={`p-6 border-b border-white/5 ${!isOpen && 'flex justify-center px-2'}`}>
                {isOpen ? (
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                        <h2 className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em]">Components</h2>
                    </div>
                ) : (
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                )}
            </div>

            <div className="p-4 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {categories.map((category) => (
                    <div key={category.name} className="mb-6">
                        {isOpen ? (
                            <button
                                onClick={() => toggleCategory(category.name)}
                                className="w-full flex items-center justify-between text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3 px-2 hover:text-gray-300 transition-colors"
                            >
                                <span>{category.name}</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-3 w-3 transition-transform duration-200 ${expandedCategories[category.name] ? 'transform rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        ) : (
                            <div className="w-full h-[1px] bg-white/5 my-4"></div>
                        )}

                        <div className={`
                            ${isOpen && !expandedCategories[category.name] ? 'hidden' : 'block'}
                        `}>
                            {category.items.map((item) => {
                                if (item.items) {
                                    return (
                                        <div key={item.name} className="pl-2 border-l border-white/5 ml-2 mt-2">
                                            <h4 className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-2 pl-2">{item.name}</h4>
                                            <div className="space-y-1">
                                                {item.items.map(subItem => renderItem(subItem))}
                                            </div>
                                        </div>
                                    );
                                }
                                return renderItem(item);
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}
