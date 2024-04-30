// Auth.jsx

import React, { useState } from 'react';
import { newAuth, inAuth } from './api_calls';

function Login({ onLogin, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    error: '',
  });

  const { email, password, error } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userData = { email, password };
      const { token, user } = await inAuth(userData);

      localStorage.setItem('token', token);
      console.log('Login successful. Token:', token);
      console.log('User info:', user);

      setFormData({ email: '', password: '', error: ''});

      onLoginSuccess({ user });
      window.location.reload();
    } catch (error) {
      console.error('Error logging in:', error.message);
      setFormData({ ...formData, error: 'Invalid credentials' });
    }
  };

  return (
    <div>
      <form className='auth-form' onSubmit={handleLogin}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={handleChange}
        />
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}

function Signup({ onSignup, onSignupSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    error: '',
  });

  const { username, email, password, confirmPassword, error } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        username,
        email,
        password,
        confirmPassword,
      };

      const { token, user } = await newAuth(userData); 

      localStorage.setItem('token', token);
      console.log('Signup successful. Token:', token, user);

      // Reset form data after successful signup
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        error: ''
      });

      // Move user to dashboard once signed in (after token assignment)
      onSignupSuccess({ user });
      window.location.reload();

    } catch (error) {
      console.error('Error signing up:', error.message);
      setFormData({ ...formData, error: 'Invalid credentials' });
      // Handle error, such as displaying an error message to the user
    }
  };

  return (
    <div>
      <form className='auth-form' onSubmit={handleSignup}>
        {error && (
          <p style={{ color: 'red' }}>
            {error} - Ensure password is at least 8 characters long. Username may already exist, etc.
          </p>
        )}
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
        />
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
}

export function Auth({ onSignupSuccess, onLoginSuccess }) {
  const [showSignup, setShowSignup] = useState(false);

  const toggleSignup = () => {
    setShowSignup(!showSignup);
  };

  const handleLogin = () => {
    // Handle login logic
    console.log('Login action');
  };

  const handleSignup = () => {
    // Handle signup logic
    console.log('Signup action');
    
  };

  return (
    <>
      <div className="auth">
        <h1>Hello!</h1>
        {showSignup ? (
          <Signup onSignup={handleSignup} onSignupSuccess={onSignupSuccess} />
        ) : (
          <Login onLogin={handleLogin} onLoginSuccess={onLoginSuccess} />
        )}
        <a onClick={toggleSignup}>
          {showSignup ? 'Already have an account? Log in' : 'Don\'t have an account? Sign up'}
        </a>
        <h3><a href="http://192.168.1.242:8080">Skip login</a></h3>
      </div>
    </>
  );
}