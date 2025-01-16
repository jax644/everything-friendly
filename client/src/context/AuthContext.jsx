import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function useAuth () {
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

    // Logout function
    const logout = async () => {
      try {
        await fetch(`${BASE_URL}/auth/logout`, {
          method: 'POST',
          credentials: 'include',
        });
        setIsAuthenticated(false);
        setUser(null);
        console.log('User logged out');
      } catch (err) {
        console.error('Error logging out:', err);
      }
    };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setIsAuthenticated, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;