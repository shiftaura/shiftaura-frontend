import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('team_hub_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Verify stored session on initial application load only
  useEffect(() => {
    const verifyExistingSession = async () => {
      const storedToken = localStorage.getItem('team_hub_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        // Handle both { data: { user } } and { data: user } structures defensively
        const userData = response.data?.data?.user || response.data?.data || response.data?.user;
        setUser(userData);
      } catch (error) {
        console.error("Session verification failed:", error);
        localStorage.removeItem('team_hub_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyExistingSession();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    
    // Extract token and user according to your backend's exact response structure
    const payload = response.data?.data || {};
    const jwtToken = payload.token;
    const userData = payload.user;

    if (!jwtToken || !userData) {
      throw new Error("Invalid response format received from server.");
    }

    localStorage.setItem('team_hub_token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    
    return userData;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors during logout
    } finally {
      localStorage.removeItem('team_hub_token');
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);