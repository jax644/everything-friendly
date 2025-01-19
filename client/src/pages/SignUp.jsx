import { useState,useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function SignUpPage() {
    const { register, isAuthenticated } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
        await register(name, email, password);
        navigate('/dashboard');
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">First name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Your name"
                    />
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
                        placeholder="New password"
                    />
                <button type="submit" className="secondary-button">Sign up</button>
            </form>

            <p>or</p>

            <a href= {BASE_URL + '/auth/google'}>
                <button>
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google logo"
                        style={{ width: '15px', height: '15px', margin: '5px'}}
                    />
                    <span>Sign up with Google</span>
                </button>
            </a>
        </>
    )
}

export default SignUpPage;