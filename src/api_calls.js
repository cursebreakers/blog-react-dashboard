// API Controller Module - api_calls.js

import axios from 'axios';
import { get, post } from './http';

const PING_API = 'http://192.168.1.242:6969/health';
const BLOG_API = 'http://192.168.1.242:6969/profile';
const API_AUTH = 'http://192.168.1.242:6969/auth';
const POST_API = 'http://192.168.1.242:6969/posts';


export async function pingApi() {
    try {
        const APIstatus = await get(PING_API);
        console.log('API status:', APIstatus);
        return APIstatus
    } catch (error) {
      console.error('Error fetching data:', error);
    }
};

// inAuth
export async function inAuth(userData) {
  try {
      const response = await post(`${API_AUTH}/in`, userData);

      console.log('Auth-In success:', response)
      return {
        token: response.token,
        user: response.user,
      };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Failed to log in');
  }
};

// newAUth
export async function newAuth(userData) {
  try {
      const response = await post(`${API_AUTH}/new`, userData);

      console.log('New Auth success:', response)
      return {
        token: response.token,
        user: response.newUser,
      };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Failed to sign up');
  }
};

// checkAuth
export async function checkAuth(userToken) {
  try {
      const config = {
          headers: {
              Authorization: `Bearer ${userToken}`,
          },
      };
      const response = await get(`${API_AUTH}/check`, config);
      console.log('Auth-check: GOOD', response);
      return response;
  } catch (error) {
      console.error('Error fetching data:', error);
      throw new Error('Failed to check authentication');
  }
};

export async function getBlogs() {
  try {
      const response = await get(BLOG_API);
      console.log('getBlogs:', response)
      return response;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

export async function makeFeed() {
  try {
      const response = await get(POST_API);
      console.log('allPosts:', response)
      return response;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

export async function userBlog(username) {
  try {
      const response = await get(`${BLOG_API}/${username}`);
      console.log('API REQUEST USER + BLOG:', response)
      return response;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export async function blogPost({ blogData, postContent, postTitle, hashtags, isPublic, username, token }) {
  try {

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

      console.log('Making new blog post on: ', blogData.title, 'by', username, 'with token:', token, postContent)
      const response = await post(`${POST_API}/new`, {
        title: postTitle,
        content: postContent,
        hashtags: hashtags,
        public: isPublic,
      }, config);
    

      console.log('New blog post response:', response);
      return response

  } catch (error) {
    console.error('Error creating post:', error);
  }
}

export async function updatePost({ selectedPostId, blogData, postContent, postTitle, token, hashtags, isPublic, username }) {
  try {

      const id = selectedPostId

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      console.log('Making post update on: ', blogData.title, 'by', username, 'with token:', token, 'Post:', postContent)
      const response = await post(`${POST_API}/edit/${id}`, {
        title: postTitle,
        content: postContent,
        hashtags: hashtags,
        public: isPublic,
      }, config);

      console.log('Post update response:', response);
      return response

    } catch (error) {
      console.error('Error updating post:', error);
    }
  }

export async function postComment({ selectedPostId, token, username, commentText }) {
  try {

      const id = selectedPostId

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      console.log('Making comment on: ', id, 'by', username, 'with token:', token, 'Comment:', commentText)
      const response = await post(`${POST_API}/${id}/comments`, {
        username: username,
        text: commentText,
      }, config);

      console.log('Post update response:', response);
      return response

    } catch (error) {
      console.error('Error updating post:', error);
    }
  }

  export async function deletePost({ selectedPostId, blogData, postTitle, token, username }) {
    try {
  
        const id = selectedPostId
  
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
  
        console.log('Deleting post on: ', blogData.title, 'by', username, 'with token:', token, 'Post:', id)
        const response = await post(`${POST_API}/delete/${id}`, {
          title: postTitle,
          username: username,
        }, config);
  
        console.log('Post update response:', response);
        return response
  
      } catch (error) {
        console.error('Error updating post:', error);
      }
    }

  export async function updateAccount({ token, username, formData  }) {
    try {

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      console.log('Posting to API: ', formData, token, username);

      const response = await post(`${BLOG_API}/${username}`, {
        newTitle: formData.newTitle,
        userBefore: username,
        newUsername: formData.newUsername,
        category: formData.newTags,
        links: formData.link
      }, config);

      console.log('Account update response:', response);
      return response
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  }