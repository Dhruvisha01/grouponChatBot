import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import axios from 'axios';

// importing images
import chatbotIcon from './assets/chatbot.svg';
import deals from './assets/deals.svg';
import tickets from './assets/tickets.svg';
import sell from './assets/sell.svg';
import faq from './assets/faq.svg';
import beauty from './assets/beauty.svg';
import things from './assets/things.svg';
import gifts from './assets/gifts.svg';
import auto from './assets/auto.svg';
import food from './assets/food.svg';
import travel from './assets/travel.svg';
import local from './assets/local.svg';
import goods from './assets/goods.svg';
import home from './assets/home.svg';

// importing react functions
import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'; // Import Router and useNavigate


// importing components
import { BotChat } from './components/botChat';
import { MenuOption } from './components/menuOption';
import { UserChat } from './components/userChat';
import { DealsPage } from './pages/deals';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false); //Chat Bot Toggle
  const [message, setMessage] = useState(''); // Current input message

  const initialBotMessage = {
    sender: 'bot',
    msg: 'Hello! How can I help you today? Please select one of the options below or type in your query to get started.'
  };

  const [conversation, setConversation] = useState([initialBotMessage]); // Stores conversation history

  const [currentStep, setCurrentStep] = useState(null); // To track the conversation flow
  const [location, setLocation] = useState(''); // Location provided by user

  const messagesEndRef = useRef(null); // Reference to the end of the messages container

  const categories = ['Beauty & Spa', 'Things To Do', 'Gifts', 'Auto & Home', 'Food & Drink', 'Local', 'Travel', 'Goods']; // List of categories to be displayed after find deals
  const navigate = useNavigate();

  // Mapping categories to Images
  const categoryImages = {
    'Beauty & Spa': beauty,
    'Things To Do': things,
    'Gifts': gifts,
    'Auto & Home': auto,
    'Food & Drink': food,
    'Local': local,
    'Travel': travel,
    'Goods': goods
  };

  // Function to handle return to main menu
  const handleReturnToMainMenu = () => {
    setConversation([initialBotMessage]); // Reset to the initial welcome message
    setCurrentStep(null); // Reset conversation flow
    setLocation(''); // Reset location
  };

  // Handling the user clicking the menu options
  const handleOptionClick = (option) => {
    setConversation([...conversation, { sender: 'user', msg: option }]); // Append the selected option as a user message
    if (option === 'Find Deals') {
      // Ask for location
      setConversation(prev => [...prev, { sender: 'bot', msg: 'Sure. I would be happy to assist you with finding deals based on your choices. First, please help me with the location you want to search for deals in.' }]);
      setCurrentStep('awaiting_location');
    } else {
      handleOpenAIResponse(option); // For other options, handle with OpenAI
    }
  };

  // Handle User input
  const handleSend = async () => {
    if (message.trim()) {
      setConversation([...conversation, { sender: 'user', msg: message }]); // Append user message
      if (currentStep === 'awaiting_location') {
        // After location is provided, display categories
        if (/^\d{5}$/.test(message)) {
          // If the message is a 5-digit zip code
          try {
            const response = await axios.get(`http://api.zippopotam.us/us/${message}`);
            const city = response.data.places[0]['place name']; // Get the city name
            setLocation(city); // Save city as location
            setConversation(prev => [...prev, { sender: 'bot', msg: `Great! We found ${city} for the zip code. Please choose a category from the options below.` }]);
            setCurrentStep('awaiting_category');
          } catch (error) {
            console.error('Error fetching city from zip code:', error);
            setConversation(prev => [...prev, { sender: 'bot', msg: 'Sorry, I could not find a location for the zip code you entered. Please try again.' }]);
            setCurrentStep('awaiting_location');
          }
        } else {
          // If the message is not a zip code, treat it as a city
          setLocation(message); // Save city as location
          setConversation(prev => [...prev, { sender: 'bot', msg: 'Please choose a category from the options below.' }]);
          setCurrentStep('awaiting_category');
        }
        ;
      } else {
        handleOpenAIResponse(message); // Fallback to OpenAI for other messages
      }

      setMessage(''); // Clear input
    }
  };

  const handleCategorySelect = (category) => {
    setConversation(prev => [...prev, { sender: 'user', msg: category }]); // Append user-selected category

    // Confirmation message for redirection
    const redirectMessage = `I have redirected you to show you all the deals in the ${category} category in ${location}.`;
    setConversation(prev => [...prev, { sender: 'bot', msg: redirectMessage }]);

    // Redirect to deals page (simulating redirection for now)
    setTimeout(() => {
      navigate(`/deals/${category}/${location}`); // Navigate to deals page without reloading
    }, 1000);
  };
  // Handle OpenAI response
  const handleOpenAIResponse = async (userMessage) => {
    try {
      const response = await fetch('http://localhost:5001/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation: [...conversation, { sender: 'user', msg: userMessage }] })
      });

      const data = await response.json();
      setConversation(prev => [...prev, { sender: 'bot', msg: data.response }]);
    } catch (error) {
      console.error('Error fetching OpenAI response:', error);
      setConversation(prev => [...prev, { sender: 'bot', msg: 'Sorry, something went wrong.' }]);
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

  useEffect(() => {
    fetch('/api')
      .then(response => response.json())
      .then(data => console.log(data));
  }, []);

  return (
    <>
      <div className={location.pathname === '/' ? 'app app-background' : 'app'}>
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
              <div key={index} className={chat.sender === 'user' ? 'userChat' : 'botChat'}>
                {chat.sender === 'user' ? (
                  <UserChat msg={chat.msg} />
                ) : (
                  <BotChat msg={chat.msg} />
                )}
              </div>
            ))}

            {/* Display Categories as Menu Options when awaiting category */}
            {currentStep === 'awaiting_category' && (
              <div className="menu-options">
                {categories.map((category, index) => (
                  <MenuOption
                    key={index}
                    img={categoryImages[category]}
                    name={category}
                    onClick={() => handleCategorySelect(category)}
                  />
                ))}
              </div>
            )}

            {/* Display the Main Menu Options at the Start */}
            {conversation.length === 1 && (
              <>
                <MenuOption img={deals} name="Find Deals" onClick={() => handleOptionClick('Find Deals')} />
                <MenuOption img={tickets} name="Your Bookings" onClick={() => handleOptionClick('Your Bookings')} />
                <MenuOption img={sell} name="Sell on Groupon" onClick={() => handleOptionClick('Sell on Groupon')} />
                <MenuOption img={faq} name="FAQ's" onClick={() => handleOptionClick('FAQ\'s')} />
              </>
            )}

            {/* Return to Main Menu Option after each bot response (except for the first) */}
            {conversation.length > 1 && (
              <div className="menu-option">
                <MenuOption img={home} name="Return to Main Menu" onClick={handleReturnToMainMenu} />
              </div>
            )}

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
      </div>
      <Routes>
        <Route path="/deals/:category/:location" element={<DealsPage />} /> {/* Render DealsPage when navigated */}
      </Routes>

    </>
  );
}

export default App;
