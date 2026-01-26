import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem('token'); // Clear token
    navigate('/login'); // Go to login
  };

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold">
          🐛 BugTracker
        </Link>
        
        <div className="flex gap-4">
          <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
          <button onClick={onLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;