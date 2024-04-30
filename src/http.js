// http.js

import axios from 'axios';

// Function to make a generic HTTP GET request
export const get = async (url, config = {}) => {
  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to make a generic HTTP POST request
export const post = async (url, data, config = {}) => {
  try {
    const response = await axios.post(url, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add other HTTP methods as needed (PUT, DELETE, etc.)