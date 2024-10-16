import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// importing images
import chatbotIcon from './assets/chatbot.svg';
import deals from './assets/deals.svg';
import tickets from './assets/tickets.svg';
import sell from './assets/sell.svg';
import faq from './assets/faq.svg';

// importing react functions
import { useState, useEffect, useRef } from 'react';

// importing components
import { BotChat } from './components/botChat';
import { MenuOption } from './components/menuOption';
import { UserChat } from './components/userChat';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState(''); // Current input message
  const [conversation, setConversation] = useState([
    { sender: 'bot', msg: 'Hello! How can I help you today? Please select one of the options below or type in your query to get started.' }
  ]); // Stores conversation history

  const messagesEndRef = useRef(null); // Reference to the end of the messages container

  // Handling the user clicking the menu options
  const handleOptionClick = (option) => {
    setConversation([...conversation, { sender: 'user', msg: option }]); // Append the selected option as a user message
  };
  // Handle User input
  const handleSend = () => {
    console.log("Send button clicked", message);
    if (message.trim()) {
      setConversation([...conversation, { sender: 'user', msg: message }]); // Append user message
      setMessage(''); // Clear input
    }
  };

  const toggleChat = () => {
    console.log('Chatbot button clicked');
    console.log(isChatOpen);
    setIsChatOpen(!isChatOpen);
    console.log(isChatOpen);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  return (
    <>
      {/* Chatbot Button */}
      <button className="chatbot-button" onClick={toggleChat}>
        <img src={chatbotIcon} alt="Chatbot" />
      </button>
      {/* Chatbot Panel */}
      <div className={`chatbot-panel ${isChatOpen ? '' : 'hidden'}`}>
        <div className="chatbot-header">
          <h3 className='inter-bold'>Ask DealBot</h3>
          <button type="button" class="btn-close btn-close-white" aria-label="Close" onClick={toggleChat}></button>
        </div>
        <div className="chatbot-body">
          {/* Render Bot Messages */}
          {conversation.map((chat, index) => (
            chat.sender === 'bot' && (
              <div key={index} className="botChat">
                <BotChat msg={chat.msg} />
              </div>
            )
          ))}

          {/* Render Menu Options */}
          <MenuOption img={deals} name="Find Deals" onClick={() => handleOptionClick('Find Deals')} />
          <MenuOption img={tickets} name="Your Bookings" onClick={() => handleOptionClick('Your Bookings')} />
          <MenuOption img={sell} name="Sell on Groupon" onClick={() => handleOptionClick('Sell on Groupon')} />
          <MenuOption img={faq} name="FAQ's" onClick={() => handleOptionClick('FAQ\'s')} />

          {/* Render User Messages */}
          {conversation.map((chat, index) => (
            chat.sender === 'user' && (
              <div key={index} className="userChat">
                <UserChat msg={chat.msg} />
              </div>
            )
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* User Input */}
        <div className="user-input-container">
          <input
            type="text"
            placeholder="Type your message..."
            className="chat-input-box"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              console.log("Message typed: " + e.target.value)
            }
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // Prevent the default behavior of submitting the form
                handleSend(); // Trigger the send action
              }
            }}
          />
          <button type="submit" className="chat-submit-btn" onClick={handleSend}>Send</button>
        </div>

      </div>
    </>
  );
}

export default App;
