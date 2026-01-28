import { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

export default function Pass() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [hours, setHours] = useState(1);
    const [selfie, setSelfie] = useState(null);
    const navigate = useNavigate();

    const increase = () => {
        if (hours < 6) setHours(hours + 1);
    };

    const decrease = () => {
        if (hours > 1) setHours(hours - 1);
    };

    return (
        <div className="min-h-screen grid-bg p-6 font-[Nunito]">
            <div className="w-full flex justify-center">
                <div className="w-full max-w-6xl mx-2 mb-6">
                    <Navbar
                        onLoginClick={() => setShowLogin(true)}
                        onSignupClick={() => setShowSignup(true)}
                    />
                </div>
            </div>
            {showLogin && <Login onClose={() => setShowLogin(false)} />}
            {showSignup && <Signup onClose={() => setShowSignup(false)} />}
            <div className="max-w-3xl mx-auto bg-[#f9ffcfdd] backdrop-blur p-8 rounded-2xl shadow">
                <h1 className="text-3xl font-bold text-[#9673d2] font-[Merriweather] mb-6">
                    Request a Visitor Pass
                </h1>
                <form className="space-y-4">
                    <input
                        type="text"
                        placeholder="Visitor Name"
                        className="w-full p-3 rounded-lg border"
                    />
                    <input
                        type="email"
                        placeholder="Visitor Email"
                        className="w-full p-3 rounded-lg border"
                    />
                    <input
                        type="text"
                        placeholder="Purpose of Visit"
                        className="w-full p-3 rounded-lg border"
                    />
                    <input
                        type="datetime-local"
                        className="w-full p-3 rounded-lg border"
                    />
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={decrease}
                            className={`w-8 h-8 rounded-full bg-gray-200 text-xl ${hours === 1 ? "text-gray-300 text-gray-400 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"}`}
                        >
                            −
                        </button>
                        <span className="text-md font-semibold">
                            {hours} hour{hours > 1 && "s"}
                        </span>
                        <button
                            type="button"
                            onClick={increase}
                            className={`w-8 h-8 rounded-full bg-gray-200 text-xl ${hours === 6 ? "text-gray-300 text-gray-400 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"}`}
                        >
                            +
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Pass will auto-expire after selected duration (max 6 hours)
                    </p>
                    {/* from backend */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Visitor Selfie
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setSelfie(e.target.files[0])}
                            className="w-full p-3 border rounded-lg bg-white"
                        />
                        {selfie && (
                            <img
                                src={URL.createObjectURL(selfie)}
                                alt="Preview"
                                className="mt-4 w-32 h-32 object-cover rounded-xl border"
                            />
                        )}
                    </div>
                    <button
                        type="submit"
                        className="bg-[#9673d2] text-white px-6 py-3 rounded-full hover:scale-105 transition" onClick={(e) => {
                            e.preventDefault();
                            navigate("/pass/VS-29408");
                            // from backend
                        }}
                    >
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    );
}