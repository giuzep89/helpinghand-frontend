import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { getAllPosts, deletePost, deletePostAsAdmin, markHelpFound, getUserFriends, getUserProfile, createChat } from '../../helpers/api.js';
import PostCard from '../../components/post-card/PostCard.jsx';
import CreatePostForm from '../../components/create-post-form/CreatePostForm.jsx';
import Button from '../../components/button/Button.jsx';
import './Home.css';

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [friends, setFriends] = useState([]);

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

  useEffect(() => {
    async function fetchFriends() {
      try {
        const friendsData = await getUserFriends(user.username);
        setFriends(friendsData);
      } catch (error) {
        console.error("Friends fetch error:", error);
      }
    }
    if (user?.username) {
      fetchFriends();
    }
  }, [user?.username]);

  function handlePostCreated(newPost) {
    setPosts([newPost, ...posts]);
  }

  async function handleContact(post) {
    try {
      setError(null);
      const authorProfile = await getUserProfile(post.authorUsername);
      const newChat = await createChat(authorProfile.id);
      navigate('/messages', { state: { selectedChatId: newChat.id } });
    } catch (error) {
      setError("Failed to start chat");
      console.error("Contact error:", error);
    }
  }

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(postId, isAdminDelete = false) {
    try {
      setError(null);
      if (isAdminDelete) {
        await deletePostAsAdmin(postId);
      } else {
        await deletePost(postId);
      }
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      setError("Failed to delete post");
      console.error("Delete post error:", error);
    }
  }

  async function handleHelpFound(postId, helperIds = []) {
    try {
      setError(null);
      await markHelpFound(postId, helperIds);
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
        <CreatePostForm onPostCreated={handlePostCreated} />
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
                    isAdmin={user.isAdmin}
                    friends={friends}
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
