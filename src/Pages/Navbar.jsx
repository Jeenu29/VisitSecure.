import { useState } from "react";

export default function Navbar({ onLoginClick, onSignupClick }) {
    const [open, setOpen] = useState(false);
    return (
        <nav className="bg-[#ccaae6] h-14 text-white rounded-full mt-4 shadow-xl z-50">
            <div className="h-full flex items-center justify-between px-4 sm:px-6">
                <a href="/">
                    <img
                        src="logo.png"
                        className="w-12 h-12 object-contain"
                        alt="logo"
                    />
                </a>
                <div className="hidden sm:flex items-center gap-6 ml-auto font-semibold">
                    <a href="#" className="hover:text-[#8a6fc7] transition" onClick={onLoginClick} >Log In</a>
                    <a href="#" className="hover:text-[#8a6fc7] transition" onClick={onSignupClick}>Sign Up</a>
                </div>
                <button className="sm:hidden ml-auto text-sm font-medium hover:text-[#8a6fc7]" onClick={() => setOpen(!open)}>
                    Menu
                </button>
                <div className={`sm:hidden absolute z-50 top-16 right-4 w-40 bg-white text-[#ccaae6] rounded-xl shadow-xl overflow-hidden transition-all duration-300 ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"} `} >
                    <button className="w-full px-4 py-3 text-left hover:text-[#8a6fc7]" onClick={() => { onLoginClick(); setOpen(false); }}>Log In</button>
                    <hr />
                    <button className="w-full px-4 py-3 text-left hover:text-[#8a6fc7]" onClick={() => { onSignupClick(); setOpen(false); }}>Sign Up</button>
                </div>
            </div>
        </nav>
    );
}
