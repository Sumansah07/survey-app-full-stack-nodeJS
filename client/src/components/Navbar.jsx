import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/">
          <h1>Survey App</h1>
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          {user ? (
            <>
              <Link to="/create">Create Survey</Link>
              <Link to="/my-surveys">My Surveys</Link>
              <button onClick={onLogout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
