import { useState } from "react";

export default function Signup({ onClose }) {
    const [closing, setClosing] = useState(false);

    const handleClose = () => {
        setClosing(true);
        SetTimeout(onClose, 250);
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className={`absolute inset-0 bg-black/60 ${closing ? "animate-fade-out" : "animate-fade-in"}`} onClick={() => {
                onClose();
                handleClose();
            }} />
            <div className={`relative z-10 max-w-md w-full bg-[#f8f9fe] rounded-2xl p-8 shadow-lg animate-scaleIn  ${closing ? "animate-scale-out" : "animate-scale-in"}`}>
                <button className="absolute top-3 right-3 hover:text-black" onClick={() => {
                    onClose();
                    handleClose();
                }}>✕</button>
                <h2 className="text-xl text-center mb-4">Welcome to <span className="font-[Merriweather]">VisitSecure.</span></h2>
                <p className="pl-1 mb-1 text-sm">Email</p>
                <input className="w-full border rounded-2xl px-4 py-2 text-sm mb-4" type="email" placeholder="Enter your email" />
                <p className="pl-1 mb-1 text-sm">Password</p>
                <input className="w-full border rounded-2xl px-4 py-2 text-sm mb-4" type="password" placeholder="Create a password" />
                <button className="w-full text-sm font-semibold bg-[#ccaae6] text-white rounded-2xl p-3 mt-4 hover:bg-[#8a6fc7] ">Sign Up</button>
            </div>
        </div>
    );
}