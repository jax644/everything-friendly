import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import logo from '../../assets/EF-leaf.png';
import Dropdown from './Dropdown.jsx';
import './Header.css';


function Header() {

    const { isAuthenticated } = useContext(AuthContext);

    return (
        <header>
          <div className="nav-container">
              {isAuthenticated 
                  ? 
                  <Dropdown />
                  : 
                  <nav>
                      <a href="/login">Sign in</a>
                  </nav>
              }
          </div>
         
          
            <div>
              <a href="/">
                <h1>Everything-Friendly</h1>
              </a>
              <img 
                className="logo" 
                src={logo} 
                alt="Everything-Friendly logo (two leaves resembling the vegetarian symbol on restaurant menus)"
              />
          </div>
          <h2>Any recipe, your way.</h2>
        </header>
    );
}

export default Header;