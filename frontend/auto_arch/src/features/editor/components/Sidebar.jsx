import React, { useState } from "react";
import { Icons } from "./icons";

const categories = [
    {
        name: "Clients",
        items: [
            {
                name: "Mobile",
                items: [
                    { type: "Mobile App", label: "iOS App", color: "bg-purple-600", icon: "Mobile", templateId: "ios" },
                    { type: "Mobile App", label: "Android App", color: "bg-green-600", icon: "Mobile", templateId: "android" },
                ]
            },
            {
                name: "Web",
                items: [
                    { type: "Web App", label: "React App", color: "bg-blue-500", icon: "Web", templateId: "react" },
                    { type: "Web App", label: "Next.js App", color: "bg-black", icon: "Web", templateId: "nextjs" },
                    { type: "SPA", label: "SPA (TypeScript)", color: "bg-blue-400", icon: "Code" },
                ]
            }
        ]
    },
    {
        name: "Infrastructure",
        items: [
            { type: 'group', label: 'Layer Group', icon: 'Group' }, // New Group Item
            { type: 'Kubernetes', label: 'Kubernetes', icon: 'Kubernetes' },
            { type: 'Docker', label: 'Docker', icon: 'Docker' },
            { type: 'Server', label: 'Server', icon: 'Server' },
            { type: 'Cloud', label: 'Cloud', icon: 'Cloud' },
            { type: "Load Balancer", label: "Load Balancer", color: "bg-yellow-500", icon: "Server" },
            { type: "Nginx", label: "Nginx", color: "bg-green-500", icon: "Server" },
            { type: "Apache", label: "Apache", color: "bg-red-500", icon: "Server" },
            { type: "API Gateway", label: "API Gateway", color: "bg-orange-500", icon: "Gateway" },
            { type: "CDN", label: "CDN", color: "bg-cyan-500", icon: "Cloud" },
            { type: "Static Content", label: "Static Content", color: "bg-green-500", icon: "File" },
        ]
    },
    {
        name: "Services",
        items: [
            { type: "Microservice", label: "Microservice", color: "bg-green-600", icon: "Microservice" },
            { type: "Service Discovery", label: "Service Discovery", color: "bg-indigo-500", icon: "Compass" },
            { type: "Management", label: "Management", color: "bg-gray-500", icon: "Settings" },
        ]
    },
    {
        name: "Data & Messaging",
        items: [
            { type: "Database", label: "Database", color: "bg-red-600", icon: "Database" },
            { type: "RabbitMQ/KAFKA", label: "RabbitMQ/KAFKA", color: "bg-blue-800", icon: "Queue" },
            { type: "Logstash", label: "Logstash", color: "bg-yellow-600", icon: "Log" },
            { type: "ELK", label: "ELK Stack", color: "bg-blue-400", icon: "Stack" },
        ]
    },
    {
        name: "Notifications",
        items: [
            { type: "Email", label: "Email", color: "bg-blue-300", icon: "Mail" },
            { type: "SMS", label: "SMS", color: "bg-blue-300", icon: "Chat" },
            { type: "Alerts", label: "Alerts", color: "bg-red-500", icon: "Bell" },
        ]
    }
];

export default function Sidebar({ onLoadTemplate }) {
    const [isOpen, setIsOpen] = useState(true);
    const [expandedCategories, setExpandedCategories] = useState(
        categories.reduce((acc, cat) => ({ ...acc, [cat.name]: true }), {})
    );

    const toggleCategory = (categoryName) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryName]: !prev[categoryName]
        }));
    };

    const onDragStart = (event, nodeType, label, iconKey, color) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.setData("application/reactflow/label", label);
        event.dataTransfer.setData("application/reactflow/icon", iconKey);
        event.dataTransfer.setData("application/reactflow/color", color);
        event.dataTransfer.effectAllowed = "move";
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
                rounded-md border border-[#444444] bg-[#2d2d2d] shadow-sm 
                ${item.templateId ? 'cursor-pointer hover:bg-[#3d3d3d]' : 'cursor-move'}
                hover:border-blue-500 hover:shadow-md transition-all duration-200 
                flex items-center group
                ${isOpen ? 'p-3' : 'p-2 justify-center w-10 h-10'}
            `}
            title={!isOpen ? item.label : ''}
        >
            <div className={`${isOpen ? 'mr-3' : ''} text-gray-400 group-hover:text-blue-400`}>
                {Icons[item.icon]}
            </div>
            {isOpen && <span className="text-gray-200 font-medium text-sm group-hover:text-white truncate">{item.label}</span>}
        </div>
    );

    return (
        <aside
            className={`${isOpen ? 'w-64' : 'w-16'} bg-[#333333] border-r border-[#444444] flex flex-col z-10 text-white transition-all duration-300 ease-in-out relative`}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute -right-3 top-4 bg-[#444444] text-gray-300 rounded-full p-1 hover:bg-blue-600 hover:text-white border border-[#555555] z-50"
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                )}
            </button>

            <div className={`p-4 border-b border-[#444444] ${!isOpen && 'flex justify-center'}`}>
                {isOpen ? (
                    <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Components</h2>
                ) : (
                    <span className="text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </span>
                )}
            </div>

            <div className="p-4 space-y-2 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-600">
                {categories.map((category) => (
                    <div key={category.name} className={!isOpen ? 'flex flex-col items-center mb-4' : 'mb-2'}>
                        {isOpen ? (
                            <button
                                onClick={() => toggleCategory(category.name)}
                                className="w-full flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 hover:text-gray-200 transition-colors"
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
                            <div className="w-8 h-[1px] bg-[#444444] my-2" title={category.name}></div>
                        )}

                        <div className={`
                            space-y-2 
                            ${!isOpen ? 'w-full flex flex-col items-center space-y-4' : ''}
                            ${isOpen && !expandedCategories[category.name] ? 'hidden' : 'block'}
                        `}>
                            {category.items.map((item) => {
                                if (item.items) {
                                    // Nested category (e.g., Mobile, Web)
                                    return (
                                        <div key={item.name} className="pl-2 border-l-2 border-[#444444] ml-1">
                                            <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">{item.name}</h4>
                                            <div className="space-y-2">
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
