import { Link } from "react-router-dom";

function LandingPage() {
    return (
        <div className="bg-gradient-to-br from-blue-100 to-cyan-100 min-h-screen flex flex-col">
            {/* Header */}
            <nav className="bg-[#223F38] py-5 flex justify-center">
                <h1 className="text-2xl font-mono text-white font-semibold">
                    RightHomeAI
                </h1>
            </nav>

            {/* Main Content */}
            <main className="flex-grow flex flex-col justify-center items-center gap-16 px-4">
                <p className="text-[#223F38] text-2xl font-mono text-center">
                    Make Your Property Search Ease!
                </p>
                <Link to="dynamic-chatbot">
                    <button className="bg-[#223F38] transition-all hover:translate-y-1 duration-200 font-mono text-white p-4 border-b-[5px] border-r-[5px] border-black rounded-tl-3xl rounded-br-3xl shadow-md">
                        Try RightHomeAI Now!
                    </button>
                </Link>
            </main>

            {/* Footer */}
            <footer className="bg-gradient-to-b from-transparent to-[#223F38] py-6">
                <p className="font-mono text-center text-[#223F38]/80 font-semibold tracking-wide drop-shadow-md text-xs mx-6">
                    RightHomeAI's Dynamic Chatbot Flow for Testing Purpose Only!
                </p>
            </footer>
        </div>
    );
}

export default LandingPage;
