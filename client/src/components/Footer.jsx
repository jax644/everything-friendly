import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Footer () {
    const {logout} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log('Logging out...')
        logout();
        console.log('Redirecting to login page...')
        navigate('/login');
    }

    return (
        <footer>
            <button onClick={handleLogout}>Log out</button> 
        </footer>
    );
}

export default Footer;