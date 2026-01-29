export const templates = [
    {
        id: "next-fastapi-postgres",
        name: "Next.js + FastAPI + Postgres",
        description: "Full-stack web app with gateway, auth, and database.",
        tags: ["web", "fullstack"],
        projectName: "next-fastapi-postgres",
        graph: {
            nodes: [
                { id: "app", type: "custom", position: { x: 50, y: 200 }, data: { label: "Next.js App", type: "Web App", icon: "Web", color: "bg-blue-500" } },
                { id: "cdn", type: "custom", position: { x: 50, y: 380 }, data: { label: "CDN", type: "CDN", icon: "Cloud", color: "bg-cyan-500" } },
                { id: "lb", type: "custom", position: { x: 320, y: 200 }, data: { label: "Load Balancer", type: "Load Balancer", icon: "LoadBalancer", color: "bg-blue-500" } },
                { id: "gw", type: "custom", position: { x: 520, y: 200 }, data: { label: "API Gateway", type: "API Gateway", icon: "Gateway", color: "bg-orange-500" } },
                { id: "auth", type: "custom", position: { x: 780, y: 120 }, data: { label: "Auth Service", type: "Auth Service", icon: "Key", color: "bg-blue-500", port: 8001 } },
                { id: "api", type: "custom", position: { x: 780, y: 260 }, data: { label: "FastAPI Service", type: "Microservice", icon: "Microservice", color: "bg-green-600", port: 8000 } },
                { id: "db", type: "custom", position: { x: 1040, y: 220 }, data: { label: "Postgres", type: "Database", icon: "Database", color: "bg-red-600", dbMode: "local" } },
            ],
            edges: [
                { id: "e1", source: "app", target: "lb", sourceHandle: "right", targetHandle: "left" },
                { id: "e2", source: "app", target: "cdn", sourceHandle: "bottom", targetHandle: "top" },
                { id: "e3", source: "lb", target: "gw", sourceHandle: "right", targetHandle: "left" },
                { id: "e4", source: "gw", target: "auth", sourceHandle: "right", targetHandle: "left" },
                { id: "e5", source: "gw", target: "api", sourceHandle: "right", targetHandle: "left" },
                { id: "e6", source: "api", target: "db", sourceHandle: "right", targetHandle: "left" },
                { id: "e7", source: "auth", target: "db", sourceHandle: "right", targetHandle: "left" },
            ],
        },
    },
    {
        id: "fastapi-redis-worker",
        name: "FastAPI + Redis + Worker",
        description: "API service with async worker and Redis cache/broker.",
        tags: ["backend", "queue"],
        projectName: "fastapi-redis-worker",
        graph: {
            nodes: [
                { id: "api", type: "custom", position: { x: 120, y: 200 }, data: { label: "FastAPI API", type: "Microservice", icon: "Microservice", color: "bg-green-600", port: 8000 } },
                { id: "redis", type: "custom", position: { x: 400, y: 200 }, data: { label: "Redis", type: "Redis", icon: "Redis", color: "bg-red-500" } },
                { id: "worker", type: "custom", position: { x: 680, y: 200 }, data: { label: "Worker", type: "Microservice", icon: "Settings", color: "bg-indigo-500", port: 8001 } },
            ],
            edges: [
                { id: "e1", source: "api", target: "redis", sourceHandle: "right", targetHandle: "left" },
                { id: "e2", source: "worker", target: "redis", sourceHandle: "left", targetHandle: "right" },
            ],
        },
    },
    {
        id: "gateway-2svc-db",
        name: "API Gateway + 2 Services + DB",
        description: "Simple microservice setup behind a gateway with shared DB.",
        tags: ["microservices"],
        projectName: "gateway-2svc-db",
        graph: {
            nodes: [
                { id: "web", type: "custom", position: { x: 80, y: 180 }, data: { label: "Web Client", type: "Web App", icon: "Web", color: "bg-blue-500" } },
                { id: "gw", type: "custom", position: { x: 320, y: 180 }, data: { label: "API Gateway", type: "API Gateway", icon: "Gateway", color: "bg-orange-500" } },
                { id: "svc1", type: "custom", position: { x: 560, y: 100 }, data: { label: "User Service", type: "Microservice", icon: "Microservice", color: "bg-green-600", port: 8000 } },
                { id: "svc2", type: "custom", position: { x: 560, y: 260 }, data: { label: "Orders Service", type: "Microservice", icon: "Microservice", color: "bg-green-600", port: 8001 } },
                { id: "db", type: "custom", position: { x: 820, y: 180 }, data: { label: "Postgres DB", type: "Database", icon: "Database", color: "bg-red-600" } },
            ],
            edges: [
                { id: "e1", source: "web", target: "gw", sourceHandle: "right", targetHandle: "left" },
                { id: "e2", source: "gw", target: "svc1", sourceHandle: "right", targetHandle: "left" },
                { id: "e3", source: "gw", target: "svc2", sourceHandle: "right", targetHandle: "left" },
                { id: "e4", source: "svc1", target: "db", sourceHandle: "right", targetHandle: "left" },
                { id: "e5", source: "svc2", target: "db", sourceHandle: "right", targetHandle: "left" },
            ],
        },
    },
];
