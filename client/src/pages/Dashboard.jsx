import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {

    const { user, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    
    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    return (
        <div>
            <h1>{user.name}'s Dashboard</h1>
        </div>
    );
}

export default Dashboard;