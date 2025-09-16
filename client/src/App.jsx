import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css'

const socket = io('http://localhost:3000');

export default function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [isUsernameSubmitted, setIsUsernameSubmitted] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    socket.on('chat', (msg) => {
      console.log('Received message:', msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('chat');
      socket.off('connect');
      socket.off('connect_error');
    }
  }, []);

  const sendMessage = () => {
    if (message.trim() !== '') {
      const msgObj = { username: username, text: message };
      console.log('Sending message:', msgObj);
      socket.emit('chat', msgObj);
      setMessage('');
    }
  }

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim() !== '') {
      setIsUsernameSubmitted(true);
    }
  }

  if (!isUsernameSubmitted) {
    return (
      <div className="welcome-container">
        <div className="welcome-form">
          <h1>Welcome to Real-Time Chat</h1>
          <form onSubmit={handleUsernameSubmit}>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Enter your name'
              required
            />
            <button type="submit">Join Chat</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="chat-container">
        <div className="chat-header">
          <h1>Real-Time Chat</h1>
        </div>
        <div className="messages-container">
          <ul className="message-list">
            {messages.map((msg, index) => (
              <li 
                key={index} 
                className={`message-item ${
                  msg.username === username 
                    ? 'message-own' 
                    : msg.username === 'Server' 
                      ? 'message-server' 
                      : 'message-other'
                }`}
              >
                <strong>{msg.username}:</strong> {msg.text}
              </li>
            ))}
          </ul>
        </div>
        <div className="input-container">
          <input 
            className="message-input"
            type="text" 
            value={message} 
            onChange={(event) => setMessage(event.target.value)} 
            placeholder='Type a message' 
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}