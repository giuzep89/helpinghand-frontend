import './PostCard.css';
import Button from '../button/Button.jsx';
import ProfilePicPlaceholder from '../../assets/Icons/ProfilePic-placeholder.svg';

function PostCard({ post, currentUsername, onContact, onDelete, onHelpFound }) {
  const isAuthor = post.authorUsername === currentUsername;
  const isHelpRequest = post.postType === 'HELP_REQUEST';

  // TODO replace placeholder with real profile picture from API
  const authorPicture = ProfilePicPlaceholder;

  return (
    <article className="post-card">
      {isHelpRequest && (
        <div className="help-type-label">
          {/* TODO add styling/icon based on helpType */}
        </div>
      )}

      {isHelpRequest && post.helpFound && (
        <div className="post-card-badge">Help found!</div>
      )}

      <div className="post-card-header">
        <img src={authorPicture} alt="" className="post-card-avatar" />
        <span className="post-card-username">{post.authorUsername}</span>
      </div>

      <h3 className="post-card-title">{post.displayTitle}</h3>
      <p className="post-card-description">{post.description}</p>

      <div className="post-card-actions">
        {!isAuthor && (
          <Button onClick={() => onContact(post)}>Contact</Button>
        )}
        {isAuthor && isHelpRequest && !post.helpFound && (
          <Button onClick={() => onHelpFound(post.id)}>Help Found</Button>
        )}
        {isAuthor && (
          <Button variant="delete" onClick={() => onDelete(post.id)}>Delete</Button>
        )}
      </div>
    </article>
  );
}

export default PostCard;
