import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function LandingPage() {
    return (
        <div className="bg-gradient-to-br from-blue-100 to-cyan-100 min-h-screen flex flex-col font-sans">
            {/* Header */}
            <motion.nav
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-[#223F38] py-6 shadow-lg flex justify-center"
            >
                <h1 className="text-3xl text-white font-bold tracking-wider drop-shadow-md">
                    RightHomeAI
                </h1>
            </motion.nav>

            {/* Main Content */}
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
