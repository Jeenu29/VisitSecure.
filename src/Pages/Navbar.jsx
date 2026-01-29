import { useState, useEffect, useRef } from "react";

export default function Navbar({ onLoginClick, mode = "scroll", onSignupClick }) {
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);
    const hideTimeout = useRef(null);

    useEffect(() => {
        // 🔒 STATIC MODE → NO SCROLL LOGIC AT ALL
        if (mode === "static") {
            setVisible(true);
            return;
        }

        const handleScroll = () => {
            const currentY = window.scrollY;

            // 🟢 Always visible at top
            if (currentY < 50) {
                setVisible(true);
                clearTimeout(hideTimeout.current);
            }
            // ⬆️ scrolling up
            else if (currentY < lastScrollY.current) {
                setVisible(true);
                clearTimeout(hideTimeout.current);

                // ⏳ auto-hide after 2s
                hideTimeout.current = setTimeout(() => {
                    setVisible(false);
                }, 2000);
            }
            // ⬇️ scrolling down
            else {
                setVisible(false);
                clearTimeout(hideTimeout.current);
            }

            lastScrollY.current = currentY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearTimeout(hideTimeout.current);
        };
    }, [mode]);

    return (
        <nav className={`bg-[#ccaae6] h-14 text-white rounded-full mt-4 shadow-xl z-50 fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-6xl transition-transform duration-300
      ${visible ? "translate-y-0" : "-translate-y-24"}`}>
            <div className="h-full flex items-center justify-between px-4 sm:px-6">
                <a href="/">
                    <img
                        src="/logo.png"
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
