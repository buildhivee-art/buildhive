
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// Auth
export const sendOtp = async (email: string, type: "login" | "signup") => {
  const response = await fetch(`${API_URL}/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, type }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to send OTP");
  }

  return response.json();
};

export const verifyOtp = async (
  email: string,
  otp: string,
  type: "login" | "signup",
  name?: string
) => {
  const response = await fetch(`${API_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp, type, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to verify OTP");
  }

  return response.json();
};

// Projects
export const fetchProjects = async (page = 1, limit = 10) => {
  const response = await fetch(`${API_URL}/projects?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
     throw new Error('Failed to fetch projects');
  }
  return response.json();
};

export const fetchProjectById = async (id: string) => {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch project');
  }
  return response.json();
};

export const createProject = async (data: any) => {
  const response = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create project');
  }
  return response.json();
};

export const updateProject = async (id: string, data: any) => {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update project');
  }
  return response.json();
};

export const deleteProject = async (id: string) => {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete project');
  }
  return response.json();
};
