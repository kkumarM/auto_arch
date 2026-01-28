TEMPLATES = {
    "ios": {
        "nodes": [
            # Client Layer (Blue)
            {"id": "c1", "type": "custom", "position": {"x": 50, "y": 50}, "data": {"label": "Customer App (iOS)", "type": "Mobile App", "icon": "Mobile", "color": "bg-blue-600"}},
            {"id": "c2", "type": "custom", "position": {"x": 50, "y": 200}, "data": {"label": "Restaurant App", "type": "Mobile App", "icon": "Mobile", "color": "bg-blue-600"}},
            {"id": "c3", "type": "custom", "position": {"x": 50, "y": 350}, "data": {"label": "Driver App (iOS)", "type": "Mobile App", "icon": "Mobile", "color": "bg-blue-600"}},
            {"id": "c4", "type": "custom", "position": {"x": 50, "y": 500}, "data": {"label": "Admin Panel", "type": "Web App", "icon": "Web", "color": "bg-blue-500"}},

            # API Gateway (Orange)
            {"id": "g1", "type": "custom", "position": {"x": 350, "y": 250}, "data": {"label": "API Gateway", "type": "API Gateway", "icon": "Gateway", "color": "bg-orange-500"}},

            # Services Layer (Green)
            {"id": "s1", "type": "custom", "position": {"x": 600, "y": 50}, "data": {"label": "User Service", "type": "Microservice", "icon": "Microservice", "color": "bg-green-600"}},
            {"id": "s2", "type": "custom", "position": {"x": 600, "y": 150}, "data": {"label": "Menu Service", "type": "Microservice", "icon": "Microservice", "color": "bg-green-600"}},
            {"id": "s3", "type": "custom", "position": {"x": 600, "y": 250}, "data": {"label": "Order Service", "type": "Microservice", "icon": "Microservice", "color": "bg-green-600"}},
            {"id": "s4", "type": "custom", "position": {"x": 600, "y": 350}, "data": {"label": "Payment Service", "type": "Microservice", "icon": "Microservice", "color": "bg-green-600"}},
            {"id": "s5", "type": "custom", "position": {"x": 600, "y": 450}, "data": {"label": "Geolocation Svc", "type": "Microservice", "icon": "Compass", "color": "bg-indigo-500"}},
            {"id": "s6", "type": "custom", "position": {"x": 600, "y": 550}, "data": {"label": "Notification Svc", "type": "Microservice", "icon": "Bell", "color": "bg-red-500"}},

            # Data & Messaging Layer (Red/Yellow)
            {"id": "d1", "type": "custom", "position": {"x": 900, "y": 100}, "data": {"label": "Primary DB", "type": "Database", "icon": "Database", "color": "bg-red-600"}},
            {"id": "d2", "type": "custom", "position": {"x": 900, "y": 250}, "data": {"label": "Redis Cache", "type": "Database", "icon": "Stack", "color": "bg-red-400"}},
            {"id": "mq1", "type": "custom", "position": {"x": 900, "y": 400}, "data": {"label": "Kafka/RabbitMQ", "type": "RabbitMQ/KAFKA", "icon": "Queue", "color": "bg-blue-800"}},

            # Third Party (Gray/Various)
            {"id": "ext1", "type": "custom", "position": {"x": 1100, "y": 350}, "data": {"label": "Stripe/PayPal", "type": "Management", "icon": "Cloud", "color": "bg-gray-500"}},
            {"id": "ext2", "type": "custom", "position": {"x": 1100, "y": 450}, "data": {"label": "Google Maps", "type": "Management", "icon": "Compass", "color": "bg-green-500"}},
            {"id": "ext3", "type": "custom", "position": {"x": 1100, "y": 550}, "data": {"label": "APNS (Apple)", "type": "Management", "icon": "Cloud", "color": "bg-gray-500"}}
        ],
        "edges": [
            # Clients to Gateway (Right -> Left)
            {"id": "e1", "source": "c1", "target": "g1", "sourceHandle": "right", "targetHandle": "left"},
            {"id": "e2", "source": "c2", "target": "g1", "sourceHandle": "right", "targetHandle": "left"},
            {"id": "e3", "source": "c3", "target": "g1", "sourceHandle": "right", "targetHandle": "left"},
            {"id": "e4", "source": "c4", "target": "g1", "sourceHandle": "right", "targetHandle": "left"},

            # Gateway to Services (Right -> Left)
            {"id": "e5", "source": "g1", "target": "s1", "sourceHandle": "right", "targetHandle": "left"},
            {"id": "e6", "source": "g1", "target": "s2", "sourceHandle": "right", "targetHandle": "left"},
            {"id": "e7", "source": "g1", "target": "s3", "sourceHandle": "right", "targetHandle": "left"},
            {"id": "e8", "source": "g1", "target": "s4", "sourceHandle": "right", "targetHandle": "left"},
            {"id": "e9", "source": "g1", "target": "s5", "sourceHandle": "right", "targetHandle": "left"},
            {"id": "e10", "source": "g1", "target": "s6", "sourceHandle": "right", "targetHandle": "left"},

            # Services to Data (Right -> Left)
            {"id": "e11", "source": "s1", "target": "d1", "sourceHandle": "right", "targetHandle": "left"},
            {"id": "e12", "source": "s2", "target": "d1", "sourceHandle": "right", "targetHandle": "left"},
            {"id": "e13", "source": "s3", "target": "d1", "sourceHandle": "right", "targetHandle": "left"},
            {"id": "e14", "source": "s3", "target": "d2", "sourceHandle": "right", "targetHandle": "left"}, # Order service uses cache
            
            # Services to MQ (Right -> Left)
            {"id": "e15", "source": "s3", "target": "mq1", "sourceHandle": "right", "targetHandle": "left"}, # Order events
            {"id": "e16", "source": "s5", "target": "mq1", "sourceHandle": "right", "targetHandle": "left"}, # Location updates

            # Services to External (Right -> Left)
            {"id": "e17", "source": "s4", "target": "ext1", "sourceHandle": "right", "targetHandle": "left"}, # Payment -> Stripe
            {"id": "e18", "source": "s5", "target": "ext2", "sourceHandle": "right", "targetHandle": "left"}, # Geo -> Google Maps
            {"id": "e19", "source": "s6", "target": "ext3", "sourceHandle": "right", "targetHandle": "left"}, # Notif -> APNS
        ]
    },
    "android": {
        "nodes": [
            {"id": "1", "type": "custom", "position": {"x": 100, "y": 100}, "data": {"label": "Android App", "type": "Mobile App", "icon": "Mobile"}},
            {"id": "2", "type": "custom", "position": {"x": 400, "y": 100}, "data": {"label": "API Gateway", "type": "API Gateway", "icon": "Gateway"}},
            {"id": "3", "type": "custom", "position": {"x": 700, "y": 100}, "data": {"label": "Backend Service", "type": "Microservice", "icon": "Microservice"}}
        ],
        "edges": [
            {"id": "e1-2", "source": "1", "target": "2"},
            {"id": "e2-3", "source": "2", "target": "3"}
        ]
    },
    "react": {
        "nodes": [
            # Frontend Layer
            {"id": "c1", "type": "custom", "position": {"x": 50, "y": 250}, "data": {"label": "React SPA", "type": "Web App", "icon": "Web", "color": "bg-blue-500"}},
            {"id": "cdn1", "type": "custom", "position": {"x": 50, "y": 400}, "data": {"label": "CDN", "type": "CDN", "icon": "Cloud", "color": "bg-cyan-500"}},

            # Gateway Layer
            {"id": "lb1", "type": "custom", "position": {"x": 300, "y": 250}, "data": {"label": "Load Balancer", "type": "Load Balancer", "icon": "LoadBalancer", "color": "bg-blue-500"}},
            {"id": "g1", "type": "custom", "position": {"x": 500, "y": 250}, "data": {"label": "API Gateway", "type": "API Gateway", "icon": "Gateway", "color": "bg-orange-500"}},

            # Services Layer
            {"id": "s1", "type": "custom", "position": {"x": 750, "y": 100}, "data": {"label": "Auth Service", "type": "Auth Service", "icon": "Key", "color": "bg-blue-500"}},
            {"id": "s2", "type": "custom", "position": {"x": 750, "y": 250}, "data": {"label": "User Service", "type": "Microservice", "icon": "Microservice", "color": "bg-green-600"}},
            {"id": "s3", "type": "custom", "position": {"x": 750, "y": 400}, "data": {"label": "Product Service", "type": "Microservice", "icon": "Microservice", "color": "bg-green-600"}},

            # Data Layer
            {"id": "d1", "type": "custom", "position": {"x": 1000, "y": 100}, "data": {"label": "Auth DB", "type": "Database", "icon": "Database", "color": "bg-red-600"}},
            {"id": "d2", "type": "custom", "position": {"x": 1000, "y": 250}, "data": {"label": "Main DB", "type": "Database", "icon": "Database", "color": "bg-red-600"}},
            {"id": "d3", "type": "custom", "position": {"x": 1000, "y": 400}, "data": {"label": "Redis Cache", "type": "Redis", "icon": "Redis", "color": "bg-red-500"}},
        ],
        "edges": [
            # Client -> Infra
            {"id": "e1", "source": "c1", "target": "lb1", "sourceHandle": "right", "targetHandle": "left"},
            {"id": "e2", "source": "c1", "target": "cdn1", "sourceHandle": "bottom", "targetHandle": "top"},

            # Infra -> Gateway
            {"id": "e3", "source": "lb1", "target": "g1", "sourceHandle": "right", "targetHandle": "left"},

            # Gateway -> Services
            {"id": "e4", "source": "g1", "target": "s1", "sourceHandle": "right", "targetHandle": "left"},
            {"id": "e5", "source": "g1", "target": "s2", "sourceHandle": "right", "targetHandle": "left"},
            {"id": "e6", "source": "g1", "target": "s3", "sourceHandle": "right", "targetHandle": "left"},

            # Services -> Data
            {"id": "e7", "source": "s1", "target": "d1", "sourceHandle": "right", "targetHandle": "left"},
            {"id": "e8", "source": "s2", "target": "d2", "sourceHandle": "right", "targetHandle": "left"},
            {"id": "e9", "source": "s3", "target": "d2", "sourceHandle": "right", "targetHandle": "left"},
            {"id": "e10", "source": "s3", "target": "d3", "sourceHandle": "right", "targetHandle": "left"},
        ]
    },
    "nextjs": {
        "nodes": [
            # App Layer
            {"id": "c1", "type": "custom", "position": {"x": 50, "y": 250}, "data": {"label": "Next.js App", "type": "Web App", "icon": "Web", "color": "bg-black"}},
            
            # Gateway/Service Layer
            {"id": "g1", "type": "custom", "position": {"x": 300, "y": 250}, "data": {"label": "API Gateway", "type": "API Gateway", "icon": "Gateway", "color": "bg-orange-500"}},
            {"id": "s1", "type": "custom", "position": {"x": 550, "y": 100}, "data": {"label": "Auth Service", "type": "Auth Service", "icon": "Key", "color": "bg-blue-500"}},
            
            # Data Layer
            {"id": "d1", "type": "custom", "position": {"x": 800, "y": 100}, "data": {"label": "Postgres DB", "type": "Database", "icon": "Database", "color": "bg-blue-600"}},
            {"id": "d2", "type": "custom", "position": {"x": 800, "y": 250}, "data": {"label": "Redis Cache", "type": "Redis", "icon": "Redis", "color": "bg-red-500"}},

            # External Services
            {"id": "ext1", "type": "custom", "position": {"x": 800, "y": 400}, "data": {"label": "Stripe", "type": "Management", "icon": "Cloud", "color": "bg-indigo-500"}},
            {"id": "ext2", "type": "custom", "position": {"x": 800, "y": 500}, "data": {"label": "Analytics", "type": "Management", "icon": "Chart", "color": "bg-yellow-500"}},
        ],
        "edges": [
            # App -> Gateway
            {"id": "e1", "source": "c1", "target": "g1", "sourceHandle": "right", "targetHandle": "left"},

            # Gateway -> Services/Data
            {"id": "e2", "source": "g1", "target": "s1", "sourceHandle": "right", "targetHandle": "left"},
            {"id": "e3", "source": "g1", "target": "d1", "sourceHandle": "right", "targetHandle": "left"}, # Direct DB access (common in Next.js)
            {"id": "e4", "source": "g1", "target": "d2", "sourceHandle": "right", "targetHandle": "left"},

            # Services -> Data
            {"id": "e5", "source": "s1", "target": "d1", "sourceHandle": "right", "targetHandle": "left"},

            # App -> External
            {"id": "e6", "source": "c1", "target": "ext1", "sourceHandle": "bottom", "targetHandle": "left"},
            {"id": "e7", "source": "c1", "target": "ext2", "sourceHandle": "bottom", "targetHandle": "left"},
        ]
    }
}

def get_template_by_id(template_id: str):
    return TEMPLATES.get(template_id)
