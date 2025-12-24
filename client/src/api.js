const API_URL = 'http://127.0.0.1:5000/api';

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const apiRequest = async (endpoint, method = 'GET', body = null) => {
    const isFormData = body instanceof FormData;

    const headers = {
        ...getAuthHeader()
    };

    // Only set Content-Type to JSON if it's NOT FormData
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const config = {
        method,
        headers,
        body: isFormData ? body : (body ? JSON.stringify(body) : null)
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);

        // Check for JSON content type or attempt to read text first
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'API Error');
            }
            return data;
        } else {
            const text = await response.text();
            console.error("API returned non-JSON response:", text);
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            // If 200 OK but text/html, it's virtually certainly an error (like connecting to frontend dev server by mistake)
            throw new Error("Unexpected response format (HTML received instead of JSON). Check console.");
        }
    } catch (error) {
        throw error;
    }
};
