import axios from 'axios';
import { mockBackend } from './mockBackend';
import { addLog } from '../utils/logger'; 


const apiClient = axios.create({
  baseURL: 'http://mock-api.local',
  headers: {
    'Content-Type': 'application/json',
  },
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
  console.log("Flux: Token Updated ->", accessToken);
  if (token) {
    if (token.includes("EXPIRED")) {
      addLog(`Token manually corrupted: ${token}`, 'warning');
    } else {
      addLog(`Token updated: ${token.substring(0, 15)}...`, 'success');
    }
  } else {
    addLog("Token cleared (Logout)", 'error');
  }
};

export const getAccessToken = () => accessToken;

const customMockAdapter = async (config) => {
  const { url, method, data, headers } = config;

  try {
    let responseData;

    if (url === '/auth/login' && method === 'post') {
      const { email, password } = JSON.parse(data);
      responseData = await mockBackend.login(email, password);
    }
 
    else if (url === '/auth/refresh' && method === 'post') {
      const { refreshToken } = JSON.parse(data);
      responseData = await mockBackend.refreshToken(refreshToken);
    }
   
    else if (url === '/user/profile' && method === 'get') {
      const authHeader = headers?.Authorization || headers?.authorization;

      if (!authHeader) {
        throw { config, response: { status: 401, data: { message: "No token" } } };
      }

   
      if (authHeader.includes("EXPIRED")) {
        throw { config, response: { status: 401, data: { message: "Token expired" } } };
      }

      const token = authHeader.split(" ")[1];
      responseData = await mockBackend.getUserProfile(token);
    }
    else {
      throw { config, response: { status: 404, data: { message: "Not found" } } };
    }

    return {
      data: responseData,
      status: 200,
      statusText: "OK",
      headers: {},
      config
    };

  } catch (err) {
    if (!err.config) err.config = config;

    if (err.message === "Invalid credentials") {
      return Promise.reject({
        config,
        response: { status: 400, data: { message: "Invalid email or password" } }
      });
    }

    return Promise.reject(err);
  }
};

apiClient.defaults.adapter = customMockAdapter;

// ======================================================
// 4. Request Interceptor (Attach Access Token)
// ======================================================
apiClient.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ======================================================
// 5. Response Interceptor (Refresh Token Logic)
// ======================================================
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    
    if (!error.response) return Promise.reject(error);

   
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        addLog("🚨 401 Unauthorized detected! Intercepting...", 'error');
        addLog("🔄 Attempting to refresh token...", 'warning');

        console.log("Interceptor: 401 detected. Attempting refresh...");
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token in storage");

     
        const rawAxios = axios.create({
          baseURL: 'http://mock-api.local',
          headers: { 'Content-Type': 'application/json' }
        });

       
        rawAxios.defaults.adapter = customMockAdapter;

        const res = await rawAxios.post('/auth/refresh', { refreshToken });

        const newAccessToken = res.data.accessToken;
        setAccessToken(newAccessToken); 

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        console.log("Interceptor: Refresh success. Retrying original request...");
        addLog("✅ Refresh successful! Retrying original request...", 'success');
        return apiClient(originalRequest);

      } catch (refreshError) {
        console.error("Interceptor: Refresh failed -> Logout", refreshError);
        localStorage.removeItem("refreshToken");
        setAccessToken(null);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    addLog(`API Error: ${error.response?.data?.message || error.message}`, 'error');
    return Promise.reject(error);
  }
);

export default apiClient;