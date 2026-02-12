import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  const bc = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [activeChannel, setActiveChannel] = useState("general");
  const [activeUser, setActiveUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const [chatData, setChatData] = useState({
    channels: {},
    private: {}
  });

  const users = ["Alex", "John", "Sara", "Admin"];
  const channels = ["general", "random", "tech", "help"];

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);

    const saved = JSON.parse(localStorage.getItem("chatData")) || {
      channels: {},
      private: {}
    };
    setChatData(saved);

    bc.current = new BroadcastChannel("chat_app");

    bc.current.onmessage = (event) => {
      const updated = event.data;
      setChatData(updated);
      localStorage.setItem("chatData", JSON.stringify(updated));
    };

    return () => bc.current.close();
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData, activeChannel, activeUser]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMsg = {
      from: user.name,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      status: 'sent'
    };

    const updated = structuredClone(chatData);

    if (activeUser) {
      updated.private[activeUser] ??= [];
      updated.private[activeUser].push(newMsg);
    } else {
      updated.channels[activeChannel] ??= [];
      updated.channels[activeChannel].push(newMsg);
    }

    setChatData(updated);
    localStorage.setItem("chatData", JSON.stringify(updated));
    bc.current.postMessage(updated);
    setMessage("");
    inputRef.current?.focus();
  };

  const logout = () => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("isLoggedIn");
  navigate("/login", { replace: true });
};


  const getLastMessage = (key, type) => {
    const messages = type === 'channel' 
      ? chatData.channels[key] || []
      : chatData.private[key] || [];
    return messages[messages.length - 1];
  };

  const getUnreadCount = (key, type) => {
    return Math.floor(Math.random() * 3);
  };

  const filteredMessages = activeUser
    ? chatData.private[activeUser] || []
    : chatData.channels[activeChannel] || [];

  if (!user) return null;

  const currentChatName = activeUser || `#${activeChannel}`;
  const currentChatAvatar = activeUser ? activeUser.charAt(0) : '#';

  return (
    <>
      

      <div className="chat-app">
        {/* Sidebar */}
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <div className="user-avatar" onClick={() => navigate('/profile')}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="header-actions">
              <button className="icon-btn" title="New Chat">💬</button>
              <button className="icon-btn" title="Settings">⚙️</button>
              <button className="icon-btn" title="Menu">⋮</button>
            </div>
          </div>

          <div className="search-container">
            <div className="search-box">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search or start new chat"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="tabs">
            <button 
              className={`tab ${!activeUser ? 'active' : ''}`}
              onClick={() => { setActiveUser(null); setActiveChannel('general'); }}
            >
              Channels
            </button>
            <button 
              className={`tab ${activeUser ? 'active' : ''}`}
              onClick={() => setActiveUser(users[0])}
            >
              Private
            </button>
          </div>

          <div className="chat-list custom-scroll">
            {!activeUser ? (
              channels
                .filter(c => c.toLowerCase().includes(search.toLowerCase()))
                .map(c => {
                  const lastMsg = getLastMessage(c, 'channel');
                  const isActive = activeChannel === c;
                  const unread = getUnreadCount(c, 'channel');
                  return (
                    <div 
                      key={c}
                      className={`chat-item ${isActive ? 'active' : ''}`}
                      onClick={() => { setActiveChannel(c); setActiveUser(null); }}
                    >
                      <div className="chat-avatar channel">#</div>
                      <div className="chat-info">
                        <div className="chat-header-row">
                          <span className="chat-name">#{c}</span>
                          <span className="chat-time">{lastMsg?.time || ''}</span>
                        </div>
                        <div className="chat-preview">
                          <span className={`chat-message ${unread > 0 ? 'unread' : ''}`}>
                            {lastMsg ? `${lastMsg.from}: ${lastMsg.text}` : 'No messages yet'}
                          </span>
                          {unread > 0 && <span className="unread-badge">{unread}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })
            ) : (
              users
                .filter(u => u.toLowerCase().includes(search.toLowerCase()) && u !== user.name)
                .map(u => {
                  const lastMsg = getLastMessage(u, 'private');
                  const isActive = activeUser === u;
                  const unread = getUnreadCount(u, 'private');
                  return (
                    <div 
                      key={u}
                      className={`chat-item ${isActive ? 'active' : ''}`}
                      onClick={() => setActiveUser(u)}
                    >
                      <div className="chat-avatar">
                        {u.charAt(0)}
                        <span className="online-indicator"></span>
                      </div>
                      <div className="chat-info">
                        <div className="chat-header-row">
                          <span className="chat-name">{u}</span>
                          <span className="chat-time">{lastMsg?.time || ''}</span>
                        </div>
                        <div className="chat-preview">
                          <span className={`chat-message ${unread > 0 ? 'unread' : ''}`}>
                            {lastMsg ? lastMsg.text : 'Start a conversation'}
                          </span>
                          {unread > 0 && <span className="unread-badge">{unread}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* Main Chat */}
        <div className="main-chat">
          {activeUser || activeChannel ? (
            <>
              <div className="navbar">
                <div className="navbar-info">
                  <button 
                    className="menu-toggle" 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  >
                    ☰
                  </button>
                  <div className="navbar-avatar">
                    {currentChatAvatar}
                  </div>
                  <div className="navbar-details">
                    <h3>{currentChatName}</h3>
                    <span>{activeUser ? 'online' : `${filteredMessages.length} messages`}</span>
                  </div>
                </div>
                <div className="navbar-actions">
                  <button className="navbar-btn" title="Search">🔍</button>
                  <button className="navbar-btn" title="Attach">📎</button>
                  <button className="navbar-btn" title="More">⋮</button>
                  <button className="navbar-btn logout" onClick={logout} title="Logout">→</button>
                </div>
              </div>

              <div className="messages-container custom-scroll">
                {filteredMessages.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">💬</div>
                    <h2>No messages yet</h2>
                    <p>Start the conversation by sending a message below</p>
                  </div>
                ) : (
                  <>
                    {filteredMessages.map((m, i) => (
                      <div 
                        key={i} 
                        className={`message ${m.from === user.name ? 'outgoing' : 'incoming'}`}
                      >
                        {m.from !== user.name && activeChannel && (
                          <div className="message-sender">{m.from}</div>
                        )}
                        <div className="message-text">{m.text}</div>
                        <div className="message-meta">
                          <span>{m.time}</span>
                          {m.from === user.name && (
                            <span className="message-status">✓✓</span>
                          )}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="typing">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="input-area">
                <div className="input-actions">
                  <button className="input-btn">😊</button>
                  <button className="input-btn">📎</button>
                </div>
                <div className="input-wrapper">
                  <input
                    ref={inputRef}
                    type="text"
                    className="message-input"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  />
                </div>
                <button 
                  className="send-btn"
                  onClick={sendMessage}
                  disabled={!message.trim()}
                >
                  ➤
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">✦</div>
              <h2>Welcome to Chat</h2>
              <p>Select a channel or user from the sidebar to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;



