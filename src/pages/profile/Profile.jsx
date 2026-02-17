import { useState } from 'react';
import { useForm } from 'react-hook-form';
import './Profile.css';
import Avatar from '../../components/avatar/Avatar.jsx';
import Button from '../../components/button/Button.jsx';
import Input from '../../components/input/Input.jsx';
import testDatabase from '../../constants/testDatabase.json';

function Profile() {
  const [user, setUser] = useState(testDatabase.currentUser);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      age: user.age,
      location: user.location,
      competencies: user.competencies,
    },
  });

  function handleEdit() {
    setIsEditing(true);
  }

  function handleCancel() {
    reset({
      age: user.age,
      location: user.location,
      competencies: user.competencies,
    });
    setIsEditing(false);
  }

  function onSave(data) {
    setUser((prevUser) => {
      return { ...prevUser, ...data };
    });
    setIsEditing(false);
    console.log(data); // TODO remove this later
  }

  function handleDelete() {
    // TODO: Implement delete functionality after API integration
    console.log('Delete account', user.username);
  }

  return (
    <div className="profile inner-container">
      <div className="profile-card">
        <Avatar src={user.profilePicture} size="large" alt={user.username} />
        <h1>{user.username}</h1>
        <hr className="profile-divider" />

        {isEditing ? (
          <form className="profile-form" onSubmit={handleSubmit(onSave)}>
            <Input
              label="Email"
              type="email"
              value={user.email}
              disabled
            />
            <Input
              label="Password"
              type="password"
              value="••••••••"
              disabled
            />
            <Input
              label="Age"
              type="number"
              register={register("age", {
                required: "Age is required",
                min: { value: 18, message: "You must be at least 18 years old" },
                max: { value: 150, message: "Age must be 150 or below" },
              })}
              error={errors.age}
            />
            <Input
              label="Location"
              type="text"
              register={register("location")}
            />
            <Input
              label="Things I can help with"
              type="text"
              register={register("competencies")}
            />
            <div className="profile-actions">
              <Button type="submit">Save</Button>
              <Button type="button" variant="delete" onClick={handleCancel}>Cancel</Button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Password:</strong> ••••••••</p>
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>Location:</strong> {user.location}</p>
            <p><strong>Things I can help with:</strong> {user.competencies}</p>
            <p><strong>Profile picture:</strong> <a href="#" className="profile-upload-link">Upload / update</a></p>
            <div className="profile-actions">
              <Button onClick={handleEdit}>Edit</Button>
              <Button variant="delete" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
