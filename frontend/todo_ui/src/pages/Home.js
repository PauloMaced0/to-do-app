import React, { useEffect, useState } from 'react';
import { Hub } from "aws-amplify/utils";
import { signInWithRedirect, getCurrentUser} from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";

function Home() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [customState, setCustomState] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signInWithRedirect":
          getUser();
          break;
        case "signInWithRedirect_failure":
          setError("An error has occurred during the OAuth flow.");
          break;
        case "customOAuthState":
          setCustomState(payload.data); // this is the customState provided on signInWithRedirect function
          break;
      }
    });

    getUser();

    return unsubscribe;
  }, []);

  const getUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
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
      setError(err.message);
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