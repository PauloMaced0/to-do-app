import React from 'react';
import { useNavigate } from 'react-router-dom';
import { userCircleIcon, arrowLeftStartOnRectangleIcon } from '@heroicons/react/outline';

function NavBar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* App Logo/Title */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Reminders App
            </h1>
          </div>

          {/* Navigation Buttons */}
          <div className="ml-4 flex items-center space-x-4 md:ml-6">
            {/* Profile Button */}
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <userCircleIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Profile
            </button>

            {/* Logout Button */}
            <button
              onClick={() => {
                // Add logout functionality here
                console.log('Logging out...');
              }}
              className="flex items-center text-red-600 hover:text-red-500 px-3 py-2 text-sm font-medium rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <arrowLeftStartOnRectangleIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
