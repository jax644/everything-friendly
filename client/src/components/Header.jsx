import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/EF-leaf.png';


function Header() {

    const { isAuthenticated, user } = useContext(AuthContext);
    return (
        <header>
          {isAuthenticated 
          ? 
          <p>Logged in as: {user.name}</p> 
          : 
          <a href="/login"><span>Sign in</span></a>}
          <h1>Everything-Friendly</h1>
          <img className="logo" src={logo} alt="Everything-Friendly logo (two leaves resembling the vegetarian symbol on restaurant menus)"/>
          <h2>Any recipe, your way.</h2>
        </header>
    );
}

export default Header;