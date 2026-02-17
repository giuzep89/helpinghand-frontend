import { useState } from 'react';
import './Messages.css';
import ChatPreview from '../../components/chat-preview/ChatPreview.jsx';
import MessageBubble from '../../components/message-bubble/MessageBubble.jsx';
import Avatar from '../../components/avatar/Avatar.jsx';
import Button from '../../components/button/Button.jsx';
import testDatabase from '../../constants/testDatabase.json';

function Messages() {
  const [chats, setChats] = useState(testDatabase.chats);
  const [allMessages, setAllMessages] = useState(testDatabase.messages);
  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const currentMessages = allMessages[activeChat?.id] ?? []; // if all messages is NULL, return empty array

  const availableFriends = testDatabase.friends.filter((friend) => {
    return !chats.some((chat) => chat.otherUserUsername === friend.username);
  });

  function handleChatClick(chat) {
    setActiveChat(chat);
  }

  function handleNewChat(e) {
    const friend = testDatabase.friends.find((f) => f.username === e.target.value);
    const newChat = {
      id: Date.now(),
      otherUserUsername: friend.username,
      profilePicture: friend.profilePicture,
      lastMessageContent: "",
      lastMessageTime: new Date().toISOString()
    };
    setChats([newChat, ...chats]);
    setAllMessages({ ...allMessages, [newChat.id]: [] });
    setActiveChat(newChat);
  }

  function handleDeleteChat() {
    const updatedChats = chats.filter((chat) => chat.id !== activeChat.id);
    const { [activeChat.id]: _removed, ...remainingMessages } = allMessages;
    setChats(updatedChats);
    setAllMessages(remainingMessages);
    setActiveChat(null);
  }

  function handleSendMessage(event) {
    event.preventDefault();

    const isMessageEmpty = newMessage.trim() === '';
    if (isMessageEmpty) {
      return;
    }

    const chatMessages = allMessages[activeChat?.id] ?? [];
    const message = {
      id: Date.now(),
      senderUsername: testDatabase.currentUser.username,
      content: newMessage,
      timestamp: new Date().toISOString(),
      isMe: true
    };

    setAllMessages((prevMessages) => {
      return {
        ...prevMessages,
        [activeChat.id]: [...chatMessages, message]
      };
    });

    setNewMessage('');
  }

  return (
    <div className="messages">
      <div className="messages-chat-list">
        <div className="messages-chat-list-header">
          <h2>Chats</h2>
          <select
            className="new-chat-select"
            value=""
            onChange={handleNewChat}
          >
            <option value="" disabled>New</option>
            {availableFriends.map((friend) => (
              <option key={friend.id} value={friend.username}>
                {friend.username}
              </option>
            ))}
          </select>
        </div>
        {chats.map((chat) => {
          return (
            <ChatPreview
              key={chat.id}
              chat={chat}
              isActive={activeChat?.id === chat.id}
              onClick={handleChatClick}
            />
          );
        })}
      </div>

      <div className="messages-conversation">
        {activeChat ? (
          <>
            <div className="messages-conversation-header">
              <Avatar
                src={activeChat.profilePicture}
                alt={activeChat.otherUserUsername}
                size="medium"
              />
              <h2>{activeChat.otherUserUsername}</h2>
              <Button variant="delete" onClick={handleDeleteChat}>Delete</Button>
            </div>

            <div className="messages-conversation-content">
              {currentMessages.map((message) => {
                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                  />
                );
              })}
            </div>

            <form className="messages-conversation-input" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(event) => setNewMessage(event.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </>

        ) : (

          <div className="messages-conversation-empty">
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
