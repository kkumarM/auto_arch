import React from "react";
import { templates } from "../templates/templates";

export default function TemplatesPanel({ open, onClose, onSelect }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <h3 className="text-white font-semibold text-sm uppercase tracking-wide">Templates</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                        aria-label="Close templates"
                    >
                        ✕
                    </button>
                </div>
                <div className="p-4 overflow-y-auto space-y-3">
                    {templates.map((tpl) => (
                        <div
                            key={tpl.id}
                            className="border border-white/10 rounded-lg p-4 bg-white/5 hover:border-blue-500/50 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-white font-semibold">{tpl.name}</div>
                                    <div className="text-xs text-gray-400">{tpl.description}</div>
                                    <div className="mt-1 text-[11px] text-gray-500 uppercase tracking-wide">
                                        {tpl.tags.join(" • ")}
                                    </div>
                                </div>
                                <button
                                    onClick={() => onSelect(tpl)}
                                    className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1.5 rounded-md"
                                >
                                    Load
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
