import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Home, CheckCircle, Star, Heart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const DynamicDetailedProperty = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get property ID from URL
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (id) {
            getPropertyFromLocalStorage(id);
        }
    }, [id]);

    // Function to get property from localStorage
    const getPropertyFromLocalStorage = (propertyId) => {
        setLoading(true);
        try {
            const properties = JSON.parse(localStorage.getItem('propertywithid')) || [];

            const foundProperty = properties.find(
                p => p.ID === propertyId || p.ID === parseInt(propertyId)
            );

            if (foundProperty) {
                setProperty(foundProperty);
                console.log("Fetched property:", JSON.stringify(foundProperty, null, 2)); // Clean JSON output
            } else {
                console.error(`Property with ID ${propertyId} not found in localStorage`);
            }
        } catch (error) {
            console.error("Error retrieving property from localStorage:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrevImage = () => {
        if (!property) return;
        try {
            const images = JSON.parse(property.Images);
            setCurrentImageIndex((prevIndex) => 
                prevIndex === 0 ? images.length - 1 : prevIndex - 1
            );
        } catch (e) {
            console.error("Error parsing images:", e);
        }
    };

    const handleNextImage = () => {
        if (!property) return;
        try {
            const images = JSON.parse(property.Images);
            setCurrentImageIndex((prevIndex) => 
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        } catch (e) {
            console.error("Error parsing images:", e);
        }
    };

    // Check if property is a favorite when component mounts
    useEffect(() => {
        if (property) {
            // Check if the property is in favorites (if you have a favorites feature)
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            setIsFavorite(favorites.some(fav => fav.id === property.id));
        }
    }, [property]);

    // Toggle favorite status
    const toggleFavorite = () => {
        if (!property) return;
        
        const newFavoriteStatus = !isFavorite;
        setIsFavorite(newFavoriteStatus);
        
        // Update favorites in localStorage
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        
        if (newFavoriteStatus) {
            // Add to favorites if not already there
            if (!favorites.some(fav => fav.id === property.id)) {
                localStorage.setItem('favorites', JSON.stringify([...favorites, property]));
            }
        } else {
            // Remove from favorites
            localStorage.setItem('favorites', JSON.stringify(
                favorites.filter(fav => fav.id !== property.id)
            ));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#223F38]"></div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-16">
                    <h2 className="text-2xl font-bold text-gray-800">Property not found</h2>
                    <p className="mt-4 text-gray-600">{`The property you're looking for doesn't exist or has been removed.`}</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="mt-6 px-6 py-2 bg-[#223F38] text-white rounded-lg hover:bg-[#223F38]"
                    >
                        Back to Properties
                    </button>
                </div>
            </div>
        );
    }

    // Parse images safely
    let images = [];
    try {
        images = JSON.parse(property.Images);
    } catch (e) {
        images = ["https://images.unsplash.com/photo-1733352268242-66c79f93bdd4?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"];
        console.error("Error parsing images:", e);
    }
    
    // Parse amenities safely
    let amenities = [];
    try {
        amenities = property.Amenities ? property.Amenities.split('\n').filter(Boolean) : [];
    } catch (e) {
        console.error("Error parsing amenities:", e);
    }

    // Format price with commas
    const formatPrice = (price) => {
        if (!price) return "Price on request";
        return typeof price === 'number' 
            ? price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
            : price;
    };

    return (
        <div className="container mx-auto px-4 sm:px-16 py-8 max-w-6xl mt-20 font-poppins">
            {/* Back button */}
            <button 
                onClick={() => {
                    localStorage.removeItem('propertywithid'); // Clear specific item
                    navigate(-1); // Go back to previous page
                }}
                className="flex items-center text-md text-[#223F38]/80 hover:text-[#223F38] transition-all mb-6"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back to listings
            </button>
            
            {/* Property header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#223F38]">{property.Name}</h1>
                    <div className="flex items-center text-[#223F38] mt-2">
                        <MapPin size={16} className="mr-1" />
                        {property.Location}
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-4 md:mt-0">
                    <span className="text-lg max-w-[15rem] font-bold text-[#223F38]">{formatPrice(property.Price)}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        property.Status === "For Sale" ? "bg-blue-100 text-blue-800" :
                        property.Status === "For Rent" ? "bg-purple-100 text-purple-800" :
                        property.Status === "Sold" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-[#223F38]"
                    }`}>
                        {property.Status}
                    </span>
                </div>
            </div>
            
            {/* Image gallery */}
            <div className="relative bg-gray-100 rounded-xl overflow-hidden mb-8">
                <img 
                    src={images[currentImageIndex]} 
                    alt={`${property.Name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-96 object-cover"
                />
                
                {/* Image navigation */}
                {images.length > 1 && (
                    <div className="absolute inset-0 flex justify-between items-center px-4">
                        <button 
                            onClick={handlePrevImage}
                            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                        <button 
                            onClick={handleNextImage}
                            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>
                )}
                
                {/* Image counter */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {images.length}
                    </div>
                )}
                
                {/* Favorite button */}
                <button 
                    onClick={toggleFavorite}
                    className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-md hover:bg-gray-100"
                >
                    <Heart size={20} fill={isFavorite ? "#ef4444" : "none"} color={isFavorite ? "#ef4444" : "#374151"} />
                </button>
            </div>
            
            {/* Property details grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* Main info */}
                <div className="md:col-span-2">
                    <div className="bg-white border-[#223F38] border-2 rounded-xl shadow-md p-6 mb-6">
                        <h2 className="text-xl font-bold text-[#223F38] mb-4">Property Details</h2>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <p className="text-[#223F38] text-sm">Property Type</p>
                                <p className="font-medium text-[#223F38]">{property.Type || "Villa"}</p>
                            </div>
                            <div>
                                <p className="text-[#223F38] text-sm">Area</p>
                                <p className="font-medium text-[#223F38]">{property.Area}</p>
                            </div>
                            <div>
                                <p className="text-[#223F38] text-sm">Year Built</p>
                                <p className="font-medium text-[#223F38]">{property.YearBuilt || "2020"}</p>
                            </div>
                            <div>
                                <p className="text-[#223F38] text-sm">Parking</p>
                                <p className="font-medium text-[#223F38]">{property.Parking || "2-Car Garage"}</p>
                            </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-[#223F38] mb-3">Description</h3>
                        <p className="text-[#223F38] mb-6 leading-relaxed">
                            {property.Description}
                        </p>
                        
                        <h3 className="text-lg font-semibold text-[#223F38] mb-3">Amenities</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {amenities.map((amenity, index) => (
                                <div key={index} className="flex items-center">
                                    <CheckCircle size={22} className="bg-[#223F38] text-white rounded-full p-1 mr-2" />
                                    <span className="text-[#223F38]">{amenity}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Additional sections could go here */}
                    <div className="bg-white rounded-xl border-[#223F38] border-2 shadow-md p-6">
                        <h2 className="text-xl font-bold text-[#223F38] mb-4">Location</h2>
                        <div className="text-[#223F38] rounded-lg h-64 flex items-center justify-center mb-4">
                            <p className="text-[#223F38]">Map would be displayed here</p>
                        </div>
                        <div className="bg-[#223F38] h-[2px] w-full mb-4"/>
                        <p className="text-[#223F38]">
                            This property is conveniently located near shopping centers, restaurants, and schools.
                            The neighborhood offers excellent amenities and is known for its safety and community feel.
                        </p>
                    </div>
                </div>
                
                {/* Sidebar */}
                <div className="md:col-span-1">
                    {/* Agent info */}
                    <div className="bg-white border-[#223F38] border-2 rounded-xl shadow-md p-6 mb-6">
                        <h2 className="text-xl font-bold text-[#223F38] mb-4">Contact Agent</h2>
                        <div className="flex items-center mb-4">
                            <div className="text-[#223F38] rounded-full w-16 h-16 flex items-center justify-center mr-4">
                                <Home size={24} className="text-[#223F38]" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-[#223F38]">{property.AgentName || "Property Agent"}</h3>
                                <p className="text-[#223F38] text-sm">Real Estate Agent</p>
                                <div className="flex items-center mt-1">
                                    <Star size={14} className="text-yellow-500" fill="#EAB308" />
                                    <Star size={14} className="text-yellow-500" fill="#EAB308" />
                                    <Star size={14} className="text-yellow-500" fill="#EAB308" />
                                    <Star size={14} className="text-yellow-500" fill="#EAB308" />
                                    <Star size={14} className="text-yellow-500" fill="#EAB308" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-4 text-[#223F38]">
                            <div>
                                <p className="text-sm">Phone</p>
                                <p className="font-medium">{property.AgentPhone || "123-456-7890"}</p>
                            </div>
                            <div>
                                <p className="text-sm">Email</p>
                                <p className="font-medium">{property.AgentEmail || "agent@example.com"}</p>
                            </div>
                        </div>
                        
                        {/* Contact form */}
                        <div className="mt-6 space-y-4">
                            <input 
                                type="text" 
                                placeholder="Your Name" 
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input 
                                type="email" 
                                placeholder="Your Email" 
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <textarea 
                                placeholder="Your Message" 
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            ></textarea>
                            <button className="w-full bg-[#223F38]/90 hover:bg-[#223F38] text-white py-3 rounded-lg font-medium transition-colors">
                                Send Message
                            </button>
                        </div>
                    </div>
                    
                    {/* Similar properties card would go here */}
                </div>
            </div>
            <div className="w-full overflow-hidden rotate-180">
            <svg 
                viewBox="0 0 1200 120" 
                preserveAspectRatio="none" 
                className="w-full h-24 md:h-32"
            >
                <motion.path 
                d="M0,0 C150,40 350,0 500,30 C650,60 700,0 900,20 C1050,40 1200,10 1200,10 L1200,120 L0,120 Z" 
                fill="#223F38"
                initial={{ y: 10 }}
                animate={{ 
                    y: [10, 0, 10],
                    transition: { 
                    repeat: Infinity, 
                    duration: 5,
                    ease: "easeInOut"
                    }
                }}
                />
                <motion.path 
                d="M0,20 C200,60 400,30 550,60 C700,90 850,40 1200,50 L1200,120 L0,120 Z" 
                fill="#2c5249" 
                opacity="0.8"
                initial={{ y: 0 }}
                animate={{ 
                    y: [0, 10, 0],
                    transition: { 
                    repeat: Infinity, 
                    duration: 7,
                    ease: "easeInOut"
                    }
                }}
                />
                <motion.path 
                d="M0,40 C350,10 450,80 700,30 C950,-20 1150,70 1200,40 L1200,120 L0,120 Z" 
                fill="#519485" 
                opacity="0.6"
                initial={{ y: 5 }}
                animate={{ 
                    y: [5, 15, 5],
                    transition: { 
                    repeat: Infinity, 
                    duration: 6,
                    ease: "easeInOut"
                    }
                }}
                />
            </svg>
            </div>
        </div>
    );
};

export default DynamicDetailedProperty;