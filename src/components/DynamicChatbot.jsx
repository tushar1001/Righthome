/* eslint-disable react/prop-types */
import { Heart, MapPin, Maximize2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const animationStyles = `
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
}

@keyframes popIn {
    0% { opacity: 0; transform: scale(0.8); }
    70% { transform: scale(1.05); }
    100% { opacity: 1; transform: scale(1); }
}

@keyframes blink {
    0% { opacity: 0.1; }
    20% { opacity: 1; }
    100% { opacity: 0.1; }
}
`;

function DynamicChatbot() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [properties, setProperties] = useState([]);
    const messagesEndRef = useRef(null);
    // eslint-disable-next-line no-unused-vars
    const [rawResponse, setRawResponse] = useState(null);
    const [typingMessage, setTypingMessage] = useState(null);
    const [typedText, setTypedText] = useState('');
    const [showOptions, setShowOptions] = useState(true); // Default to true so options show after typing
    const [activeMessageIndex, setActiveMessageIndex] = useState(-1);
    const [messagesToProcess, setMessagesToProcess] = useState([]); // Make messagesToProcess a state variable

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, typedText]);

    // Load saved data from localStorage when component mounts
    useEffect(() => {
        // Try to load chat history from localStorage
        const savedChatHistory = localStorage.getItem('chatHistory');
        const savedProperties = localStorage.getItem('properties');
        
        if (savedChatHistory) {
            try {
                const parsedChatHistory = JSON.parse(savedChatHistory);
                setChatHistory(parsedChatHistory);
                console.log("📚 Loaded chat history from localStorage");
                // Set all messages as already animated
                setActiveMessageIndex(parsedChatHistory.length);
            } catch (err) {
                console.error("Error parsing chat history from localStorage:", err);
                // If there's an error parsing, fetch initial response
                fetchInitialResponse();
            }
        } else {
            // If no saved chat history, fetch initial response
            fetchInitialResponse();
        }
        
        if (savedProperties) {
            try {
                const parsedProperties = JSON.parse(savedProperties);
                setProperties(parsedProperties);
                console.log("🏠 Loaded properties from localStorage");
            } catch (err) {
                console.error("Error parsing properties from localStorage:", err);
            }
        }
    }, []);

    // Save to localStorage whenever chatHistory or properties change
    useEffect(() => {
        if (chatHistory.length > 0) {
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
            console.log("💾 Saved chat history to localStorage");
        }
    }, [chatHistory]);

    useEffect(() => {
        if (properties.length > 0) {
            localStorage.setItem('properties', JSON.stringify(properties));
            console.log("💾 Saved properties to localStorage");
        }
    }, [properties]);

    // Text streaming effect for new messages
    useEffect(() => {
        if (typingMessage) {
            let i = 0;
            const speed = 15; // typing speed in milliseconds
            const content = typingMessage.content;
            
            const typeText = () => {
                if (i < content.length) {
                    setTypedText(content.substring(0, i + 1));
                    i++;
                    setTimeout(typeText, speed);
                } else {
                    // When typing is complete
                    setTypingMessage(null);
                    setTypedText('');
                    
                    // Add the message to chat history
                    setChatHistory(prev => [...prev, typingMessage]);
                    
                    // Show options after typing is complete
                    if (typingMessage.options && typingMessage.options.length > 0) {
                        setShowOptions(true);
                    }
                    
                    // Process next message if available
                    processNextMessage();
                }
            };
            
            // Start typing effect
            typeText();
        }
    }, [typingMessage]);

    // Process messages one by one with animation
    const processNextMessage = () => {
        // Check if there are more messages to process
        if (activeMessageIndex < messagesToProcess.length - 1) {
            const nextIndex = activeMessageIndex + 1;
            setActiveMessageIndex(nextIndex);
            const nextMessage = messagesToProcess[nextIndex];
            
            if (nextMessage.role === 'assistant') {
                // Start typing animation for assistant message
                setTypingMessage(nextMessage);
                setShowOptions(true); // Make sure options will be shown
            } else {
                // For user messages, just add them immediately
                setChatHistory(prev => [...prev, nextMessage]);
                // Process next message
                setTimeout(processNextMessage, 300);
            }
        } else {
            // All messages processed
            setActiveMessageIndex(-1);
            setMessagesToProcess([]);
        }
    };

    const fetchInitialResponse = async () => {
        const apiUrl = 'https://dynamic-flow-brown.vercel.app/chat';

        try {
            setLoading(true);

            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_history: [],
                }),
            });

            const data = await res.json();
            console.log("👉 API Response:", data);
            setRawResponse(data);

            // Prepare messages for animation
            let newMessagesToProcess = [];

            if (data.Chatbot) {
                newMessagesToProcess.push({
                    role: 'assistant',
                    content: data.Chatbot,
                    options: [],
                });
            }

            if (data["Follow-Up Question"]) {
                newMessagesToProcess.push({
                    role: 'assistant',
                    content: data["Follow-Up Question"],
                    options: [],
                });
            }

            // If Options is an array
            if (Array.isArray(data.Options) && data.Options.length > 0) {
                newMessagesToProcess.push({
                    role: 'assistant',
                    content: 'Please select an option:',
                    options: data.Options,
                });
            }

            // Check for properties in the response
            if (data.properties && Array.isArray(data.properties)) {
                setProperties(data.properties);
            }

            // Start processing messages with animation
            if (newMessagesToProcess.length > 0) {
                setMessagesToProcess(newMessagesToProcess);
                setActiveMessageIndex(0);
                const firstMessage = newMessagesToProcess[0];
                if (firstMessage.role === 'assistant') {
                    setTypingMessage(firstMessage);
                } else {
                    setChatHistory([firstMessage]);
                    setTimeout(() => processNextMessage(), 300);
                }
            }

        } catch (err) {
            console.error("Fetch Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchChatbotResponse = async (userMessage) => {
        const apiUrl = 'https://dynamic-flow-brown.vercel.app/chat';
    
        // First add the user message to chat history
        const userMsg = { role: 'user', content: userMessage };
        const updatedHistory = [...chatHistory, userMsg];
    
        // Update chat history immediately with user message
        setChatHistory(updatedHistory);
    
        try {
            setLoading(true);
    
            // Format chat history for API
            const apiChatHistory = updatedHistory.map(msg => ({
                role: msg.role,
                content: msg.content
            }));
    
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_history: apiChatHistory,
                }),
            });
            
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            
            const data = await res.json();
            console.log('🤖 Chatbot API Response:', data);
            
            // Store the raw response for debugging
            setRawResponse(data);
            
            // Reset message queue
            let newMessagesToProcess = [];
            
            // Add Chatbot message if it exists
            if (data.Chatbot && data.Chatbot.trim()) {
                newMessagesToProcess.push({
                    role: 'assistant',
                    content: data.Chatbot,
                    options: [],
                });
            }
    
            // Add Follow-Up Question if it exists
            if (data["Follow-Up Question"] && data["Follow-Up Question"].trim()) {
                newMessagesToProcess.push({
                    role: 'assistant',
                    content: data["Follow-Up Question"],
                    options: [],
                });
            }
    
            // Handle Options - special case for the API response format
            if (data.Options) {
                let optionsArray = [];
                
                if (typeof data.Options === 'string') {
                    // If Options is a string, split it by newlines
                    optionsArray = data.Options.split('\n').filter(option => option.trim());
                } else if (Array.isArray(data.Options)) {
                    // If Options is already an array
                    optionsArray = data.Options;
                } else if (typeof data.Options === 'object') {
                    // Get all values from the Options object
                    optionsArray = Object.values(data.Options);
                    
                    // If we have duplicate keys in the original JSON, we might need
                    // to reconstruct the options array from the raw JSON string
                    if (optionsArray.length < 4) {
                        try {
                            // Extract options from the raw JSON response
                            const rawOptionsStr = JSON.stringify(data);
                            const optionsMatch = rawOptionsStr.match(/"Options":\s*{([^}]*)}/);
                            
                            if (optionsMatch && optionsMatch[1]) {
                                const optionsPairs = optionsMatch[1].split(',');
                                optionsArray = optionsPairs.map(pair => {
                                    const parts = pair.split(':');
                                    return parts[1].trim().replace(/"/g, '');
                                });
                            }
                        } catch (err) {
                            console.error('Error parsing options from raw JSON:', err);
                        }
                    }
                }
                
                // Only add options message if there are actual options
                if (optionsArray.length > 0) {
                    newMessagesToProcess.push({
                        role: 'assistant',
                        content: 'Please select an option:',
                        options: optionsArray
                    });
                }
            }

            // Check for properties in the response
            if (data.properties && Array.isArray(data.properties)) {
                setProperties(data.properties);
            } else if (data.followupMessage) {
                // If there's a followup message but no properties defined directly
                const followUpMsg = {
                    role: 'assistant',
                    content: data.followupMessage,
                    options: []
                };
                newMessagesToProcess.push(followUpMsg);
            }
    
            console.log("🔄 Messages to process:", newMessagesToProcess);
    
            // Start animation process for new messages
            if (newMessagesToProcess.length > 0) {
                setMessagesToProcess(newMessagesToProcess);
                setActiveMessageIndex(0);
                const firstMessage = newMessagesToProcess[0];
                if (firstMessage.role === 'assistant') {
                    setTypingMessage(firstMessage);
                } else {
                    // Shouldn't happen normally since we've already added the user message
                    setChatHistory(prev => [...prev, firstMessage]);
                    setTimeout(() => processNextMessage(), 300);
                }
            }
    
        } catch (err) {
            console.error('❌ Error fetching chatbot response:', err);
            setError(`Chat fetch error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionClick = (option) => {
        sendMessage(option);
    };

    const lastOptionMsgIndex = chatHistory.reduce((lastIdx, m, i) => {
        return m.role === 'assistant' && m.options?.length ? i : lastIdx;
    }, -1);      

    const handleInputSubmit = (e) => {
        e.preventDefault();
        if (userInput.trim()) {
            sendMessage(userInput);
            setUserInput('');
        }
    };

    const sendMessage = (message) => {
        fetchChatbotResponse(message);
    };

    // Add function to clear chat history and localStorage
    const clearConversation = () => {
        localStorage.removeItem('chatHistory');
        localStorage.removeItem('properties');
        setChatHistory([]);
        setProperties([]);
        setTypingMessage(null);
        setTypedText('');
        setShowOptions(false);
        setActiveMessageIndex(-1);
        setMessagesToProcess([]);
        fetchInitialResponse();
    };

    const PropertyCard = ({ property }) => {
        const [isFavorite, setIsFavorite] = useState(false);
        const navigate = useNavigate();

        // Fallback Property Images
        const fallbackImages = [
            "https://images.unsplash.com/photo-1632398414290-15262b0ec12d?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://plus.unsplash.com/premium_photo-1681550097108-187abe10d445?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://cdn.pixabay.com/photo/2020/07/24/08/40/apartments-5433298_1280.jpg",
            "https://cdn.pixabay.com/photo/2015/08/28/10/13/building-911688_1280.jpg",
            "https://cdn.pixabay.com/photo/2015/05/25/16/16/building-783553_1280.jpg",
            "https://cdn.pixabay.com/photo/2020/07/14/00/45/tower-5402424_1280.jpg",
            "https://cdn.pixabay.com/photo/2024/06/15/20/50/ai-generated-8832223_1280.jpg",
            "https://cdn.pixabay.com/photo/2019/12/02/08/04/city-4667143_1280.jpg",
        ];

        const getRandomFallbackImage = () => {
            return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
        };

        // Parse images safely
        const images = (() => {
            try {
                return JSON.parse(property.Images);
            } catch (e) {
                return ["https://images.unsplash.com/photo-1733352268242-66c79f93bdd4?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"];
            }
        })();
        
        // Format price with commas
        const formatPrice = (price) => {
            if (!price) return "Price on request";
            return typeof price === 'number' 
                ? price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                : price;
        };
    
        // Color for status badges
        const getStatusColor = (status) => {
            const statusMap = {
                "For Sale": "bg-blue-100 text-blue-800",
                "For Rent": "bg-purple-100 text-purple-800",
                "Sold": "bg-red-100 text-red-800",
                "Pending": "bg-amber-100 text-amber-800"
            };
            return statusMap[status] || "bg-gray-100 text-gray-800";
        };
    
        // Get first few amenities for preview
        const previewAmenities = property.Amenities
            ?.split('\n')
            .filter(Boolean)
            .slice(0, 3)
            .map(a => a.trim());
        
        const totalAmenities = property.Amenities?.split('\n').filter(Boolean).length || 0;
        const extraAmenities = totalAmenities > 3 ? totalAmenities - 3 : 0;
        
        const navigateToPropertyDetails = () => {
            // Store this specific property in localStorage for easy retrieval
            const properties = JSON.parse(localStorage.getItem('propertywithid')) || [];
            
            // Check if the property is already in localStorage
            if (!properties.some(p => p.id === property.ID)) {
                localStorage.setItem('propertywithid', JSON.stringify([...properties, property]));
            }
            
            // Navigate to the details page
            navigate(`/properties/${property.ID}`);
        };
    
        return (
            <div className="rounded-xl font-poppins overflow-hidden shadow-lg shadow-white w-full max-w-md bg-[#f0f8ff] hover:shadow-md hover:shadow-white border-2 border-[#223F38] transition-shadow duration-300 animate-fadeIn">
                {/* Image container with overlay elements */}
                <div className="relative">
                <img
                    src={images[0]}
                    alt={property.Name}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 text-[#223F38] rounded-full text-xs font-medium ${getStatusColor(property.Status)}`}>
                    {property.Status}
                    </span>
                </div>
                <button 
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-transform hover:scale-110"
                >
                    <Heart size={18} fill={isFavorite ? "#ef4444" : "none"} color={isFavorite ? "#ef4444" : "#223F38"} />
                </button>
                </div>
        
                {/* Content */}
                <div className="p-3">
                {/* Price and area row */}
                <div className="flex justify-between items-center mb-2">
                    <div className="text-lg font-bold text-[#223F38]">{formatPrice(property.Price)}</div>
                    <div className="flex items-center text-[#223F38] text-xs">
                    <Maximize2 size={12} className="mr-1" />
                    {property.Area}
                    </div>
                </div>
        
                {/* Property name and location */}
                <h2 className="text-md font-semibold text-[#223F38] mb-1">{property.Name}</h2>
                <div className="flex items-center text-[#223F38] text-xs mb-4">
                    <MapPin size={12} className="mr-1" />
                    {property.Location}
                </div>
        
                {/* Amenities preview */}
                <div className="border-t-2 border-[#223F38] pt-3 mb-3">
                    <div className="flex flex-wrap gap-2">
                    {previewAmenities?.map((amenity, idx) => (
                        <span key={idx} className="bg-[#223F38] text-white px-2 py-1 rounded font-light text-xs">
                        {amenity}
                        </span>
                    ))}
                    {extraAmenities > 0 && (
                        <span className="bg-[#223F38] text-white px-2 py-1 rounded font-light text-xs">
                        +{extraAmenities} more
                        </span>
                    )}
                    </div>
                </div>
        
                {/* Description - truncated */}
                <p className="text-xs text-[#223F38] line-clamp-2 mb-4">
                    {property.Description}
                </p>
        
                {/* Call to action */}
                <button onClick={navigateToPropertyDetails} className="w-full border-2 text-[#223F38] border-[#223F38] py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#223F38] hover:text-white">
                    View Details
                </button>
                </div>
            </div>
            );
        };  

    return (
        <div className="flex flex-col items-center h-screen max-w-2xl mx-auto bg-[#f0f8ff] overflow-hidden">
            {/* Add styles to the document properly */}
            <style dangerouslySetInnerHTML={{ __html: animationStyles }} />

            <div className="bg-[#223F38] p-4 z-50 shadow w-full fixed flex justify-between items-center">
                <Link to="/">
                    <h2 className="text-xl text-white font-semibold font-mono tracking-wider">RightHomeAI</h2>
                </Link>
                <button 
                    onClick={clearConversation}
                    className="px-3 py-2 text-sm font-mono font-semibold bg-[#CAD0FC] rounded-full transition-all hover:scale-105 transform duration-200"
                >
                    New Chat
                </button>
            </div>

            <div className="flex-1 w-full mt-24 overflow-auto p-4 space-y-4">
                {/* Debug Panel */}
                {/* <div className="mb-4 p-2 bg-[#223F38] text-xs rounded-lg text-white font-poppins shadow-md">
                    <h1 className='text-2xl font-semibold text-center underline'>Debug Panel</h1>
                    <p><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
                    <p><strong>Error:</strong> {error || 'none'}</p>
                    <p><strong>Chat History Length:</strong> {chatHistory.length}</p>
                    <p><strong>Properties Length:</strong> {properties.length}</p>
                    <p><strong>Typing:</strong> {typingMessage ? 'true' : 'false'}</p>
                    <p><strong>Show Options:</strong> {showOptions ? 'true' : 'false'}</p>
                    <details>
                        <summary>Raw Response</summary>
                        <pre className="overflow-auto max-h-40">
                            {JSON.stringify(rawResponse, null, 2)}
                        </pre>
                    </details>
                    <details>
                        <summary>Chat History</summary>
                        <pre className="overflow-auto max-h-40">
                            {JSON.stringify(chatHistory, null, 2)}
                        </pre>
                    </details>
                </div> */}

                {/* Chat Messages */}
                {chatHistory.length === 0 && !typingMessage && !loading ? (
                    <div className="text-center text-gray-300 my-8">
                        Starting conversation...
                    </div>
                ) : (
                    <div className="space-y-4 font-mono">
                        {chatHistory.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-3/4 p-3 text-sm shadow-sm rounded-lg ${msg.role === 'user'
                                            ? 'bg-[#223F38] text-white rounded-br-none'
                                            : 'bg-[#CAD0FC] text-gray-800 rounded-bl-none'
                                        }`}
                                >
                                    {msg.content && <p className="whitespace-pre-wrap text-sm">{msg.content}</p>}

                                    {/* Display options if they exist and belong to assistant */}
                                    {msg.role === 'assistant' && msg.options && msg.options.length > 0 && showOptions && (
                                        <div className="mt-2 space-y-2">
                                            {msg.options.map((option, idx) => {
                                            const isLatest = chatHistory.indexOf(msg) === lastOptionMsgIndex;
                                            return (
                                                <button
                                                key={idx}
                                                onClick={() => handleOptionClick(option)}
                                                className="block w-full text-sm font-light text-left px-3 py-2 bg-[#223F38] shadow-md rounded-bl-none text-white rounded-lg transition-colors"
                                                style={
                                                    isLatest
                                                    ? {
                                                        animation: 'popIn 0.4s ease-out forwards',
                                                        animationDelay: `${0.3 + idx * 0.15}s`,
                                                        }
                                                    : {}
                                                }
                                                >
                                                {option}
                                                </button>
                                            );
                                            })}
                                        </div>
                                        )}
                                </div>
                            </div>
                        ))}

                        {/* Currently typing message */}
                        {typingMessage && (
                            <div className="flex justify-start">
                                <div className="max-w-3/4 p-3 rounded-lg bg-[#CAD0FC] text-gray-800 rounded-bl-none"
                                    style={{ animation: 'slideIn 0.3s ease-out forwards' }}>
                                    <p className="whitespace-pre-wrap text-sm">{typedText}<span className="ml-1 animate-pulse">|</span></p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Property Cards Section */}
                {properties.length > 0 && (
                    <div className="my-6" style={{ animation: 'fadeIn 0.5s ease-out forwards', animationDelay: '0.5s' }}>
                        <h3 className="text-lg font-semibold mb-4">Available Properties</h3>
                        <div className="grid grid-cols-1 gap-6 my-6">
                            {properties.map((property, idx) => (
                                <div key={property.ID || property.id} style={{ animation: 'fadeIn 0.5s ease-out forwards', animationDelay: `${0.5 + idx * 0.2}s` }}>
                                    <PropertyCard property={property} />
                                </div>
                            ))}
                        </div>
                    </div>
                    
                )}

                {loading && !typingMessage && (
                    <div className="flex justify-start">
                        <div className="bg-[#CAD0FC] text-gray-800 p-3 rounded-lg rounded-bl-none">
                            <div className="typing-indicator" style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ 
                                    width: '8px',
                                    height: '8px',
                                    margin: '0 1px',
                                    backgroundColor: '#6b7280',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    animation: 'blink 1.4s infinite both'
                                }}></span>
                                <span style={{ 
                                    width: '8px',
                                    height: '8px',
                                    margin: '0 1px',
                                    backgroundColor: '#6b7280',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    animation: 'blink 1.4s infinite both',
                                    animationDelay: '0.2s'
                                }}></span>
                                <span style={{ 
                                    width: '8px',
                                    height: '8px',
                                    margin: '0 1px',
                                    backgroundColor: '#6b7280',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    animation: 'blink 1.4s infinite both',
                                    animationDelay: '0.4s'
                                }}></span>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded"
                        style={{ animation: 'fadeIn 0.5s ease-out forwards' }}>
                        Error: {error}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <form onSubmit={handleInputSubmit} className="bg-[#f0f8ff] p-4 border-t-2 border-[#223F38] w-full font-mono">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 placeholder:text-gray-800 border-2 border-[#223F38] rounded-full bg-transparent focus:outline-none focus:ring-1 focus:ring-[#223F38] transition-all duration-300"
                        disabled={loading || typingMessage !== null}
                    />
                    <button
                        type="submit"
                        disabled={loading || !userInput.trim() || typingMessage !== null}
                        className="px-4 py-2 bg-[#223F38] text-white rounded-full hover:bg-[#223F38] disabled:bg-[#223F38]/70 focus:outline-none focus:ring-2 focus:ring-[#223F38] transition-all duration-300 hover:scale-105 transform"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}

export default DynamicChatbot;