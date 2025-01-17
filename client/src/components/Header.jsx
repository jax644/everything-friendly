import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/EF-leaf.png';
import UserMenu from './UserMenu/UserMenu';


function Header() {

    const { isAuthenticated } = useContext(AuthContext);

    return (
        <header>
          {isAuthenticated 
          ? 
          <UserMenu />
          : 
          <a href="/login"><span>Sign in</span></a>}
          
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