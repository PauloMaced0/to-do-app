import React from 'react';
import { signOut } from 'aws-amplify/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserCircleIcon, ArrowLeftStartOnRectangleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSignOut() {
    await signOut()
  }

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Conditional Navbar Content */}
          {location.pathname === '/profile' ? (
            <div className="flex items-center">
              <button
                onClick={() => navigate('/reminders')}
                className="flex items-center text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Back to Tasks
              </button>
            </div>
          ) : (
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Reminders App
              </h1>
            )}

          {/* Common Navigation Links */}
          <div className="ml-4 flex items-center space-x-4 md:ml-6">
            {location.pathname !== '/profile' && (
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <UserCircleIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Profile
              </button>
            )}
            <button
              onClick={() => {
                handleSignOut(); 
              }}
              className="flex items-center text-red-600 hover:text-red-500 px-3 py-2 text-sm font-medium rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <ArrowLeftStartOnRectangleIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
