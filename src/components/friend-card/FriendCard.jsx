import './FriendCard.css';
import Avatar from '../avatar/Avatar.jsx';
import Button from '../button/Button.jsx';

function FriendCard({ friend, onMessage, onUnfriend }) {
  return (
    <article className="friend-card">
      <div className="friend-card-header">
        <Avatar src={friend.profilePicture} alt={friend.username} size="medium" />
        <h3 className="friend-card-name">{friend.username}</h3>
      </div>

      <div className="friend-card-details">
        <p><strong>Age:</strong> {friend.age}</p>
        <p><strong>Location:</strong> {friend.location}</p>
        <p><strong>Things I can help with:</strong> {friend.competencies}</p>
      </div>

      <div className="friend-card-actions">
        <Button onClick={() => onMessage(friend)}>Message</Button>
        <Button variant="delete" onClick={() => onUnfriend(friend)}>Unfriend</Button>
      </div>
    </article>
  );
}

export default FriendCard;
