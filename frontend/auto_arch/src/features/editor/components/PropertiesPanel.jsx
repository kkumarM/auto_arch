import React, { useState, useEffect } from 'react';
import { Icons } from './icons';

const COLORS = [
    { name: 'Blue', value: 'bg-blue-600' },
    { name: 'Green', value: 'bg-green-600' },
    { name: 'Red', value: 'bg-red-600' },
    { name: 'Purple', value: 'bg-purple-600' },
    { name: 'Orange', value: 'bg-orange-500' },
    { name: 'Gray', value: 'bg-gray-500' },
    { name: 'Teal', value: 'bg-teal-600' },
    { name: 'Indigo', value: 'bg-indigo-600' },
];

const PropertiesPanel = ({ selectedNode, onChange, onDelete, onClose }) => {
    const [label, setLabel] = useState('');
    const [type, setType] = useState('');
    const [color, setColor] = useState('');
    const [icon, setIcon] = useState('');
    const [port, setPort] = useState('');
    const [dbName, setDbName] = useState('');
    const [certMode, setCertMode] = useState('upload'); // 'upload' or 'generate'

    useEffect(() => {
        if (selectedNode) {
            const data = selectedNode.data || {};
            setLabel(data.label || '');
            setType(data.type || '');
            setColor(data.color || 'bg-blue-600');
            setIcon(data.icon || '');
            setPort(data.port || '');
            setDbName(data.dbName || '');
        }
    }, [selectedNode]);

    const handleChange = (field, value) => {
        // Update local state
        if (field === 'label') setLabel(value);
        if (field === 'type') setType(value);
        if (field === 'color') setColor(value);
        if (field === 'icon') setIcon(value);
        if (field === 'port') setPort(value);
        if (field === 'dbName') setDbName(value);

        // Propagate change to parent
        onChange({
            ...selectedNode,
            data: {
                ...(selectedNode.data || {}),
                [field]: value
            }
        });
    };

    if (!selectedNode) return null;

    const isEdge = !!selectedNode.source;

    if (isEdge) {
        return (
            <div className="w-80 bg-[#2d2d2d] border-l border-[#444444] flex flex-col h-full shadow-xl z-10">
                <div className="p-4 border-b border-[#444444] flex justify-between items-center bg-[#333333]">
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Connection</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                <div className="p-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Security</h3>
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            id="tls"
                            checked={selectedNode.data?.tls || false}
                            onChange={(e) => handleChange('tls', e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="tls" className="text-sm text-white">Enable TLS/SSL</label>
                    </div>

                    {selectedNode.data?.tls && (
                        <div className="space-y-4 pl-4 border-l border-[#444444] ml-1">
                            {/* TLS Version */}
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">TLS Version</label>
                                <select
                                    value={selectedNode.data?.tlsVersion || 'Auto'}
                                    onChange={(e) => handleChange('tlsVersion', e.target.value)}
                                    className="w-full bg-[#1a1a1a] border border-[#444444] rounded px-2 py-1.5 text-sm text-white focus:border-blue-500 outline-none transition-colors appearance-none"
                                >
                                    <option value="Auto">Auto</option>
                                    <option value="TLS 1.2">TLS 1.2</option>
                                    <option value="TLS 1.3">TLS 1.3</option>
                                </select>
                            </div>

                            {/* Certificates */}
                            <div>
                                <label className="block text-xs text-gray-400 mb-2">Certificates</label>

                                {/* Mode Selection */}
                                <div className="flex space-x-4 mb-3">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="certMode"
                                            value="upload"
                                            checked={certMode === 'upload'}
                                            onChange={() => setCertMode('upload')}
                                            className="mr-1.5 text-blue-500 focus:ring-blue-500 bg-[#1a1a1a] border-[#444444]"
                                        />
                                        <span className="text-xs text-gray-300">Upload</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="certMode"
                                            value="generate"
                                            checked={certMode === 'generate'}
                                            onChange={() => setCertMode('generate')}
                                            className="mr-1.5 text-blue-500 focus:ring-blue-500 bg-[#1a1a1a] border-[#444444]"
                                        />
                                        <span className="text-xs text-gray-300">Generate</span>
                                    </label>
                                </div>

                                {certMode === 'upload' ? (
                                    <>
                                        {/* Server Cert */}
                                        <div className="mb-2">
                                            <span className="text-[10px] text-gray-500 uppercase block mb-1">Server Certificate (.crt)</span>
                                            <input type="file" className="w-full text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#444444] file:text-white hover:file:bg-[#555555]" />
                                        </div>

                                        {/* Private Key */}
                                        <div className="mb-2">
                                            <span className="text-[10px] text-gray-500 uppercase block mb-1">Private Key (.key)</span>
                                            <input type="file" className="w-full text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#444444] file:text-white hover:file:bg-[#555555]" />
                                        </div>

                                        {/* CA Cert */}
                                        <div className="mb-3">
                                            <span className="text-[10px] text-gray-500 uppercase block mb-1">CA Certificate (.pem)</span>
                                            <input type="file" className="w-full text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#444444] file:text-white hover:file:bg-[#555555]" />
                                        </div>
                                    </>
                                ) : (
                                    /* Generate Button */
                                    <button
                                        onClick={() => {
                                            // Mock generation
                                            handleChange('tlsCert', 'generated-cert.crt');
                                            handleChange('tlsKey', 'generated-key.key');
                                            alert('Self-signed certificate generated successfully!');
                                        }}
                                        className="w-full bg-[#444444] hover:bg-[#555555] text-white py-1.5 rounded text-xs transition-colors border border-[#555555]"
                                    >
                                        Generate Self-Signed Cert
                                    </button>
                                )}

                                {(selectedNode.data?.tlsCert || selectedNode.data?.tlsKey) && (
                                    <div className="mt-2 text-xs text-green-400 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Certificates Configured
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <p className="text-xs text-gray-500 mt-4">
                        Enabling TLS indicates a secure, encrypted connection between these components.
                    </p>
                </div>

                <div className="mt-auto p-4 border-t border-[#444444]">
                    <button
                        onClick={onDelete}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-medium transition-colors flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Delete Connection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-80 bg-[#2d2d2d] border-l border-[#444444] flex flex-col h-full shadow-xl z-10">
            <div className="p-4 border-b border-[#444444] flex justify-between items-center bg-[#333333]">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Properties</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-6">
                {/* General Section */}
                <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">General</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Label</label>
                            <input
                                type="text"
                                value={label}
                                onChange={(e) => handleChange('label', e.target.value)}
                                className="w-full bg-[#1a1a1a] border border-[#444444] rounded px-2 py-1.5 text-sm text-white focus:border-blue-500 outline-none transition-colors"
                            />
                        </div>
                        {selectedNode.type !== 'group' && (
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Type</label>
                                <input
                                    type="text"
                                    value={type}
                                    onChange={(e) => handleChange('type', e.target.value)}
                                    className="w-full bg-[#1a1a1a] border border-[#444444] rounded px-2 py-1.5 text-sm text-white focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Visuals Section */}
                <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Visuals</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Color</label>
                            <div className="grid grid-cols-4 gap-2">
                                {COLORS.map((c) => (
                                    <button
                                        key={c.value}
                                        onClick={() => handleChange('color', c.value)}
                                        className={`h-8 rounded border-2 transition-all ${color === c.value ? 'border-white scale-110' : 'border-transparent hover:border-gray-500'}`}
                                        style={{ backgroundColor: c.value.replace('bg-', '').replace('-600', '').replace('-500', '') }} // Hacky color mapping
                                        title={c.name}
                                    >
                                        {/* Use a real div for color if the class doesn't work directly in style */}
                                        <div className={`w-full h-full rounded ${c.value}`}></div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        {selectedNode.type !== 'group' && (
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Icon</label>
                                <select
                                    value={icon}
                                    onChange={(e) => handleChange('icon', e.target.value)}
                                    className="w-full bg-[#1a1a1a] border border-[#444444] rounded px-2 py-1.5 text-sm text-white focus:border-blue-500 outline-none transition-colors appearance-none mb-2"
                                >
                                    <option value="">None</option>
                                    {Object.keys(Icons).map((iconKey) => (
                                        <option key={iconKey} value={iconKey}>{iconKey}</option>
                                    ))}
                                </select>

                                <label className="block text-xs text-gray-400 mb-1">Custom Logo (Upload)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                handleChange('customIcon', reader.result);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="w-full text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#444444] file:text-white hover:file:bg-[#555555]"
                                />
                                {selectedNode.data.customIcon && (
                                    <div className="mt-2 flex items-center">
                                        <span className="text-xs text-gray-500 mr-2">Current:</span>
                                        <img src={selectedNode.data.customIcon} alt="Custom" className="w-6 h-6 object-contain bg-white rounded-sm" />
                                        <button
                                            onClick={() => handleChange('customIcon', null)}
                                            className="ml-auto text-xs text-red-400 hover:text-red-300"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Metadata Section */}
                {selectedNode.type !== 'group' && (
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Metadata</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Port</label>
                                <input
                                    type="number"
                                    value={port}
                                    onChange={(e) => handleChange('port', e.target.value)}
                                    placeholder="e.g. 8080"
                                    className="w-full bg-[#1a1a1a] border border-[#444444] rounded px-2 py-1.5 text-sm text-white focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>
                            {type.toLowerCase().includes('database') && (
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Database Name</label>
                                    <input
                                        type="text"
                                        value={dbName}
                                        onChange={(e) => handleChange('dbName', e.target.value)}
                                        placeholder="e.g. users_db"
                                        className="w-full bg-[#1a1a1a] border border-[#444444] rounded px-2 py-1.5 text-sm text-white focus:border-blue-500 outline-none transition-colors"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertiesPanel;
