// Dashboard.jsx - Dashboard components

import React, { useState, useEffect } from 'react';
import { getBlogs, updateAccount, userBlog } from './api_calls';
import { Editor } from './Post';
import { Feed } from './Feed'


function Dashboard({ username, onLogout, token }) {
  const [showSettings, setShowSettings] = useState(false);
  const [showEditor, setshowEditor] = useState(false);
  const [blogData, setBlogData] = useState(null);
  const [gearboxOpen, setGearboxOpen] = useState(false);


  useEffect(() => {
    // Fetch the blog title for the current user
    const getUserBlog = async () => {
      try {
        const response = await userBlog(username);
        // Assuming the response contains the blog title
        setBlogData(response);
      } catch (error) {
        console.error('Error fetching blog title:', error);
      }
    };

    getUserBlog();
  }, [username]);
  

  const handleLogout = () => {
    onLogout();
  };

  const toggleEditor = () => {
    setshowEditor(!showEditor);
    setGearboxOpen(false);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const toggleGearbox = () => {
    setGearboxOpen(!gearboxOpen);
    setshowEditor(false);
  };

  return (
    <div className='dashBoard'>
      <div className='toolBar'>
        <button onClick={toggleEditor}>New / Edit</button>
        <button className="gearBox" onClick={toggleGearbox}>{username}</button>
      </div>
      {showEditor && <Editor blogData={blogData} toggleEditor={toggleEditor} username={username} />}
      {gearboxOpen && (
        <div className="gearSet">
          <button onClick={() => { window.location.href = 'https://cursebreakers.github.io/blog-static-viewer/'; }}>Public</button>
          {!showSettings && <button onClick={toggleSettings}>Settings</button>}
          {showSettings && <AccountSettings toggleSettings={toggleSettings} username={username} blogData={blogData} token={token} />}
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
      {!showEditor && !gearboxOpen && <Feed blogData={blogData} username={username} token={token} />}
    </div>
  );
}

function AccountSettings({ blogData, username, token, toggleSettings }) {
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    newUsername: username,
    newTitle: blogData.title,
    newTags: blogData.category,
    link: blogData.links,
  });

  console.log('Editing profile: ', blogData) 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const saveAccountDetails = async () => {
    try {
        // POST updates to /profile/:username
      console.log('Updating account: ', username, formData, token )
      const response = await updateAccount({
        token: token,
        username: username,
        formData: formData,
      });      
      
      console.log('Account updated: ', response)
              
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  const onSaveClick = async () => {
    console.log('SAVE CLICKED:', formData)
    saveAccountDetails(formData);    
  }
    return (
      <div className="settings-modal">
      <form className='settings-form'>
        {isEditing ? (
          <>
            <label>
              <h4>Username:</h4>
            </label>
            <input
                type="text"
                name="newUsername"
                value={formData.newUsername}
                onChange={handleInputChange}
              />
            <label>
             <h4>Title:</h4>
            </label>
            <input
                type="text"
                name="newTitle"
                value={formData.newTitle}
                onChange={handleInputChange}
              />
            <label>
             <h4>Tags:</h4>
            </label>
            <input
                type="text"
                name="newTags"
                value={formData.newTags}
                onChange={handleInputChange}
              />
            <label>
              <h4>External Link:</h4>
            </label>
            <input
                type="text"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
              />
            <button type="button" onClick={onSaveClick}>Save</button>
            <button type="button" onClick={() => { setIsEditing(false); toggleSettings(); }}>Cancel</button>
          </>
        ) : (
          <>
            <div onClick={() => setIsEditing(true)}>
              <h4>Username:</h4>
              <p>{username}</p>
            </div>
            <div onClick={() => setIsEditing(true)}>
              <h4>Title:</h4>
              <p>{blogData.title}</p>
            </div>
            <div onClick={() => setIsEditing(true)}>
              <h4>Tags:</h4>
              <h4>{blogData.category}</h4>
            </div>
            <div onClick={() => setIsEditing(true)}>
            <h4>External Link:</h4>
            <p>{blogData.links}</p>
            </div>

            <button type="button" onClick={() => setIsEditing(true)}>Edit</button>            
            <button type="button" onClick={toggleSettings}>Cancel</button>
          </>
        )}
      </form>
    </div>  
    )
}


export { Dashboard };
