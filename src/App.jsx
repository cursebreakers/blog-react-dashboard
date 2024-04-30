// App.jsx

import React, { useState, useEffect } from 'react'
import { pingApi, checkAuth } from './api_calls';
import { Auth } from './Auth';
import { Dashboard } from './Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userToken, setUserToken] = useState('');
  
  // Auth checks
  const successfulSignup = (response) => {
    setIsLoggedIn(true);
    setUsername(response.user.username);
  };

  const successfulLogin = (response) => {
    setIsLoggedIn(true);
    setUsername(response.user.username);
  };

  const tokenPresent = async () => {
    const userToken = localStorage.getItem('token');
    if (userToken) {
      try {
        const response = await checkAuth(userToken);
        setIsLoggedIn(true);
        setUsername(response.username)
        setUserToken(userToken);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  };

  // Run tokenPresent on component mount
  useEffect(() => {
    tokenPresent();
  }, []);


  const logout = () => {
    localStorage.removeItem('token');
    setUserToken('');
    setIsLoggedIn(false);
  };

  // Show Dashboard if authed
    // Dashboard components: (feed, viewer, etc)
    
  return (
    <>
      {isLoggedIn ? (
        <Dashboard username={username} token={userToken} onLogout={logout} />      
      ) : (          
        <>
          <Auth onSignupSuccess={successfulSignup} onLoginSuccess={successfulLogin} />        
        </>
      )}
    </>
  );
}

export default App
