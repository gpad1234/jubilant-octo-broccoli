const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Error handling utility
const handleResponse = async (response, errorMessage) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || errorMessage);
  }
  return response.json();
};

// Request helper with retry logic
const fetchWithRetry = async (url, options = {}, maxRetries = 2) => {
  let lastError;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
      });
      return response;
    } catch (err) {
      lastError = err;
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
  throw lastError;
};

// Customers API
export const customersAPI = {
  getAll: async () => {
    const response = await fetchWithRetry(`${API_BASE_URL}/customers`);
    return handleResponse(response, 'Failed to fetch customers');
  },

  getById: async (id) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/customers/${id}`);
    return handleResponse(response, 'Failed to fetch customer');
  },

  create: async (data) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/customers`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return handleResponse(response, 'Failed to create customer');
  },

  update: async (id, data) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return handleResponse(response, 'Failed to update customer');
  },

  delete: async (id) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/customers/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response, 'Failed to delete customer');
  },
};

// Deals API
export const dealsAPI = {
  getAll: async () => {
    const response = await fetchWithRetry(`${API_BASE_URL}/deals`);
    return handleResponse(response, 'Failed to fetch deals');
  },

  getByStage: async (stage) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/deals/stage/${stage}`);
    return handleResponse(response, 'Failed to fetch deals');
  },

  create: async (data) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/deals`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return handleResponse(response, 'Failed to create deal');
  },

  update: async (id, data) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/deals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return handleResponse(response, 'Failed to update deal');
  },

  delete: async (id) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/deals/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response, 'Failed to delete deal');
  },
};

// Tasks API
export const tasksAPI = {
  getAll: async () => {
    const response = await fetchWithRetry(`${API_BASE_URL}/tasks`);
    return handleResponse(response, 'Failed to fetch tasks');
  },

  create: async (data) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return handleResponse(response, 'Failed to create task');
  },

  update: async (id, data) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return handleResponse(response, 'Failed to update task');
  },

  delete: async (id) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response, 'Failed to delete task');
  },
};

// Activities API
export const activitiesAPI = {
  getAll: async () => {
    const response = await fetchWithRetry(`${API_BASE_URL}/activities`);
    return handleResponse(response, 'Failed to fetch activities');
  },

  create: async (data) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/activities`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return handleResponse(response, 'Failed to create activity');
  },
};

// AI Insights API
export const aiAPI = {
  getCustomerInsights: async (customerId) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/ai/customer-insights/${customerId}`);
    return handleResponse(response, 'Failed to generate customer insights');
  },

  getDealRecommendations: async () => {
    const response = await fetchWithRetry(`${API_BASE_URL}/ai/deal-recommendations`);
    return handleResponse(response, 'Failed to generate deal recommendations');
  },

  getPipelineAnalysis: async () => {
    const response = await fetchWithRetry(`${API_BASE_URL}/ai/pipeline-analysis`);
    return handleResponse(response, 'Failed to analyze pipeline');
  },

  getNextSteps: async (customerId) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/ai/next-steps/${customerId}`);
    return handleResponse(response, 'Failed to generate next steps');
  },
};