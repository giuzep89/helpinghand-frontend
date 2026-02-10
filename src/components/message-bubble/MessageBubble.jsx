import './MessageBubble.css';

function MessageBubble({ message }) {
  return (
    <div className={'message-bubble' + (message.isMe ? ' message-bubble-sent' : ' message-bubble-received')}>
      <p className="message-bubble-content">{message.content}</p>
    </div>
  );
}

export default MessageBubble;
