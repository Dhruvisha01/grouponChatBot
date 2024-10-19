import axios from 'axios';

// importing images
import chatbotIcon from '../assets/chatbot.svg';
import deals from '../assets/deals.svg';
import tickets from '../assets/tickets.svg';
import sell from '../assets/sell.svg';
import faq from '../assets/faq.svg';
import beauty from '../assets/beauty.svg';
import things from '../assets/things.svg';
import gifts from '../assets/gifts.svg';
import auto from '../assets/auto.svg';
import food from '../assets/food.svg';
import travel from '../assets/travel.svg';
import local from '../assets/local.svg';
import goods from '../assets/goods.svg';
import home from '../assets/home.svg';
import change from '../assets/change.svg';
import noChange from '../assets/noChange.svg';

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
    const [coupons, setCoupons] = useState("No");

    const initialBotMessage = {
        sender: 'bot',
        msg: 'Hello! How can I help you today? Please select one of the options below or type in your query to get started.'
    };

    const [conversation, setConversation] = useState([initialBotMessage]); // Stores conversation history

    const [currentStep, setCurrentStep] = useState(null); // To track the conversation flow
    const [location, setLocation] = useState(''); // Location provided by user
    const [options, setOptions] = useState(null);

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
        // setLocation(''); // Reset location
    };

    // Handling the user clicking the menu options
    const handleOptionClick = (option) => {
        setConversation([...conversation, { sender: 'user', msg: option }]); // Append the selected option as a user message
        if (option === 'Find Deals') {
            setCoupons("No")
            // Ask for location
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
        } else if (option == "Sell on Groupon") {
            setConversation(prev => [...prev, {
                sender: 'bot', msg: '<p>Sure. I would be happy to tell you the steps to sell on Groupon. I have redirected you to the right page that will provide more detailed steps on how you can sell on Groupon. Please check those.</p><p>In short:</p><ul><li>First, become a Groupon Merchant.</li><li>Next, craft a campaign to reach the crowd.</li><li>Once the campaign is live, track your sales through your dashboard.</li></ul><p> It\'s that simple! Let me know if I can help you with something else.</p>'
            }]);
            navigate(`/sell_on_groupon/`)

        } else if (option == "FAQ's") {
            handleOpenAIResponse(option)
            navigate(`/FAQs`)

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
            // navigate('/trending-coupons')
        }

        else if (option === "Yes") {
            setConversation(prev => [...prev, { sender: 'bot', msg: 'Okay. Please help me with the new location' }]);
            setCurrentStep('awaiting_location');
            setOptions(null);
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
        } else {
            console.log("Going to ChatGPT", option)
            handleOpenAIResponse(option); // For other options, handle with OpenAI
        }
    };

    useEffect(() => {
        if (coupons !== "No" && location) {
            console.log("Location updated, navigating to the coupons page with location:", location);
            navigate(`/trending-coupons/${location}`);
        }
    }, [location, coupons]);

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
                // After location is provided, display categories
                if (/^\d{5}$/.test(message)) {
                    // If the message is a 5-digit zip code
                    try {
                        const response = await axios.get(`http://api.zippopotam.us/us/${message}`);
                        const city = response.data.places[0]['place name']; // Get the city name
                        setLocation(city); // Save city as location
                        setConversation(prev => [...prev, { sender: 'bot', msg: `Great! We found ${city} for the zip code. Please choose a category from the options below.` }]);
                        if (coupons == "No") {
                            setCurrentStep('awaiting_category');
                        } else {
                            // navigate(`/trending-coupons/:${location}`)
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
                    if (coupons == "No") {
                        setConversation(prev => [...prev, { sender: 'bot', msg: 'Please choose a category from the options below.' }]);
                        setCurrentStep('awaiting_category');
                    }
                    else {
                        setConversation(prev => [...prev, { sender: 'bot', msg: `Thanks! I will now redirect you to the trending coupons in your choice of city.` }]);
                        // navigate(`/trending-coupons/:${location}`)
                    }
                }
                ;
            } else {
                console.log("Handle send clicked and now going to chatgpt", message)
                setCurrentStep(null);
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
        setCurrentStep(null)
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


    return (
        <div className='homePage'>

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

                    {/* Display Categories as Menu Options when awaiting category */}
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
                                e.preventDefault(); // Prevent the default behavior of submitting the form
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