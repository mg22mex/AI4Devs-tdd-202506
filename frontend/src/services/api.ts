import axios from 'axios';
import { Candidate, CreateCandidateRequest, UpdateCandidateRequest } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const candidateApi = {
  // Get all candidates
  getAll: async (): Promise<Candidate[]> => {
    const response = await api.get('/candidates');
    return response.data;
  },

  // Get candidate by ID
  getById: async (id: string): Promise<Candidate> => {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },

  // Create new candidate
  create: async (data: CreateCandidateRequest): Promise<Candidate> => {
    const response = await api.post('/candidates', data);
    return response.data;
  },

  // Update candidate
  update: async (id: string, data: UpdateCandidateRequest): Promise<Candidate> => {
    const response = await api.put(`/candidates/${id}`, data);
    return response.data;
  },

  // Delete candidate
  delete: async (id: string): Promise<void> => {
    await api.delete(`/candidates/${id}`);
  },
};

export default api; 