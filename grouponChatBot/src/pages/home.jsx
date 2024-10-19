import axios from 'axios';

// importing images
import chatbotIcon from '../assets/images/chatbot.svg';
import deals from '../assets/images/deals.svg';
import tickets from '../assets/images/tickets.svg';
import sell from '../assets/images/sell.svg';
import faq from '../assets/images/faq.svg';
import beauty from '../assets/images/beauty.svg';
import things from '../assets/images/things.svg';
import gifts from '../assets/images/gifts.svg';
import auto from '../assets/images/auto.svg';
import food from '../assets/images/food.svg';
import travel from '../assets/images/travel.svg';
import local from '../assets/images/local.svg';
import goods from '../assets/images/goods.svg';
import home from '../assets/images/home.svg';
import change from '../assets/images/change.svg';
import noChange from '../assets/images/noChange.svg';

// importing react functions
import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'; // Import Router and useNavigate

// Importing pages
import { BotChat } from '../components/botChat';
import { MenuOption } from '../components/menuOption';
import { UserChat } from '../components/userChat';

export const Home = () => {
    const [isChatOpen, setIsChatOpen] = useState(false); //Chat Bot Toggle
    const [message, setMessage] = useState(''); // Current input message
    const [coupons, setCoupons] = useState("No"); // To track if user wants to get coupons

    const initialBotMessage = {
        sender: 'bot',
        msg: 'Hello! How can I help you today? Please select one of the options below or type in your query to get started.'
    };

    const [conversation, setConversation] = useState([initialBotMessage]); // Stores conversation history

    const [currentStep, setCurrentStep] = useState(null); // To track the conversation flow
    const [location, setLocation] = useState(''); // Location provided by user
    const [options, setOptions] = useState(null); //Yes or No to confirm Location Change

    const messagesEndRef = useRef(null); // Reference to the end of the messages container

    const categories = ['Beauty & Spa', 'Things To Do', 'Gifts', 'Auto & Home', 'Food & Drink', 'Local', 'Travel', 'Goods']; // List of categories to be displayed after find deals
    const navigate = useNavigate(); // To navigate to other pages

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

    // Function to handle return to main menu Option
    const handleReturnToMainMenu = () => {
        setConversation([initialBotMessage]); // Reset to the initial welcome message
        setCurrentStep(null); // Reset conversation flow
    };

    // Handling the user clicking the menu options
    const handleOptionClick = (option) => {
        setConversation([...conversation, { sender: 'user', msg: option }]); // Append the selected option as a user message
        // If user clicks on Find Deals
        if (option === 'Find Deals') {
            setCoupons("No")

            if (!location) {
                // Location is not yet provided, ask for it
                setConversation(prev => [...prev, { sender: 'bot', msg: 'Sure. I would be happy to assist you with finding deals based on your choices. First, please help me with the <strong>location</strong> you want to search for deals in. <br/> <br/> Type in your location.' }]);
                setCurrentStep('awaiting_location');
            } else {
                // Location is already provided, ask the user to confirm it or change it
                setConversation(prev => [...prev, { sender: 'bot', msg: `Before I help you find deals, would you like the location to be ${location} or would you like to change it?` }]);
                setOptions('give_options');
                setCurrentStep('awaiting_location_confirmation'); // Track the step of confirming location
            }

        // If user clicks on Sell on Groupon
        } else if (option == "Sell on Groupon") {
            setConversation(prev => [...prev, {
                sender: 'bot', msg: '<p>Sure. I would be happy to tell you the steps to sell on Groupon. I have redirected you to the right page that will provide more detailed steps on how you can sell on Groupon. Please check those.</p><p>In short:</p><ul><li>First, become a Groupon Merchant.</li><li>Next, craft a campaign to reach the crowd.</li><li>Once the campaign is live, track your sales through your dashboard.</li></ul><p> It\'s that simple! Let me know if I can help you with something else.</p>'
            }]);
            navigate(`/sell_on_groupon/`)

        // If user clicks on FAQs
        } else if (option == "FAQ's") {
            handleOpenAIResponse(option)
            navigate(`/FAQs`)
        
        // If user clicks on Trending Coupons
        } else if (option === "Trending Coupons") {
            setCoupons("Yes")
            if (!location) {
                // Location is not yet provided, ask for it
                setConversation(prev => [...prev, { sender: 'bot', msg: 'Sure. I would be happy to assist you with finding the trending coupons available in your location. First, please help me with the <strong>location</strong> you want to search for coupons in. <br/> <br/> Type in your location.' }]);
                setCurrentStep('awaiting_location');
            } else {
                // Location is already provided, ask the user to confirm it or change it
                setConversation(prev => [...prev, { sender: 'bot', msg: `Before I help you find the trending coupons, would you like the location to be ${location} or would you like to change it?` }]);
                setOptions('give_options');
                setCurrentStep('awaiting_location_confirmation'); // Track the step of confirming location
            }
        }

        // If user clicks on Change Location
        else if (option === "Yes") {
            setConversation(prev => [...prev, { sender: 'bot', msg: 'Okay. Please help me with the new location' }]);
            setCurrentStep('awaiting_location');
            setOptions(null);

        // If User clicks on Don't Change Location
        } else if (option === "No") {
            if (coupons === "No") {
                setConversation(prev => [...prev, { sender: 'bot', msg: 'Okay. Pleas choose a category from the options below to allow me to help you better.' }]);
                setCurrentStep('awaiting_category');
            }
            else {
                setConversation(prev => [...prev, { sender: 'bot', msg: 'Okay. I am redirecting you to the trending deals in this city.' }]);
                setCurrentStep('navigating_to_coupons');
            }
            setOptions(null);

        // For all other cases
        } else {
            console.log("Going to ChatGPT", option)
            handleOpenAIResponse(option); 
        }
    };

    // Navigate to the coupons page when location is updated
    useEffect(() => {
        if (coupons !== "No" && location) {
            console.log("Location updated, navigating to the coupons page with location:", location);
            navigate(`/trending-coupons/${location}`);
        }
    }, [location, coupons]);

    // Navigate to the coupons page when location is updated
    useEffect(() => {
        if (currentStep === 'navigating_to_coupons' && location) {
            console.log("Location updated, navigating to the coupons page with location:", location);
            navigate(`/trending-coupons/${location}`);
        }
    }, [location, currentStep]);

    // Handle User input
    const handleSend = async () => {
        if (message.trim()) {
            setConversation([...conversation, { sender: 'user', msg: message }]); // Append user message

            if (currentStep === 'awaiting_location') {
                // If the message is a 5-digit zip code - Works only for US
                if (/^\d{5}$/.test(message)) {
                    try {
                        // Get the city name from the zip code
                        const response = await axios.get(`http://api.zippopotam.us/us/${message}`);
                        const city = response.data.places[0]['place name'];
                        setLocation(city); // Save city as location
                        setConversation(prev => [...prev, { sender: 'bot', msg: `Great! We will help you find deals in ${city}. Please choose a category from the options below.` }]);

                        // Display categories only if user has selected find deals
                        if (coupons == "No") {
                            setCurrentStep('awaiting_category');
                        }
                    } catch (error) {
                        console.error('Error fetching city from zip code:', error);
                        setConversation(prev => [...prev, { sender: 'bot', msg: 'Sorry, I could not find a location for the zip code you entered. Please try again.' }]);
                        setCurrentStep('awaiting_location');
                    }
                } else {
                    // If the message is not a zip code, treat it as a city
                    setLocation(message); // Save city as location
                    console.log("Location just changed", location)
                    // Display categories only if user has selected find deals
                    if (coupons == "No") {
                        setConversation(prev => [...prev, { sender: 'bot', msg: 'Please choose a category from the options below.' }]);
                        setCurrentStep('awaiting_category');
                    }
                    else {
                        setConversation(prev => [...prev, { sender: 'bot', msg: `Thanks! I will now redirect you to the trending coupons in this city.` }]);
                    }
                };
            } else {
                console.log("Handle send clicked and now going to chatgpt", message)
                setCurrentStep(null);
                handleOpenAIResponse(message); // Fallback to OpenAI for other messages
            }

            setMessage(''); // Clear input field
        }
    };

    const handleCategorySelect = (category) => {
        setConversation(prev => [...prev, { sender: 'user', msg: category }]); // Append user-selected category

        // Confirmation message for redirection
        const redirectMessage = `I have redirected you to show you all the deals in the ${category} category in ${location}.`;
        setConversation(prev => [...prev, { sender: 'bot', msg: redirectMessage }]);
        setCurrentStep(null)

        // Redirect to deals page
        setTimeout(() => {
            navigate(`/deals/${category}/${location}`);
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

    // Display chatbot panel
    const toggleChat = () => {
        console.log('Chatbot button clicked');
        console.log(isChatOpen);
        setIsChatOpen(!isChatOpen);
        console.log(isChatOpen);
    };

    // Scroll to the bottom of the chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation]);


    return (
        <div className='homePage'>

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
                    {/* Render Bot and User Messages */}
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

                    {/* Display Change and Dont Change Location Optionss as Menu Options when location is presaved */}
                    {options === 'give_options' && (
                        <div className="menu-options">
                            <MenuOption
                                img={change}
                                name="Change"
                                onClick={() => handleOptionClick('Yes')}
                            />
                            <MenuOption
                                img={noChange}
                                name="Don't Change"
                                onClick={() => handleOptionClick('No')}
                            />
                        </div>
                    )}

                    {/* Display the Main Menu Options at the Start */}
                    {conversation.length === 1 && (
                        <>
                            <MenuOption img={tickets} name="Find Deals" onClick={() => handleOptionClick('Find Deals')} />
                            <MenuOption img={deals} name="Trending Coupons" onClick={() => handleOptionClick('Trending Coupons')} />
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
                                e.preventDefault(); 
                                handleSend(); // Trigger the send action
                            }
                        }}
                    />
                    <button type="submit" className="chat-submit-btn" onClick={handleSend}>Send</button>
                </div>
            </div>
        </div>
    )
}