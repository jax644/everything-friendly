import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {

    const { user, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    
    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    return (
        <div className="dashboard">
            <h1>{user.name}'s Dashboard</h1>
            <hr/>
            <h2>My Recipes</h2>
            <p>No recipes to show. Try generating a new recipe now!</p>
            <hr/>
        </div>
    );
}

export default Dashboard;