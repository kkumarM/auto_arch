import React, { useState, useEffect } from "react";
import { Icons } from "./icons";

const tabs = ["Basics", "Runtime", "Network", "Security", "Storage"];
const edgeTabs = ["Edge"];

const TabHeader = ({ items, active, onSelect }) => (
    <div className="flex border-b border-[#444444]">
        {items.map((t) => (
            <button
                key={t}
                onClick={() => onSelect(t)}
                className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide ${
                    active === t ? "text-white border-b-2 border-blue-500" : "text-gray-500"
                }`}
            >
                {t}
            </button>
        ))}
    </div>
);

const Input = ({ label, value, onChange, ...rest }) => (
    <div>
        <label className="block text-xs text-gray-400 mb-1">{label}</label>
        <input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#444444] rounded px-2 py-1.5 text-sm text-white focus:border-blue-500 outline-none transition-colors"
            {...rest}
        />
    </div>
);

const TextArea = ({ label, value, onChange, ...rest }) => (
    <div>
        <label className="block text-xs text-gray-400 mb-1">{label}</label>
        <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#444444] rounded px-2 py-1.5 text-sm text-white focus:border-blue-500 outline-none transition-colors h-20 resize-none"
            {...rest}
        />
    </div>
);

const Select = ({ label, value, onChange, options }) => (
    <div>
        <label className="block text-xs text-gray-400 mb-1">{label}</label>
        <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#444444] rounded px-2 py-1.5 text-sm text-white focus:border-blue-500 outline-none transition-colors appearance-none"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);

const ColorGrid = ({ value, onChange }) => {
    const COLORS = [
        "bg-blue-600", "bg-green-600", "bg-red-600", "bg-orange-500",
        "bg-purple-600", "bg-cyan-500", "bg-amber-500", "bg-indigo-600",
        "bg-teal-600", "bg-gray-600",
    ];
    return (
        <div>
            <label className="block text-xs text-gray-400 mb-1">Color</label>
            <div className="grid grid-cols-5 gap-2">
                {COLORS.map((c) => (
                    <button
                        key={c}
                        onClick={() => onChange(c)}
                        className={`${c} h-8 rounded border-2 transition-all ${value === c ? "border-white scale-110" : "border-transparent hover:border-gray-500"}`}
                    >
                        <span className="sr-only">{c}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const PortsInput = ({ value, onChange }) => {
    const [text, setText] = useState((value || []).join(","));
    useEffect(() => setText((value || []).join(",")), [value]);

    const commit = (val) => {
        const ports = val
            .split(",")
            .map((p) => parseInt(p.trim(), 10))
            .filter((p) => !Number.isNaN(p));
        onChange(ports);
    };

    return (
        <Input
            label="Ports (comma separated)"
            value={text}
            onChange={(val) => {
                setText(val);
                commit(val);
            }}
        />
    );
};

const StorageList = ({ value = [], onChange }) => {
    const [text, setText] = useState(value.join(","));
    useEffect(() => setText((value || []).join(",")), [value]);
    const commit = (val) => onChange(val.split(",").map((v) => v.trim()).filter(Boolean));

    return (
        <Input
            label="Volumes (comma separated)"
            value={text}
            onChange={(val) => {
                setText(val);
                commit(val);
            }}
        />
    );
};

const EdgeInspector = ({ edge, onChange, onDelete, onClose }) => {
    const [tab, setTab] = useState(edgeTabs[0]);
    const data = edge?.data || {};

    return (
        <div className="w-80 bg-[#2d2d2d] border-l border-[#444444] flex flex-col h-full shadow-xl z-10">
            <div className="p-4 border-b border-[#444444] flex justify-between items-center bg-[#333333]">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Edge</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <TabHeader items={edgeTabs} active={tab} onSelect={setTab} />
            <div className="p-4 space-y-3 overflow-y-auto flex-1">
                <Input label="Label" value={data.label} onChange={(v) => onChange({ ...edge, data: { ...data, label: v } })} />
                <Select
                    label="Protocol"
                    value={data.protocol || "http"}
                    onChange={(v) => onChange({ ...edge, data: { ...data, protocol: v } })}
                    options={[
                        { value: "http", label: "HTTP" },
                        { value: "grpc", label: "gRPC" },
                        { value: "tcp", label: "TCP" },
                        { value: "queue", label: "Queue" },
                    ]}
                />
                <Select
                    label="Direction"
                    value={data.direction || "uni"}
                    onChange={(v) => onChange({ ...edge, data: { ...data, direction: v } })}
                    options={[
                        { value: "uni", label: "Uni-directional" },
                        { value: "bi", label: "Bi-directional" },
                    ]}
                />
                <div className="flex items-center space-x-2">
                    <input
                        id="edge-tls"
                        type="checkbox"
                        checked={!!data.tls}
                        onChange={(e) => onChange({ ...edge, data: { ...data, tls: e.target.checked } })}
                    />
                    <label htmlFor="edge-tls" className="text-sm text-white">TLS enabled</label>
                </div>
            </div>
            <div className="p-4 border-t border-[#444444] flex gap-2">
                <button onClick={onDelete} className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded px-3 py-2 text-sm">
                    Delete
                </button>
            </div>
        </div>
    );
};

const NodeInspector = ({ node, onChange, onDelete, onClose }) => {
    const [tab, setTab] = useState(tabs[0]);
    const data = node?.data || {};

    const updateData = (patch) => onChange({ ...node, data: { ...data, ...patch } });

    return (
        <div className="w-80 bg-[#2d2d2d] border-l border-[#444444] flex flex-col h-full shadow-xl z-10">
            <div className="p-4 border-b border-[#444444] flex justify-between items-center bg-[#333333]">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Properties</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <TabHeader items={tabs} active={tab} onSelect={setTab} />
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
                {tab === "Basics" && (
                    <>
                        <Input label="Name" value={data.label} onChange={(v) => updateData({ label: v })} />
                        <Input label="Kind / Type" value={data.type} onChange={(v) => updateData({ type: v })} />
                        <TextArea label="Description" value={data.description} onChange={(v) => updateData({ description: v })} />
                        <Select
                            label="Icon"
                            value={data.icon || ""}
                            onChange={(v) => updateData({ icon: v })}
                            options={[{ value: "", label: "None" }, ...Object.keys(Icons).map((k) => ({ value: k, label: k }))]}
                        />
                        <ColorGrid value={data.color} onChange={(v) => updateData({ color: v })} />
                    </>
                )}
                {tab === "Runtime" && (
                    <>
                        <Input label="Runtime" value={data.runtime} onChange={(v) => updateData({ runtime: v })} placeholder="fastapi / node / python" />
                        <Input label="Image" value={data.image} onChange={(v) => updateData({ image: v })} placeholder="docker image (optional)" />
                        <Input label="Command" value={data.command} onChange={(v) => updateData({ command: v })} placeholder="entrypoint command (optional)" />
                    </>
                )}
                {tab === "Network" && (
                    <>
                        <PortsInput value={data.ports} onChange={(ports) => updateData({ ports })} />
                        <Select
                            label="Protocol Hint"
                            value={data.protocol || "http"}
                            onChange={(v) => updateData({ protocol: v })}
                            options={[
                                { value: "http", label: "HTTP" },
                                { value: "grpc", label: "gRPC" },
                                { value: "tcp", label: "TCP" },
                            ]}
                        />
                        <div className="flex items-center space-x-2">
                            <input
                                id="expose"
                                type="checkbox"
                                checked={!!data.expose}
                                onChange={(e) => updateData({ expose: e.target.checked })}
                            />
                            <label htmlFor="expose" className="text-sm text-white">Expose/Public</label>
                        </div>
                    </>
                )}
                {tab === "Security" && (
                    <>
                        <div className="flex items-center space-x-2">
                            <input
                                id="tls-node"
                                type="checkbox"
                                checked={!!data.tls}
                                onChange={(e) => updateData({ tls: e.target.checked })}
                            />
                            <label htmlFor="tls-node" className="text-sm text-white">TLS enabled</label>
                        </div>
                        <Select
                            label="Auth Mode"
                            value={data.authMode || "none"}
                            onChange={(v) => updateData({ authMode: v })}
                            options={[
                                { value: "none", label: "None" },
                                { value: "jwt", label: "JWT" },
                                { value: "mtls", label: "mTLS (placeholder)" },
                            ]}
                        />
                    </>
                )}
                {tab === "Storage" && (
                    <>
                        <StorageList value={data.storage} onChange={(v) => updateData({ storage: v })} />
                        {String(data.type || "").toLowerCase().includes("db") && (
                            <Select
                                label="DB Mode"
                                value={data.dbMode || "local"}
                                onChange={(v) => updateData({ dbMode: v })}
                                options={[
                                    { value: "local", label: "Local (docker)" },
                                    { value: "cloud", label: "Cloud" },
                                ]}
                            />
                        )}
                    </>
                )}
            </div>
            <div className="p-4 border-t border-[#444444] flex gap-2">
                <button onClick={onDelete} className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded px-3 py-2 text-sm">
                    Delete
                </button>
            </div>
        </div>
    );
};

export default function InspectorPanel({ selected, onNodeChange, onEdgeChange, onDelete, onClose }) {
    if (!selected) return (
        <div className="w-80 bg-[#111827] border-l border-[#1f2937] text-gray-400 flex items-center justify-center text-sm">
            Select a node or edge to edit
        </div>
    );

    if (selected.source && selected.target) {
        return (
            <EdgeInspector
                edge={selected}
                onChange={onEdgeChange}
                onDelete={onDelete}
                onClose={onClose}
            />
        );
    }

    return (
        <NodeInspector
            node={selected}
            onChange={onNodeChange}
            onDelete={onDelete}
            onClose={onClose}
        />
    );
}
