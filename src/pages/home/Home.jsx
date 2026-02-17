import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import PostCard from '../../components/post-card/PostCard.jsx';
import Textarea from '../../components/textarea/Textarea.jsx';
import Button from '../../components/button/Button.jsx';
import { generateTitle } from '../../helpers/generateTitle.js'; // TODO API: remove, API generates displayTitle
import testDatabase from '../../constants/testDatabase.json'; // TODO API: remove, fetch posts in useEffect
import helpTypes from '../../constants/helpTypes.json';
import activityTypes from '../../constants/activityTypes.json';
import './Home.css';

function Home() {
  const { user } = useContext(AuthContext);
  // TODO API: replace with useEffect fetching GET /posts
  const [posts, setPosts] = useState(testDatabase.posts);
  const [newPost, setNewPost] = useState({
    postType: 'HELP_REQUEST',
    helpType: 'GARDENING',
    activityType: 'SPORTS',
    description: ''
  });

  // TODO API: POST to /posts/help-requests or /posts/activities
  function handleCreatePost(e) {
    e.preventDefault();

    const post = {
      id: Math.floor(Math.random() * 100000),
      displayTitle: generateTitle(newPost.postType, newPost.helpType, newPost.activityType),
      description: newPost.description,
      location: user.location,
      authorUsername: user.username,
      createdAt: new Date().toISOString(),
      postType: newPost.postType,
      ...(newPost.postType === 'HELP_REQUEST'
        ? { helpType: newPost.helpType, helpFound: false }
        : { activityType: newPost.activityType, currentParticipants: 1 })
    };

    setPosts([post, ...posts]);
    setNewPost({ ...newPost, description: '' });
  }

  function handleContact(post) {
    // TODO: navigate to messages or open chat with post author
    console.log('Contact author of:', post.displayTitle);
  }

  // TODO API: DELETE /posts/{id}
  function handleDelete(postId) {
    setPosts(posts.filter((post) => {
      return post.id !== postId;
    }));
  }

  // TODO API: PATCH /posts/help-requests/{id}/help-found
  function handleHelpFound(postId) {
    setPosts(posts.map((post) => {
      if (post.id === postId) {
        return { ...post, helpFound: true };
      }
      return post;
    }));
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
              label="Describe your request:"
              placeholder="You request here..."
              value={newPost.description}
              onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
            />

            <Button type="submit">Post it!</Button>
          </form>
        </section>
        <section className="home-feed">
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
        </section>
      </div>
    </main>
  );
}

export default Home;
