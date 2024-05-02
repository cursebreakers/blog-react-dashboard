// Post.jsx - Post editor component

import React, { useState } from 'react';
import { blogPost, updatePost, deletePost } from './api_calls'

export function Editor({ blogData, username, toggleEditor }) {
  const [postResponse, setPostResponse] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const token = localStorage.getItem('token'); 

  const postSelector = (e) => {
    const postId = e.target.value;
    setSelectedPostId(postId);
    if (postId === '') {
      setPostTitle('');
      setPostContent('');
      setHashtags([]);
      setIsPublic(false);
    } else {
      const selectedPost = blogData.posts.find(post => post._id === postId);
      if (selectedPost) {
        setPostTitle(selectedPost.title);
        setPostContent(selectedPost.content);
        setHashtags(selectedPost.hashtags);
        setIsPublic(selectedPost.public);
      }
    }
    setShowDelete(false);
  };

  const postSubmit = async (e) => {
    const token = localStorage.getItem('token'); 

    e.preventDefault();
    try {
      let message;
      if (selectedPostId) {
        console.log('submitting:', postContent);
        message = await updatePost({ selectedPostId, blogData, postContent, postTitle, hashtags, isPublic, username, token });
        setPostResponse('Updated successfully.')
      } else {
        console.log('submitting:', postContent);
        message = await blogPost({ blogData, postContent, postTitle, hashtags, isPublic, username, token });
        setIsPublic(false)
        setPostTitle('')
        setPostContent('')
        setHashtags([])
        setPostResponse('New Post Success')
      }
      console.log('Response message:', message);
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  const openDeleteView = () => {
    console.log('displaying delete modal')
    setShowDelete(true);
  };

  const closeDelete = () => {
    setShowDelete(false);
  };

  return (
    <>
    <div className='editor'>
    {postResponse && (
        <div className="message">
          <p>{postResponse}</p>
        </div>
      )}
    <select className="postDropDown" value={selectedPostId} onChange={postSelector}>
      <option value="">New Post</option>
      {blogData && blogData.posts.map(post => (
        <option key={post._id} value={post._id}>{post.title}</option>
      ))}
    </select>
    {showDelete && (
        <ConfirmDelete
          selectedPostId={selectedPostId}
          postTitle={postTitle}
          blogData={blogData}
          username={username}
        />
      )}
    {selectedPostId && (
        <button className="postDeleteButton" onClick={showDelete ? closeDelete : openDeleteView}>
          {showDelete ? 'Cancel Delete' : 'Delete'}
        </button>
      )}
      
    <form onSubmit={postSubmit}>
      <input
        type="text"
        value={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
        placeholder="Enter a title"
      />
      <textarea
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        placeholder="Write your post here..."
      />
      <input
        type="text"
        value={hashtags.join(',')}
        onChange={(e) => setHashtags(e.target.value.split(','))}
        placeholder="#hashtags"
      />
      <label className='publicCheck'>Make post public:
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
      </label>
      <div className="formBtnBar">
        <button type="submit">Submit</button>
        <button onClick={toggleEditor}>Cancel</button>
      </div>
    </form>
  </div>
  </>
   );
}

export function ConfirmDelete({ selectedPostId, postTitle, blogData, username }) {

  const handleDelete = async (e) => {
    console.log('Confirming delete')

    e.preventDefault(); 

    const token = localStorage.getItem('token'); 

    try {
      const response = await deletePost({ selectedPostId, postTitle, blogData, token, username });
      console.log('Delete post response:', response);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className='confirmDeleteDiv'>
      <h3>Confirm Delete</h3>
      <form onSubmit={handleDelete}>
        <p>This action cannot be undone.</p>
        <button type="submit">Confirm Delete</button>
      </form>
    </div>

  )
}

