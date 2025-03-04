import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../utils';

function LoginPage () {
    console.log('Made it to the login page...')
    const { login, isAuthenticated } = useContext(AuthContext);
    console.log(`isAuthenticated: ${isAuthenticated}`)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    // Redirect user to their dashboard if they are already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    // Handle local auth login form submission
    async function handleSubmit (event) {
        event.preventDefault();
        
        // Login the user
        await login(email, password);

        // Redirect the user to the dashboard
        navigate('/dashboard');
    }

  return (
    <>

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
            <button type="submit" className="secondary-button">Sign in</button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <p>or</p>

        <a href= {BASE_URL + '/auth/google'}>
            <button>
                <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google logo"
                    style={{ width: '15px', height: '15px', margin: '5px'}}
                />
                <span>Sign in with Google</span>
            </button>
        </a>

        <br/><br/>
        <p>Don't have an account? 
            <a href="/signup"><p>Sign up</p></a>
            
        </p>
    </>
  );
};

export default LoginPage;