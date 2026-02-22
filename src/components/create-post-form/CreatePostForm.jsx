import { useState } from 'react';
import { createHelpRequest, createActivity } from '../../helpers/api.js';
import Textarea from '../textarea/Textarea.jsx';
import Button from '../button/Button.jsx';
import helpTypes from '../../constants/helpTypes.json';
import activityTypes from '../../constants/activityTypes.json';
import './CreatePostForm.css';

function CreatePostForm({ onPostCreated }) {
  const [formData, setFormData] = useState({
    postType: 'HELP_REQUEST',
    helpType: 'GARDENING',
    activityType: 'SPORTS',
    description: '',
    location: '',
    eventDate: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const errors = {};
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
    if (formData.postType === 'ACTIVITY' && !formData.location.trim()) {
      errors.location = "Location is required";
    }
    if (formData.postType === 'ACTIVITY' && !formData.eventDate) {
      errors.eventDate = "Event date is required";
    }
    if (formData.postType === 'ACTIVITY' && formData.eventDate && new Date(formData.eventDate) < new Date()) {
      errors.eventDate = "The date should be in the future";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setFormErrors({});
      let createdPost;
      if (formData.postType === 'HELP_REQUEST') {
        createdPost = await createHelpRequest(
          formData.description,
          formData.helpType,
          formData.location
        );
      } else {
        createdPost = await createActivity(
          formData.description,
          formData.activityType,
          formData.location,
          formData.eventDate
        );
      }
      onPostCreated(createdPost);
      setFormData({ ...formData, description: '', location: '', eventDate: '' });
    } catch (error) {
      setError("Failed to create post");
      console.error("Create post error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="create-post-form">
      <form onSubmit={handleSubmit}>
        <div className="post-type-selector">
          <label className="post-type-option">
            <input
              type="radio"
              name="postType"
              value="HELP_REQUEST"
              checked={formData.postType === 'HELP_REQUEST'}
              onChange={(event) => setFormData({ ...formData, postType: event.target.value })}
            />
            <span>Help request</span>
          </label>
          <label className="post-type-option">
            <input
              type="radio"
              name="postType"
              value="ACTIVITY"
              checked={formData.postType === 'ACTIVITY'}
              onChange={(event) => setFormData({ ...formData, postType: event.target.value })}
            />
            <span>Activity</span>
          </label>
        </div>

        <div className="post-category-selector">
          <span className="post-category-label">
            {formData.postType === 'HELP_REQUEST' ? 'What do you need help with?' : 'What type of activity?'}
          </span>
          {formData.postType === 'HELP_REQUEST' ? (
            <select
              value={formData.helpType}
              onChange={(event) => setFormData({ ...formData, helpType: event.target.value })}
            >
              <option value="" disabled>Select one...</option>
              {helpTypes.map((type) => {
                return <option key={type.value} value={type.value}>{type.label}</option>;
              })}
            </select>
          ) : (
            <select
              value={formData.activityType}
              onChange={(event) => setFormData({ ...formData, activityType: event.target.value })}
            >
              <option value="" disabled>Select one...</option>
              {activityTypes.map((type) => {
                return <option key={type.value} value={type.value}>{type.label}</option>;
              })}
            </select>
          )}
        </div>

        <Textarea
          label="Describe your request: *"
          placeholder="Your request here..."
          value={formData.description}
          onChange={(event) => setFormData({ ...formData, description: event.target.value })}
          maxLength={300}
        />
        {formErrors.description && <p className="form-error">{formErrors.description}</p>}

        <div className="post-location-input">
          <label>Location:{formData.postType === 'ACTIVITY' && ' *'}</label>
          <input
            type="text"
            placeholder="Enter location..."
            value={formData.location}
            onChange={(event) => setFormData({ ...formData, location: event.target.value })}
          />
        </div>
        {formErrors.location && <p className="form-error">{formErrors.location}</p>}

        {formData.postType === 'ACTIVITY' && (
          <>
            <div className="post-date-input">
              <label>Event date: *</label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(event) => setFormData({ ...formData, eventDate: event.target.value })}
              />
            </div>
            {formErrors.eventDate && <p className="form-error">{formErrors.eventDate}</p>}
          </>
        )}

        {error && <p className="form-error">{error}</p>}

        <Button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post it!'}
        </Button>
      </form>
    </section>
  );
}

export default CreatePostForm;
