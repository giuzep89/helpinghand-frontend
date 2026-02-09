import './Friends.css';
import FriendCard from '../../components/friend-card/FriendCard.jsx';
import testDatabase from '../../constants/testDatabase.json';

function Friends() {
  const friends = testDatabase.friends;

  const handleMessage = (friend) => {
    // TODO: Navigate to chat with friend
    console.log('Message', friend.username);
  };

  const handleUnfriend = (friend) => {
    // TODO: Implement unfriend functionality
    console.log('Unfriend', friend.username);
  };

  return (
    <div className="friends">
      <h1>Friends</h1>
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
