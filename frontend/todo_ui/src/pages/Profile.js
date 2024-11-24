import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { getUserProfile, getUserTaskStats, updateUserProfile } from '../services/api';
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import EditableField from '../components/EditableField';
import InfoRow from '../components/InfoRow';

function UserProfile() {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [accountDate, setAccountDate] = useState("");
  const [nTasks, setNTasks] = useState("");
  const [tasksCompleted, setTasksCompleted] = useState("");

  // Backup states to restore the original values if the user cancels the edit
  const [backupName, setBackupName] = useState(name);
  const [backupPhone, setBackupPhone] = useState(phone);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const currentUser = await getCurrentUser();
        const session = await fetchAuthSession();
        const userData = await getUserProfile(currentUser.userId, session.tokens.idToken);
        const userTasksStats = await getUserTaskStats(currentUser.userId, session.tokens.idToken);

        setName(userData.full_name || "");
        setPhone(userData.phone_number || "");
        setEmail(userData.username || "");
        setAccountDate(formatDate(userData.created_at) || "");
        setNTasks(userTasksStats.total_tasks_created || 0);
        setTasksCompleted(userTasksStats.total_tasks_completed || 0);
        setBackupName(userData.full_name || "");
        setBackupPhone(userData.phone_number || "");
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

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
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <EditableField
                    label="Full name"
                    value={name}
                    isEditing={isEditingName}
                    onEditToggle={() => setIsEditingName(!isEditingName)}
                    onSave={() => saveEdit("name")}
                    onCancel={() => cancelEdit("name")}
                    onChange={(newName) => setName(newName)}
                    bgColor={true}
                  />
                  <EditableField
                    label="Phone number"
                    value={phone}
                    isEditing={isEditingPhone}
                    onEditToggle={() => setIsEditingPhone(!isEditingPhone)}
                    onSave={() => saveEdit("phone")}
                    onCancel={() => cancelEdit("phone")}
                    onChange={(newPhone) => setPhone(newPhone)}
                    bgColor={false}
                  />
                  <InfoRow
                    label="Email address"
                    value={email}
                    bgColor={true}
                  />
                  <InfoRow
                    label="Tasks created"
                    value={nTasks}
                    bgColor={false}
                  />
                  <InfoRow
                    label="Tasks completed"
                    value={tasksCompleted}
                    bgColor={true}
                  />
                  <InfoRow
                    label="Account created"
                    value={accountDate}
                    bgColor={false}
                  />
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
