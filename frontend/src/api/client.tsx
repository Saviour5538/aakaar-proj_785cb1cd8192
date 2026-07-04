import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface Match {
  id: string;
  player1: string;
  player2: string;
  winner: string | null;
  board: string[][];
  created_at: string;
}

export interface MatchResponse {
  matches: Match[];
}

export interface StatsResponse {
  total_games: number;
  wins: number;
  losses: number;
  draws: number;
}

export const register = (data: RegisterRequest) => api.post<TokenResponse>('/api/auth/register', data);

export const login = (data: LoginRequest) => api.post<TokenResponse>('/api/auth/login', data);

export const createMatch = () => api.post<Match>('/api/matches');

export const getMatches = () => api.get<MatchResponse>('/api/matches');

export const getStats = () => api.get<StatsResponse>('/api/stats');

// Auto-added stubs for functions a page imported but the client omitted.
export const createStat = async (data?: any) => {
  const res = await api.post('/api/stats', data);
  return res.data;
};
export const deleteMatch = async (id: string) => {
  const res = await api.delete(`/api/matchs/${id}`);
  return res.data;
};
export const deleteStat = async (id: string) => {
  const res = await api.delete(`/api/stats/${id}`);
  return res.data;
};
export const getMatch = async (id: string) => {
  const res = await api.get(`/api/matchs/${id}`);
  return res.data;
};
export const getStatById = async (id: string) => {
  const res = await api.get(`/api/statbyids/${id}`);
  return res.data;
};
export const updateMatch = async (id: string, data?: any) => {
  const res = await api.put(`/api/matchs/${id}`, data);
  return res.data;
};
export const updateStat = async (id: string, data?: any) => {
  const res = await api.put(`/api/stats/${id}`, data);
  return res.data;
};
