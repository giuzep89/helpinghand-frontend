import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { getAllPosts, createHelpRequest, createActivity, deletePost, markHelpFound } from '../../helpers/api.js';
import PostCard from '../../components/post-card/PostCard.jsx';
import Textarea from '../../components/textarea/Textarea.jsx';
import Button from '../../components/button/Button.jsx';
import helpTypes from '../../constants/helpTypes.json';
import activityTypes from '../../constants/activityTypes.json';
import './Home.css';

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [newPost, setNewPost] = useState({
    postType: 'HELP_REQUEST', // just some default values to display something while choosing
    helpType: 'GARDENING',
    activityType: 'SPORTS',
    description: '',
    location: '',
    eventDate: ''
  });

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);
        const postsData = await getAllPosts(currentPage);
        setPosts(postsData.content || postsData);
        setTotalPages(postsData.totalPages || 1);
      } catch (error) {
        setError("Failed to load posts");
        console.error("Posts fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [currentPage]);

  async function handleCreatePost(e) {
    e.preventDefault();

    const errors = {};
    if (!newPost.description.trim()) {
      errors.description = "Description is required";
    }
    if (newPost.postType === 'ACTIVITY' && !newPost.location.trim()) {
      errors.location = "Location is required";
    }
    if (newPost.postType === 'ACTIVITY' && !newPost.eventDate) {
      errors.eventDate = "Event date is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setCreateLoading(true);
      setError(null);
      setFormErrors({});
      let createdPost;
      if (newPost.postType === 'HELP_REQUEST') {
        createdPost = await createHelpRequest(
          newPost.description,
          newPost.helpType,
          newPost.location
        );
      } else {
        createdPost = await createActivity(
          newPost.description,
          newPost.activityType,
          newPost.location,
          newPost.eventDate
        );
      }
      setPosts([createdPost, ...posts]);
      setNewPost({ ...newPost, description: '', location: '', eventDate: '' });
    } catch (error) {
      setError("Failed to create post");
      console.error("Create post error:", error);
    } finally {
      setCreateLoading(false);
    }
  }

  // Due to time constraints, this resolves as a simple redirect to the messages page for now, and relies on the user to look up the friend to contact
  function handleContact() {
    navigate('/messages');
  }

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(postId) {
    try {
      setError(null);
      await deletePost(postId);
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      setError("Failed to delete post");
      console.error("Delete post error:", error);
    }
  }

  async function handleHelpFound(postId) {
    try {
      setError(null);
      await markHelpFound(postId, []);
      setPosts(posts.map((post) => {
        if (post.id === postId) {
          return { ...post, helpFound: true };
        }
        return post;
      }));
    } catch (error) {
      setError("Failed to mark help found");
      console.error("Mark help found error:", error);
    }
  }

  return (
    <main className="home outer-container">
      <div className="home inner-container">
        <section className="home-create-post">
          <form onSubmit={handleCreatePost}>
            <div className="post-type-selector">
              <label className="post-type-option">
                <input
                  type="radio"
                  name="postType"
                  value="HELP_REQUEST"
                  checked={newPost.postType === 'HELP_REQUEST'}
                  onChange={(e) => setNewPost({ ...newPost, postType: e.target.value })}
                />
                <span>Help request</span>
              </label>
              <label className="post-type-option">
                <input
                  type="radio"
                  name="postType"
                  value="ACTIVITY"
                  checked={newPost.postType === 'ACTIVITY'}
                  onChange={(e) => setNewPost({ ...newPost, postType: e.target.value })}
                />
                <span>Activity</span>
              </label>
            </div>

            <div className="post-category-selector">
              <span className="post-category-label">
                {newPost.postType === 'HELP_REQUEST' ? 'What do you need help with?' : 'What type of activity?'}
              </span>
              {newPost.postType === 'HELP_REQUEST' ? (
                <select
                  value={newPost.helpType}
                  onChange={(e) => setNewPost({ ...newPost, helpType: e.target.value })}
                >
                  <option value="" disabled>Select one...</option>
                  {helpTypes.map((type) => {
                    return <option key={type.value} value={type.value}>{type.label}</option>;
                  })}
                </select>
              ) : (
                <select
                  value={newPost.activityType}
                  onChange={(e) => setNewPost({ ...newPost, activityType: e.target.value })}
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
              value={newPost.description}
              onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
              maxLength={300}
            />
            {formErrors.description && <p className="form-error">{formErrors.description}</p>}

            <div className="post-location-input">
              <label>Location:{newPost.postType === 'ACTIVITY' && ' *'}</label>
              <input
                type="text"
                placeholder="Enter location..."
                value={newPost.location}
                onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
              />
            </div>
            {formErrors.location && <p className="form-error">{formErrors.location}</p>}

            {newPost.postType === 'ACTIVITY' && (
              <>
                <div className="post-date-input">
                  <label>Event date: *</label>
                  <input
                    type="date"
                    value={newPost.eventDate}
                    onChange={(e) => setNewPost({ ...newPost, eventDate: e.target.value })}
                  />
                </div>
                {formErrors.eventDate && <p className="form-error">{formErrors.eventDate}</p>}
              </>
            )}

            <Button type="submit" disabled={createLoading}>
              {createLoading ? 'Posting...' : 'Post it!'}
            </Button>
          </form>
        </section>
        <section className="home-feed">
          {error && <p className="home-error">{error}</p>}
          {loading ? (
            <p className="home-loading">Loading posts...</p>
          ) : posts.length === 0 && totalPages <= 1 ? (
            <p className="home-empty">No posts yet. Be the first to post!</p>
          ) : (
            <>
              {posts.map((post) => {
                return (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUsername={user.username}
                    onContact={handleContact}
                    onDelete={handleDelete}
                    onHelpFound={handleHelpFound}
                  />
                );
              })}
            </>
          )}
          {totalPages > 1 && (
            <div className="home-pagination">
              <Button
                variant="secondary"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <span className="home-pagination-info">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                variant="secondary"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
              >
                Next
              </Button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Home;
