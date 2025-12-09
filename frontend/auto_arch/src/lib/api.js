export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = 'ApiError';
    }
}

async function handleResponse(response) {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
        const error = (data && data.message) || response.statusText;
        throw new ApiError(error, response.status);
    }

    return data;
}

const API_BASE_URL = "http://localhost:8000";

export const api = {
    get: async (url, headers = {}) => {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        });
        return handleResponse(response);
    },

    post: async (endpoint, data) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        return response.json();
    },
    getTemplate: async (templateId) => {
        const response = await fetch(`${API_BASE_URL}/templates/${templateId}`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        return response.json();
    }
    // Add put, delete, etc. as needed
};

export const generateCode = async (diagram) => {
    return api.post("/generate", diagram);
};
