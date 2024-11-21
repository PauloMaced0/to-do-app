import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';
// import { Hub } from "aws-amplify/utils";
import { signInWithRedirect, getCurrentUser} from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();

      setUser(currentUser);
      
      const userPayload = {
        username: session.tokens.idToken.payload["email"],
        sub: currentUser.userId,
      };

      // Send user data with Authorization header
      await axios.post("http://localhost:8000/users", userPayload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.tokens.idToken}`,
        },
      });

    } catch (error) {
      console.error(error);
      console.log("Not signed in");
      setUser(null);
    }
  };

  const handleSignIn = async () => {
    // User is logged in, redirect to the reminders page
    if (user) {
      navigate("/reminders"); 
      return;
    }

    try {
      signInWithRedirect({}); // Trigger Hosted UI login
    } catch (err) {
      console.error("Error during sign-in", err);
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md bg-white rounded-lg border shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h2 className="text-2xl font-bold text-center">Welcome to Reminders App</h2>
            <p className="text-center text-sm text-gray-500">
              Stay organized and never forget a task
            </p>
          </div>
          <div className="p-6 pt-0 space-y-4">
            <p className="text-center text-gray-600">
              Reminders App helps you manage your tasks efficiently. Create, prioritize, and track your to-dos with ease.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                id="login-button"
                onClick={() => handleSignIn() }
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2"
              >
              Start Now!
              </button>
            </div>
          </div>
          <div className="flex items-center p-6 pt-0 justify-center">
            <p className="text-sm text-gray-500">
              By using this app, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
