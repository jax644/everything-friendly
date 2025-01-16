import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setIsAuthenticated, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://everything-friendly.onrender.com' 
  : 'http://localhost:3000'

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
  }, [setIsAuthenticated, setUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Update authentication state
      setIsAuthenticated(true);
      setUser(data.user);
      console.log(`${data.user} is logged in`)
      navigate('/'); // or wherever you want to redirect after login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
        <h2>
        Sign in to your account
        </h2>
    
        {error && (
            <div role="alert">
            <span>{error}</span>
            </div>
        )}

        <form onSubmit={handleSubmit}>
           
            <label htmlFor="email">Email address</label>
            <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            />
           
            <label htmlFor="password">Password</label>
            <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            />
 
            <button
              type="submit"
            >
              Sign in
            </button>
          
        </form>

       
        <span >Or continue with</span>
          
         <a href={BASE_URL + '/auth/google'}>
            <img
            
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            />
            Sign in with Google
        </a>
    </div>
  );
};

export default LoginPage;