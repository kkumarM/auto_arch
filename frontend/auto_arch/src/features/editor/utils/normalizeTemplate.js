// Utility to ensure template graphs are safe for React Flow rendering.
export const normalizeTemplateGraph = (nodes = [], edges = []) => {
    const spacingX = 260;
    const spacingY = 180;
    const normalizedNodes = nodes.map((node, idx) => {
        const hasPos =
            node &&
            node.position &&
            typeof node.position.x === "number" &&
            typeof node.position.y === "number";
        const gridX = (idx % 4) * spacingX;
        const gridY = Math.floor(idx / 4) * spacingY;
        return {
            id: node.id || `n-${idx}`,
            type: node.type || "custom",
            data: node.data || { label: `Node ${idx + 1}`, type: node.type || "custom" },
            position: hasPos ? node.position : { x: gridX, y: gridY },
        };
    });

    if (normalizedNodes.length > 0) {
        const minX = Math.min(...normalizedNodes.map((n) => n.position.x));
        const minY = Math.min(...normalizedNodes.map((n) => n.position.y));
        const offsetX = 120 - minX;
        const offsetY = 120 - minY;
        normalizedNodes.forEach((n) => {
            n.position = { x: n.position.x + offsetX, y: n.position.y + offsetY };
        });
    }

    const normalizedEdges = edges.map((edge, idx) => ({
        id: edge.id || `e-${edge.source || "s"}-${edge.target || "t"}-${idx}`,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: edge.type,
        data: edge.data || {},
    }));

    return { nodes: normalizedNodes, edges: normalizedEdges };
};
