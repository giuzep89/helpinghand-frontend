import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { getAllChats, getChatMessages, sendMessage, createChat, getUserFriends, getProfilePictureUrl } from '../../helpers/api.js';
import './Messages.css';
import ChatPreview from '../../components/chat-preview/ChatPreview.jsx';
import MessageBubble from '../../components/message-bubble/MessageBubble.jsx';
import Avatar from '../../components/avatar/Avatar.jsx';
import Button from '../../components/button/Button.jsx';

function Messages() {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [friends, setFriends] = useState([]);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [chatsLoading, setChatsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchChatsAndFriends() {
      try {
        setChatsLoading(true);
        setError(null);
        const [chatsData, friendsData] = await Promise.all([
          getAllChats(),
          getUserFriends(user.username)
        ]);
        setChats(chatsData);
        setFriends(friendsData);
      } catch (error) {
        setError("Failed to load chats");
        console.error("Chats fetch error:", error);
      } finally {
        setChatsLoading(false);
      }
    }
    if (user?.username) {
      fetchChatsAndFriends();
    }
  }, [user?.username]);

  const availableFriends = friends.filter((friend) => {
    return !chats.some((chat) => chat.otherUserUsername === friend.username);
  });

  async function handleChatClick(chat) {
    setActiveChat(chat);
    try {
      setMessagesLoading(true);
      setError(null);
      const messages = await getChatMessages(chat.id);
      setCurrentMessages(messages);
    } catch (error) {
      setError("Failed to load messages");
      console.error("Messages fetch error:", error);
    } finally {
      setMessagesLoading(false);
    }
  }

  async function handleNewChat(e) {
    const selectedUsername = e.target.value;
    const friend = friends.find((f) => f.username === selectedUsername);
    if (!friend) return;

    try {
      setError(null);
      const newChat = await createChat(friend.id);
      setChats([newChat, ...chats]);
      setActiveChat(newChat);
      setCurrentMessages([]);
    } catch (error) {
      setError("Failed to create chat");
      console.error("Create chat error:", error);
    }
  }

  // Note: This only removes the chat from local state, not from the backend.
  // The backend does not have a DELETE endpoint for chats yet.
  function handleDeleteChat() {
    const updatedChats = chats.filter((chat) => chat.id !== activeChat.id);
    setChats(updatedChats);
    setActiveChat(null);
    setCurrentMessages([]);
  }

  async function handleSendMessage(event) {
    event.preventDefault();

    const isMessageEmpty = newMessage.trim() === '';
    if (isMessageEmpty || !activeChat) {
      return;
    }

    try {
      setSendingMessage(true);
      setError(null);
      const sentMessage = await sendMessage(activeChat.id, newMessage);
      setCurrentMessages((prevMessages) => [...prevMessages, sentMessage]);
      setNewMessage('');
    } catch (error) {
      setError("Failed to send message");
      console.error("Send message error:", error);
    } finally {
      setSendingMessage(false);
    }
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
            {friends.length === 0 ? (
              <option disabled>You have no friends yet!</option>
            ) : availableFriends.length === 0 ? (
              <option disabled>You already have chats with all friends</option>
            ) : (
              availableFriends.map((friend) => (
                <option key={friend.id} value={friend.username}>
                  {friend.username}
                </option>
              ))
            )}
          </select>
        </div>
        {chatsLoading ? (
          <p className="messages-loading">Loading chats...</p>
        ) : chats.length === 0 ? (
          <p className="messages-empty">No chats yet</p>
        ) : (
          chats.map((chat) => {
            return (
              <ChatPreview
                key={chat.id}
                chat={chat}
                isActive={activeChat?.id === chat.id}
                onClick={handleChatClick}
              />
            );
          })
        )}
      </div>

      <div className="messages-conversation">
        {activeChat ? (
          <>
            <div className="messages-conversation-header">
              <Avatar
                src={getProfilePictureUrl(activeChat.otherUserUsername)}
                alt={activeChat.otherUserUsername}
                size="medium"
              />
              <h2>{activeChat.otherUserUsername}</h2>
              <Button variant="delete" onClick={handleDeleteChat}>Delete</Button>
            </div>

            <div className="messages-conversation-content">
              {messagesLoading ? (
                <p className="messages-loading">Loading messages...</p>
              ) : (
                currentMessages.map((message) => {
                  return (
                    <MessageBubble
                      key={message.id}
                      message={{ ...message, isMe: message.senderUsername === user.username }}
                    />
                  );
                })
              )}
            </div>

            {error && <p className="messages-error">{error}</p>}
            <form className="messages-conversation-input" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(event) => setNewMessage(event.target.value)}
                disabled={sendingMessage}
              />
              <button type="submit" disabled={sendingMessage}>
                {sendingMessage ? 'Sending...' : 'Send'}
              </button>
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
