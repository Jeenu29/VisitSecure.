import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Login from "../components/Login";
import Signup from "../components/Signup";

export default function Pass() {
    const { passId } = useParams();
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

    //from backend
    const passes = {
        "VS-29408": {
            name: "Anita Sharma",
            purpose: "Project Discussion",
            visiting: "Jeenu Bishnoi",
            selfie: "/user.png",
            issued: "10:30 AM",
            expires: "11:30 AM",
            duration: 60 * 60,
        },
    };

    const pass = passes[passId];

    const [isActive, setIsActive] = useState(pass ? true : false);
    const [timeLeft, setTimeLeft] = useState(pass ? pass.duration : 0);

    useEffect(() => {
        if (!isActive) return;

        if (timeLeft <= 0) {
            setIsActive(false);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, isActive]);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
    };

    if (!pass) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-600 text-xl font-semibold">
                Invalid or expired pass
            </div>
        );
    }

    return (
        <div className="min-h-screen grid-bg font-[Nunito] relative overflow-hidden">
            <Navbar
                mode="static"
                onLoginClick={() => setShowLogin(true)}
                onSignupClick={() => setShowSignup(true)}
            />
            {showLogin && <Login onClose={() => setShowLogin(false)} />}
            {showSignup && <Signup onClose={() => setShowSignup(false)} />}
            <div className="flex justify-center items-center mt-40">
                <div
                    className={`relative w-[360px] rounded-3xl p-6 shadow-2xl transition-transform
                    ${isActive ? "bg-white/90 card-pop" : "bg-gray-100 grayscale"}
                `}
                >

                    {!isActive && (
                        <div className="absolute inset-0 bg-red-600/80 rounded-3xl flex items-center justify-center z-10">
                            <span className="text-white text-2xl font-bold rotate-[-20deg]">
                                DEACTIVATED
                            </span>
                        </div>
                    )}

                    <div className="text-center mb-4">
                        <h2 className="text-xl font-bold text-[#9673d2] font-[Merriweather]">
                            Visitor Pass
                        </h2>
                        <p className="text-xs text-gray-500">Pass ID: {passId}</p>
                    </div>

                    <div className="flex justify-center mb-4">
                        <img
                            src={pass.selfie}
                            alt="Visitor"
                            className={`w-24 h-24 rounded-full object-cover border-6
                            ${isActive ? "border-green-200" : "border-red-400"}
                            `}
                        />
                    </div>

                    <div className="space-y-2 text-sm">
                        <p><strong>Name:</strong> {pass.name}</p>
                        <p><strong>Purpose:</strong> {pass.purpose}</p>
                        <p><strong>Visiting:</strong> {pass.visiting}</p>
                        <p><strong>Issued:</strong> {pass.issued}</p>
                        <p><strong>Expires:</strong> {pass.expires}</p>
                    </div>

                    <div className="mt-4 text-center">
                        {isActive ? (
                            <div className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                Active • <span className="font-semibold">{formatTime(timeLeft)} </span>remaining
                            </div>
                        ) : (
                            <div className="text-red-600 font-semibold">
                                Pass Expired
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}
