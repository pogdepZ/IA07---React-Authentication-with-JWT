import apiClient from './axios';
import { setAccessToken } from './axios';
export const loginUser = async (credentials) => {
  const { data } = await apiClient.post('/auth/login', credentials);
  return data;
};

export const fetchUserProfile = async () => {
  const { data } = await apiClient.get('/user/profile');
  return data;
};

export const simulateTokenExpiry = () => {
    setAccessToken("EXPIRED_TOKEN");
};