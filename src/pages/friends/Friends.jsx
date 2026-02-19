import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { getUserFriends, removeFriend, searchUsers, addFriend } from '../../helpers/api.js';
import './Friends.css';
import FriendCard from '../../components/friend-card/FriendCard.jsx';

function Friends() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    async function fetchFriends() {
      try {
        setLoading(true);
        setError(null);
        const friendsData = await getUserFriends(user.username);
        setFriends(friendsData);
      } catch (error) {
        setError("Failed to load friends");
        console.error("Friends fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    if (user?.username) {
      fetchFriends();
    }
  }, [user?.username]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        try {
          setSearchLoading(true);
          const results = await searchUsers(searchQuery);
          const filteredResults = results.filter((person) => person.username !== user.username);
          setSearchResults(filteredResults);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Due to time constraints, this resolves as a simple redirect to the messages page for now, and relies on the user to look up the friend to contact
  function handleMessage() {
    navigate('/messages');
  }

  async function handleUnfriend(friendToRemove) {
    try {
      setError(null);
      await removeFriend(user.username, friendToRemove.id);
      setFriends((prevFriends) => {
        return prevFriends.filter((friend) => friend.id !== friendToRemove.id);
      });
    } catch (error) {
      setError("Failed to remove friend");
      console.error("Unfriend error:", error);
    }
  }

  async function handleAddFriend(userToAdd) {
    try {
      setError(null);
      await addFriend(user.username, userToAdd.id);
      setFriends((prevFriends) => [...prevFriends, userToAdd]);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      setError("Failed to add friend");
      console.error("Add friend error:", error);
    }
  }

  function isFriend(userId) {
    return friends.some((friend) => friend.id === userId);
  }

  const displayList = searchQuery.trim().length >= 2 ? searchResults : friends;
  const isSearching = searchQuery.trim().length >= 2;

  return (
    <div className="friends inner-container">
      <div className="friends-search">
        <input
          type="text"
          placeholder="Search for users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchLoading && <span className="friends-search-loading">Searching...</span>}
      </div>
      {error && <p className="friends-error">{error}</p>}
      <div className="friends-list">
        {loading ? (
          <p className="friends-loading">Loading friends...</p>
        ) : displayList.length === 0 ? (
          <p className="friends-empty">
            {searchQuery.trim().length >= 2 ? 'No users found' : 'No friends yet'}
          </p>
        ) : (
          displayList.map((person) => (
            <FriendCard
              key={person.id}
              friend={person}
              isFriend={!isSearching || isFriend(person.id)}
              onMessage={handleMessage}
              onUnfriend={handleUnfriend}
              onAddFriend={handleAddFriend}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Friends;
