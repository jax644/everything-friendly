import { createContext, useContext, useState, useEffect } from 'react';

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
    // Retrieve only the 'name' field from localStorage
    const storedName = localStorage.getItem('userName');
    return storedName ? { name: storedName } : null;
  });

  const BASE_URL =
    process.env.NODE_ENV === 'production'
      ? 'https://everything-friendly.onrender.com'
      : 'http://localhost:3000';

  // Re-check authentication status on app load
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

          // Save only the 'name' field to localStorage
          localStorage.setItem('userName', data.user.name);
          localStorage.setItem('isAuthenticated', 'true');
        } else {
          // Clear localStorage if not authenticated
          localStorage.removeItem('userName');
          localStorage.removeItem('isAuthenticated');
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
        // Clear localStorage on error
        localStorage.removeItem('userName');
        localStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
      }
    };

    if (!isAuthenticated && !user) {
      fetchCurrentUser();
    }
  }, [BASE_URL, isAuthenticated, user]);

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
        setUser(data.user);

        // Save only the 'name' field to localStorage
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  async function logout (){

    // Trigger server logout
    await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    console.log('logout called')
    setIsAuthenticated(false);
    setUser(null);

    // Clear localStorage on logout
    localStorage.removeItem('userName');
    localStorage.removeItem('isAuthenticated');

    console.log('Logged out')
    console.log(`Checking local storage...`)
    console.log(localStorage.getItem('isAuthenticated'))
    console.log(localStorage.getItem('userName'))
    console.log(`Checking for cookies...`)
    console.log(document.cookie)
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, setIsAuthenticated, setUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export default AuthContext;