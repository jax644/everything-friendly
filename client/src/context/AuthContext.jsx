import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export default function useAuth () {
  return useContext(AuthContext);
}

export function AuthProvider ({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const BASE_URL =
    process.env.NODE_ENV === 'production'
      ? 'https://everything-friendly.onrender.com'
      : 'http://localhost:3000';

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${BASE_URL}/auth/current-user`, {
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          setIsAuthenticated(true);
          setUser(data.user);
          console.log(`${data.user} is logged in`);
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    };
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setIsAuthenticated, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};