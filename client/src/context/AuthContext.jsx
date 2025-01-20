import { createContext, useContext, useState, useEffect } from 'react';
import { BASE_URL } from '../../utils';

export const AuthContext = createContext();

export function useAuth () {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize from localStorage if available
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [user, setUser] = useState(() => {
    // Retrieve the entire 'user' object from localStorage
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Utility function to exclude sensitive fields
  const sanitizeUser = (user) => {
    const { password, ...safeUser } = user || {};
    return safeUser;
  };

  // Re-check authentication status on app load (handles Google login)
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${BASE_URL}/auth/current-user`, {
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          setIsAuthenticated(true);
          const sanitizedUser = sanitizeUser(data.user);
          setUser(sanitizedUser);

          // Save the sanitized user object to localStorage
          localStorage.setItem('user', JSON.stringify(sanitizedUser));
          localStorage.setItem('isAuthenticated', 'true');
        } else {
          // Clear localStorage if not authenticated
          localStorage.removeItem('user');
          localStorage.removeItem('isAuthenticated');
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
        // Clear localStorage on error
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
      }
    };

    if (!isAuthenticated && !user) {
      fetchCurrentUser();
    }
  }, [BASE_URL, isAuthenticated, user]);

  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsAuthenticated(true);
        const sanitizedUser = sanitizeUser(data.user);
        setUser(sanitizedUser);

        localStorage.setItem('user', JSON.stringify(sanitizedUser));
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsAuthenticated(true);
        const sanitizedUser = sanitizeUser(data.user);
        setUser(sanitizedUser);

        // Save the sanitized user object to localStorage
        localStorage.setItem('user', JSON.stringify(sanitizedUser));
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  async function logout () {
    // Trigger server logout
    await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    setIsAuthenticated(false);
    setUser(null);

    // Clear localStorage on logout
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, setIsAuthenticated, setUser, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export default AuthContext;
