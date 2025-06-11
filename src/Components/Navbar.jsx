// src/Components/Shared/Navbar.js

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext'; // Ensure this path is correct
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';

// No need for explicit interfaces in JavaScript.
// The structure of the User object will be inferred at runtime.

const Navbar = () => {
  // Destructure isAuthenticated and loading from useAuth()
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Define the structure of a navigation link implicitly
  // const NavLinkItem = {
  //   label: string;
  //   to: string;
  // }

  // Determine navigation links based on user role
  const getNavLinks = () => { // Removed type annotation for return value
    // If authentication is still loading, return an empty array or loading links
    if (loading) return [];
    // If not authenticated, show public links (or no links if they require auth)
    if (!isAuthenticated) {
      return [
        { label: 'Events', to: '/' }, // Example public link
      ];
    }

    // Authenticated user links based on role
    switch (user?.role) { // Use optional chaining just in case user is null/undefined
      case 'admin':
        return [
          { label: 'Dashboard', to: '/admin/dashboard' },
          { label: 'All Events', to: '/admin/allEvents' },
          { label: 'Users', to: '/admin/allusers' },
          { label: 'Organizers', to: '/admin/allorganizers' },
          { label: 'Registrations', to: '/admin/registrations' },
          { label: 'Pending Events', to: '/admin/pending-events' },
          { label: 'Create Event', to: '/admin/events/create' },
        ];
      case 'organizer':
        return [
          { label: 'Dashboard', to: '/organizer/dashboard' },
          { label: 'My Events', to: '/organizer/myevents' },
          { label: 'Create Event', to: '/organizer/createevent' },
          { label: 'Stats', to: '/organizer/stats/overview' },
        ];
      case 'user':
        return [
          { label: 'Events', to: '/' },
          { label: 'My Tickets', to: '/user/tickets' },
          { label: 'Profile', to: '/user/profile' },
          { label: 'Dashboard', to: '/user/dashboard' },
        ];
      default:
        return [];
    }
  };

  // Check if a link is active for highlighting
  const isActive = (path) => location.pathname === path; // Removed type annotation

  const currentNavLinks = getNavLinks(); // Get links for current state

  return (
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-indigo-400">
          Eventify
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} aria-label="Toggle navigation menu">
            {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex space-x-6 items-center">
          {/* Show loading indicator or nothing while authentication is pending */}
          {loading ? (
            <li className="text-gray-500">Loading...</li>
          ) : (
            <>
              {/* Render common public links always, or only if not authenticated */}
              {!isAuthenticated && ( // Only show Login/Register if NOT authenticated
                <>
                  <li><Link to="/login" className="hover:text-indigo-400 transition">Login</Link></li>
                  <li><Link to="/register" className="hover:text-indigo-400 transition">Register</Link></li>
                </>
              )}

              {/* Render dynamic links based on user role */}
              {isAuthenticated && currentNavLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`hover:text-indigo-400 transition ${
                      isActive(link.to) ? 'text-indigo-400 font-semibold' : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              {/* User profile icon and Logout button (only if authenticated) */}
              {isAuthenticated && user && (
                <>
                  <li>
                    <Link to={`/${user.role}/profile`} className="flex items-center space-x-2 text-white hover:text-indigo-400 transition" aria-label="Go to profile">
                        <FaUserCircle size={24} />
                        <span className="hidden lg:inline">{user.name}</span> {/* Show name on larger screens */}
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-white text-sm transition"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </>
          )}
        </ul>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <ul className="md:hidden bg-gray-800 px-6 py-4 space-y-3 animate-slide-down">
          {loading ? (
            <li className="text-gray-500">Loading...</li>
          ) : (
            <>
              {!isAuthenticated && (
                <>
                  <li><Link to="/login" onClick={toggleMenu} className="block py-1 text-white hover:text-indigo-400 transition">Login</Link></li>
                  <li><Link to="/register" onClick={toggleMenu} className="block py-1 text-white hover:text-indigo-400 transition">Register</Link></li>
                </>
              )}
              {isAuthenticated && currentNavLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={toggleMenu} // Close menu on link click
                    className={`block py-1 ${
                      isActive(link.to) ? 'text-indigo-400 font-semibold' : 'text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {isAuthenticated && (
                <li>
                  <button
                    onClick={() => {
                      toggleMenu(); // Close menu
                      handleLogout(); // Log out
                    }}
                    className="w-full text-left text-red-400 hover:text-red-500 py-1"
                  >
                    Logout
                  </button>
                </li>
              )}
            </>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;