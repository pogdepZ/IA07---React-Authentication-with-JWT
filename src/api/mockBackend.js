// This file simulates a backend server with a database and JWT logic
// In a real app, this logic lives on the server (Node/Express/Python, etc.)

const MOCK_DB = {
  user: {
    id: 1,
    email: "user@example.com",
    password: "password123", // In real life, this would be hashed
    name: "John Doe",
  },
};

// Helpers to simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Simulates generating a JWT (just a random string for this demo)
const generateToken = () => `mock_access_token_${Math.random().toString(36).substr(2)}`;
const generateRefreshToken = () => `mock_refresh_token_${Math.random().toString(36).substr(2)}`;

export const mockBackend = {
  login: async (email, password) => {
    await delay(1000); 
    if (email === MOCK_DB.user.email && password === MOCK_DB.user.password) {
      return {
        accessToken: generateToken(),
        refreshToken: generateRefreshToken(),
        user: { email: MOCK_DB.user.email, name: MOCK_DB.user.name },
      };
    }
    throw new Error("Invalid credentials");
  },

  refreshToken: async (token) => {
    await delay(500);
    if (token && token.startsWith("mock_refresh_token")) {
      return { accessToken: generateToken() };
    }
    throw new Error("Invalid refresh token");
  },

  getUserProfile: async (accessToken) => {
    await delay(750);
    if (accessToken && accessToken.startsWith("mock_access_token")) {
      return MOCK_DB.user;
    }
    throw new Error("Unauthorized");
  }
};