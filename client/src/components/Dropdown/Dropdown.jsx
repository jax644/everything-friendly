import './Dropdown.css';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function UserMenu() {
  
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    console.log(user)

    const handleLogout = () => {
        console.log('Logging out...')
        logout();
        console.log('Redirecting to login page...')
        navigate('/login');
    }

    return (

      <div className="dropdown">
      
        <div className="dropdown-trigger">
            <img 
            src={user.avatar}
            alt={user.name} 
            className="avatar"
            />
        </div>

        <div className="dropdown-content">
          <a href="/dashboard">Dashboard</a>
          <a href="#" onClick={handleLogout}>Sign Out</a>
        </div>

      </div>
    );
  }
  
  export default UserMenu;