import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import defaultUserAvatar from '../../assets/default-user-avatar.png';

function Dropdown() {
  
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    console.log(user)

    async function handleLogout () {
        console.log('Logging out...')
        await logout();
        console.log('Redirecting to login page...')
        navigate('/login');
    }

    const handleDropdownClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    return (
      <div className="dropdown">
      
        <div className="dropdown-trigger" onClick={handleDropdownClick}>
            <img 
            src={user.avatar || defaultUserAvatar}
            alt={user.name} 
            className="avatar"
            />
        </div>

        <div className={isDropdownOpen ? "dropdown-content show" : "dropdown-content"}>
          <nav>
            <a href="/dashboard">Dashboard</a>
            <a href="#" onClick={handleLogout}>Sign Out</a>
          </nav>
        </div>
      </div>
    );
  }
  
  export default Dropdown;