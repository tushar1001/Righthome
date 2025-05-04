import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Map, MessageCircle, Search } from "lucide-react"; // install lucide-react if not already

function LandingPage() {
    const features = [
        {
            icon: <Home className="w-10 h-10 text-[#223F38]" />,
            title: "Discover Properties",
            description: "Get access to a wide range of properties tailored to your needs."
        },
        {
            icon: <Map className="w-10 h-10 text-[#223F38]" />,
            title: "Smart Recommendations",
            description: "AI recommends homes based on your preferences and location."
        },
        {
            icon: <Search className="w-10 h-10 text-[#223F38]" />,
            title: "Detailed Search Filters",
            description: "Easily narrow down your search with intuitive filters."
        },
        {
            icon: <MessageCircle className="w-10 h-10 text-[#223F38]" />,
            title: "Chatbot Assistance",
            description: "Get instant help through our dynamic chatbot."
        }
    ];

    return (
        <div className="bg-gradient-to-br from-blue-100 to-cyan-100 min-h-screen flex flex-col font-sans">
            {/* Header */}
            <motion.nav
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="bg-[#223F38] py-6 shadow-lg flex justify-center"
            >
                <h1 className="text-3xl text-white font-bold tracking-wider drop-shadow-md">
                    RightHomeAI
                </h1>
            </motion.nav>

            {/* Hero Section */}
            <main className="flex-grow flex flex-col justify-center items-center gap-16 px-4">
                <motion.p
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="text-[#223F38] text-3xl md:text-4xl font-semibold text-center max-w-2xl leading-snug"
                >
                    Make Your Property Search Easy!
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <Link to="dynamic-chatbot">
                        <button className="bg-gradient-to-r from-[#223F38] to-green-800 hover:from-green-800 hover:to-[#223F38] transition-all duration-300 ease-in-out text-white px-6 py-4 border-b-[5px] border-r-[5px] border-black rounded-tl-3xl rounded-br-3xl shadow-xl text-lg font-mono hover:scale-105">
                            🚀 Try RightHomeAI Now!
                        </button>
                    </Link>
                </motion.div>
            </main>

            {/* What We Do Section */}
            <section className="py-16 px-6 bg-white/70 backdrop-blur-md shadow-inner">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="text-center text-2xl md:text-3xl text-[#223F38] font-bold mb-12"
                >
                    What Does RightHomeAI Do?
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
                    {features.map((feat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all text-center"
                        >
                            <div className="mb-4 flex justify-center">{feat.icon}</div>
                            <h3 className="text-lg font-semibold text-[#223F38] mb-2">{feat.title}</h3>
                            <p className="text-sm text-gray-600">{feat.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="bg-gradient-to-b from-transparent to-[#223F38] py-6"
            >
                <p className="text-center text-white/70 font-light tracking-wide text-xs mx-6">
                    RightHomeAI's Dynamic Chatbot Flow for Testing Purpose Only!
                </p>
            </motion.footer>
        </div>
    );
}

export default LandingPage;
