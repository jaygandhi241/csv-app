import axios from 'axios';
import { useAuth } from '../auth/AuthContext.jsx';

const API_URL ="http://localhost:4000/api"

export function useApi() {
  const { token, logout } = useAuth();

  const client = axios.create({ baseURL: API_URL, withCredentials: false });

  client.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );

  async function json(method, url, data, config) {
    try {
      const res = await client.request({ method, url, data, ...config });
      return { ok: true, status: res.status, data: res.data };
    } catch (e) {
      const resp = e.response;
      return { ok: false, status: resp?.status || 0, data: resp?.data, error: e.message };
    }
  }

  return { client, json };
}


