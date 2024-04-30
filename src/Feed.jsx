// Feed reader & comments component - Feed.jsx

import React, { useState, useEffect } from 'react';
import { makeFeed, postComment } from './api_calls';


export function Feed({ blogData, username, token }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log('Does user have token?', token)

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await makeFeed();
        if (response && response.posts) { 
          const filteredPosts = response.posts.filter(post => post.public !== false);
          setPosts(filteredPosts);
        } else {
          console.error('Error: Response or blogs array not found');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);


  const submitComment = async (selectedPostId, commentText) => {
    
    try {
      // Assuming token and username are available in the component's scope
      const response = await postComment({ selectedPostId, token, username, commentText });
      // Update the posts array or perform any necessary actions upon successful comment posting
      console.log('Comment posted successfully:', response);
      
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div className='feedTray'>
    {loading ? (
      <p>Loading...</p>
    ) : (
      posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
           .map(post => (
             <FeedPost key={post._id} post={post} onPostComment={submitComment} />
           ))
    )}
      <div className='feedEnd'>
        <p>End of Feed</p>
      <a href="/">Refresh</a>
      </div>
  </div>
  );
}

function FeedPost({ post, onPostComment }) {
  const [commentText, setCommentText] = useState('');

  const commentClickSubmit = async () => {
    if (commentText.trim() !== '') {
      await onPostComment(post._id, commentText);
      setCommentText('');
      window.location.reload();
    }
  };

  return (
    <div className="feedPost">
      <div className="mainPostContent">
        <h3>{post.title}</h3>
        <p>"{post.content}"</p>
      </div>
      <div className="postThumbprint">
        <p>~{post.author}</p>
        <p className="timeStamp">{post.timestamp}</p>
      </div>
      <div className="postMeta">
        <p>{post.hashtags}</p>
      </div>
      <div className='commentModule'>
        <CommentModule post={post} />
        <div className="commentMaker">
          <h4>Add a comment:</h4>
          <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} />
          <button onClick={commentClickSubmit}>Submit</button>
        </div>
      </div>
    </div>
  )
}

function CommentModule({ post }) {

  return (
    <div>
      {post.comments && post.comments.map(comment => (
        <div className="comment" key={comment._id}>
          <p>"{comment.text}"</p>
          <h4>~{comment.username}</h4>
          <p>{comment.timestamp}</p>
        </div>
      ))}
    </div>
  );
}

