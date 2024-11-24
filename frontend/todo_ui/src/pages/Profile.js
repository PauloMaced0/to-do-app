import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { PencilIcon } from '@heroicons/react/24/outline';
import { getUserProfile, updateUserProfile } from '../services/api';
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";

function UserProfile() {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [accountDate, setAccountDate] = useState("");
  const [nTasks, setNTasks] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);

  // Backup states to restore the original values if the user cancels the edit
  const [backupName, setBackupName] = useState(name);
  const [backupPhone, setBackupPhone] = useState(phone);

  // Handlers for toggling edit mode
  const handleNameEditToggle = () => setIsEditingName(!isEditingName);
  const handlePhoneEditToggle = () => setIsEditingPhone(!isEditingPhone);

  // Handlers for saving changes
  const handleNameChange = (e) => setName(e.target.value);
  const handlePhoneChange = (e) => setPhone(e.target.value);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const fetchUserProfile = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const userData = await getUserProfile(currentUser.userId, session.tokens.idToken);
      setName(userData.full_name || "");
      setPhone(userData.phone_number || "");
      setEmail(userData.username || "");
      setAccountDate(formatDate(userData.created_at) || "");
      setBackupName(userData.full_name || "");
      setBackupPhone(userData.phone_number || "");
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const cancelEdit = (field) => {
    if (field === "name") {
      setName(backupName);
    } else if (field === "phone") {
      setPhone(backupPhone);
    }
    setIsEditingName(false);
    setIsEditingPhone(false);
  };

  // Save the edited value
  const saveEdit = async (field) => {
    const data = {
      full_name: null,
      phone_number: null,
    };
    if (field === "name") {
      data.full_name = name;
      setBackupName(name);
    } else if (field === "phone") {
      data.phone_number = phone;
      setBackupPhone(phone);
    } 
    const currentUser = await getCurrentUser();
    const session = await fetchAuthSession();
    const userId = currentUser.userId 
    await updateUserProfile(userId, data, session.tokens.idToken);
    setIsEditingName(false);
    setIsEditingPhone(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <NavBar />
      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    User Profile
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Personal information and application details.
                  </p>
                </div>
                <button
                  type="button"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium 
                  hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Change Password
                </button>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Full name</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                      {isEditingName ? (
                        <input
                          type="text"
                          value={name}
                          onChange={handleNameChange}
                          className="border-gray-300 border px-3 py-1 rounded-md"
                        />
                      ) : (
                          name
                        )}
                    </dd>
                    <dd className="mt-1 sm:mt-0 sm:col-span-1 flex justify-end">
                      {isEditingName ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => saveEdit("name")}
                            className="flex items-center px-3 py-1 border border-green-600 text-green-600 rounded-md text-sm hover:bg-green-100"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => cancelEdit("name")}
                            className="flex items-center px-3 py-1 border border-red-600 text-red-600 rounded-md text-sm hover:bg-red-100"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                          <button
                            onClick={handleNameEditToggle}
                            className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Edit
                          </button>
                        )}
                    </dd>
                  </div>

                  {/* Phone Number Field */}
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                      {isEditingPhone ? (
                        <input
                          type="text"
                          value={phone}
                          onChange={handlePhoneChange}
                          className="border-gray-300 border px-3 py-1 rounded-md"
                        />
                      ) : (
                          phone
                        )}
                    </dd>
                    <dd className="mt-1 sm:mt-0 sm:col-span-1 flex justify-end">
                      {isEditingPhone ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => saveEdit("phone")}
                            className="flex items-center px-3 py-1 border border-green-600 text-green-600 rounded-md text-sm hover:bg-green-100"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => cancelEdit("phone")}
                            className="flex items-center px-3 py-1 border border-red-600 text-red-600 rounded-md text-sm hover:bg-red-100"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                          <button
                            onClick={handlePhoneEditToggle}
                            className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Edit
                          </button>
                        )}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Email address</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                      {email} 
                    </dd>
                    <dd className="mt-1 sm:mt-0 sm:col-span-1 flex justify-end">
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Tasks created</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      42
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Tasks completed</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      38
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Account created</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {accountDate}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; 2023 Reminders App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default UserProfile;
