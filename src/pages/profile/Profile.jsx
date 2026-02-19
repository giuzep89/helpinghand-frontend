import { useState, useEffect, useContext, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../context/AuthContext.jsx';
import { getUserProfile, updateUserProfile, uploadProfilePicture, getProfilePictureUrl } from '../../helpers/api.js';
import './Profile.css';
import Avatar from '../../components/avatar/Avatar.jsx';
import Button from '../../components/button/Button.jsx';
import Input from '../../components/input/Input.jsx';

function Profile() {
  const { user: authUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [avatarKey, setAvatarKey] = useState(Date.now());
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);
        const profileData = await getUserProfile(authUser.username);
        setUser(profileData);
        reset({
          age: profileData.age,
          location: profileData.location,
          competencies: profileData.competencies,
        });
      } catch (error) {
        setError("Failed to load profile");
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    if (authUser?.username) {
      fetchProfile();
    }
  }, [authUser?.username, reset]);

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

  async function onSave(data) {
    try {
      setSaving(true);
      setError(null);
      const updatedUser = await updateUserProfile(
        authUser.username,
        data.age,
        data.location,
        data.competencies
      );
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      setError("Failed to save profile");
      console.error("Profile save error:", error);
    } finally {
      setSaving(false);
    }
  }

  function handleDelete() {
    console.log('Delete account', user.username);
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPEG and PNG images are allowed');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      await uploadProfilePicture(authUser.username, file);
      setAvatarKey(Date.now());
    } catch (error) {
      setError("Failed to upload profile picture");
      console.error("Profile picture upload error:", error);
    } finally {
      setUploading(false);
    }
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  if (loading) {
    return (
      <div className="profile inner-container">
        <div className="profile-card">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="profile inner-container">
        <div className="profile-card">
          <p className="profile-error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile inner-container">
      <div className="profile-card">
        <Avatar
          key={avatarKey}
          src={getProfilePictureUrl(authUser.username)}
          size="large"
          alt={user.username}
        />
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
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button type="button" variant="delete" onClick={handleCancel} disabled={saving}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Password:</strong> ••••••••</p>
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>Location:</strong> {user.location}</p>
            <p><strong>Things I can help with:</strong> {user.competencies}</p>
            <div className="profile-picture-field">
              <p>
                <strong>Profile picture*:</strong>{' '}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png"
                  style={{ display: 'none' }}
                />
                <a href="#" className="profile-upload-link" onClick={(e) => { e.preventDefault(); handleUploadClick(); }}>
                  {uploading ? 'Uploading...' : 'Upload / update'}
                </a>
              </p>
              <span className="profile-upload-hint">* JPEG or PNG, max 5MB</span>
              {error && <span className="profile-error">{error}</span>}
            </div>
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
