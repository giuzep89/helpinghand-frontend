import './ChatPreview.css';
import Avatar from '../avatar/Avatar.jsx';

function ChatPreview({ chat, isActive, onClick }) {
  return (
    <article
      className={'chat-preview' + (isActive ? ' chat-preview-active' : '')}
      onClick={() => onClick(chat)}
    >
      <div className="chat-preview-avatar">
        <Avatar
          src={chat.profilePicture}
          alt={chat.otherUserUsername}
          size="medium"
        />
      </div>

      <div className="chat-preview-content">
        <h3 className="chat-preview-name">{chat.otherUserUsername}</h3>
        <p className="chat-preview-message">{chat.lastMessageContent}</p>
      </div>
    </article>
  );
}

export default ChatPreview;
