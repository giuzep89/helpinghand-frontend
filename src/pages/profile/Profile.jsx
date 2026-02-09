import { useState } from 'react';
import './Profile.css';
import Avatar from '../../components/avatar/Avatar.jsx';
import Button from '../../components/button/Button.jsx';
import testDatabase from '../../constants/testDatabase.json';

function Profile() {
  const [user, setUser] = useState(testDatabase.currentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: user.email,
    age: user.age,
    location: user.location,
    competencies: user.competencies
  });

  function handleEdit() {
    setIsEditing(true);
  }

  function handleCancel() {
    setFormData({
      email: user.email,
      age: user.age,
      location: user.location,
      competencies: user.competencies
    });
    setIsEditing(false);
  }

  function handleSave() {
    setUser((prevUser) => {
      return { ...prevUser, ...formData };
    });
    setIsEditing(false);
    console.log(formData); // TODO remove this later
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => {
      return { ...prevData, [name]: value };
    });
  }

  function handleDelete() {
    // TODO: Implement delete functionality after API integration
    console.log('Delete account', user.username);
  }

  return (
    <div className="profile">
      <div className="profile-card">
        <Avatar size="large" alt={user.username} />
        <h1>{user.username}</h1>

        {isEditing ? (
          <div className="profile-form">
            <label>
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </label>
            <label>
              <span>Password</span>
              <input type="password" value="••••••••" disabled />
            </label>
            <label>
              <span>Age</span>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
            </label>
            <label>
              <span>Location</span>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </label>
            <label>
              <span>Things I can help with</span>
              <input
                type="text"
                name="competencies"
                value={formData.competencies}
                onChange={handleChange}
              />
            </label>
            <div className="profile-actions">
              <Button onClick={handleSave}>Save</Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="profile-details">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Password:</strong> ••••••••</p>
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>Location:</strong> {user.location}</p>
            <p><strong>Things I can help with:</strong> {user.competencies}</p>
            <div className="profile-actions">
              <Button onClick={handleEdit}>Edit</Button>
              <Button onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
