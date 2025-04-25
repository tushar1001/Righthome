import { Link } from "react-router-dom";

function LandingPage() {
    return (
        <div className="bg-gradient-to-br from-blue-100 to-cyan-100 h-[100dvh] flex flex-col justify-between">
            <section>
                <nav className="bg-[#223F38] py-5 flex justify-center">
                <h1 className="text-2xl font-mono text-white font-semibold">
                    RightHomeAI
                </h1>
                </nav>
            </section>
            <section className="container flex flex-col justify-center gap-[4rem] items-center">
                <p className="text-[#223F38] text-2xl font-mono text-center">
                Make Your Property Search Ease!
                </p>
                <Link to="dynamic-chatbot">
                <button className="bg-[#223F38] transition-all hover:translate-y-1 duration-200 font-mono text-white p-4 border-b-[5px] border-r-[5px] border-black rounded-tl-3xl rounded-br-3xl shadow-md">
                    Try RightHomeAI Now!
                </button>
                </Link>
            </section>

            <footer className="container bg-gradient-to-b from-transparent to-[#223F38]">
                <p className="font-mono text-center py-8 text-[#223F38]/80 font-semibold tracking-wide drop-shadow-md text-xs mx-6">{`RightHomeAI's Dynamic Chatbot Flow for Testing Purpose Only! `}</p>
            </footer>
        </div>
    );
}

export default LandingPage;
