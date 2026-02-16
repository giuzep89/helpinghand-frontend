import { useState } from 'react';
import './Friends.css';
import FriendCard from '../../components/friend-card/FriendCard.jsx';
import testDatabase from '../../constants/testDatabase.json';

function Friends() {
  const [friends, setFriends] = useState(testDatabase.friends);
  const [searchQuery, setSearchQuery] = useState('');

  function handleMessage(friend) {
    // TODO: implement navigation to chat!
    console.log('Message', friend.username);
  }

  function handleUnfriend(friendToRemove) {
    setFriends((prevFriends) => {
      return prevFriends.filter((friend) => {
        return friend.id !== friendToRemove.id; // if ID doesn't match, KEEP in array
      });
    });
  }

  return (
    <div className="friends">
      <div className="friends-search">
        <input
          type="text"
          placeholder="Search for friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="friends-list">
        {friends.map((friend) => (
          <FriendCard
            key={friend.id}
            friend={friend}
            onMessage={handleMessage}
            onUnfriend={handleUnfriend}
          />
        ))}
      </div>
    </div>
  );
}

export default Friends;
