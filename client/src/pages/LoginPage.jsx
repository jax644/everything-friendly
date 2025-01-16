import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage () {
    const { isAuthenticated, setUser, setIsAuthenticated } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://everything-friendly.onrender.com' 
    : 'http://localhost:3000'

    if (isAuthenticated) {
        navigate('/dashboard');
        return null
    }

    async function handleSubmit (event) {
        event.preventDefault();

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
        navigate('/');
        } catch (err) {
        setError(err.message);
        }
    };

  return (
    <div>
        <h2>Sign in </h2>

        <a href= {BASE_URL + '/auth/google'}>
            <button>
                <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google logo"
                    style={{ width: '15px', height: '15px' }}
                />
                Continue with Google
            </button>
        </a>

        <p>or</p>

        <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email address</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Your email"
                />
            <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Your password"
                />
            <button type="submit">Sign in</button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <p>Don&apos;t have an account? 
            <a href="/register">Register</a>
        </p>
    </div>
  );
};

export default LoginPage;