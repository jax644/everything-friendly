import logo from '../assets/EF-leaf.png';

function Header({isAuthenticated, user}) {
    return (
        <header>
          {isAuthenticated 
          ? 
          <p>Logged in as: {user.username}</p> 
          : 
          <a href="/login"><span>Sign in</span></a>}
          <h1>Everything-Friendly</h1>
          <img className="logo" src={logo} alt="Everything-Friendly logo (two leaves resembling the vegetarian symbol on restaurant menus)"/>
          <h2>Any recipe, your way.</h2>
        </header>
    );
}

export default Header;