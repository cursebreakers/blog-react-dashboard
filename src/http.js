// http.js

import axios from 'axios';

export const get = async (url, config = {}) => {
  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const post = async (url, data, config = {}) => {
  try {
    const response = await axios.post(url, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
