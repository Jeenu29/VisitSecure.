import { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import Navbar from "./Navbar";
import { Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const code = "UX028HD";
    const [copied, setCopied] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();


    const visitorsToday = [
        {
            id: 1,
            name: "Anita Sharma",
            intime: "10:30 AM",
            outime: "11:30 AM",
            purpose: "Meeting",
            status: "Not Approved",
            img: "user.png",
            contact: "9292839201",
            code: "+91",
        },
        {
            id: 2,
            name: "Rahul Verma",
            intime: "11:15 AM",
            outime: "01:15 AM",
            purpose: "Project Discussion",
            status: "Approved",
            img: "user.png",
            contact: "7289103792",
            code: "+91",
        },
    ];

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="min-h-screen grid-bg font-[Nunito] relative overflow-hidden">
            <div className="w-full flex justify-center">
                <div className="w-full max-w-6xl mx-2">
                    <Navbar
                        onLoginClick={() => setShowLogin(true)}
                        onSignupClick={() => setShowSignup(true)}
                    />
                </div>
            </div>
            {showLogin && <Login onClose={() => setShowLogin(false)} />}
            {showSignup && <Signup onClose={() => setShowSignup(false)} />}
            <div className="max-w-6xl mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#f9ffcfdd] p-6 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:translate-y-[-2px] transition-transform duration-300">
                        <p className="text-sm mb-2">Your Visit Code</p>

                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold text-[#9673d2] font-[Merriweather]">
                                {code}
                            </h2>
                            <button
                                onClick={handleCopy}
                                className="p-2 rounded-lg hover:bg-[#9673d2] hover:text-white transition"
                            >
                                {copied ? (
                                    <Check size={20} className="text-white" />
                                ) : (
                                    <Copy size={20} />
                                )}
                            </button>
                        </div>
                        <p className="text-sm mt-1">
                            Share this code with your visitor
                        </p>
                    </div>
                    <div className="grid grid-col-2 items-center p-2 gap-2">
                        <button className="bg-white/80 text-[#9673d2] px-6 py-3 rounded-full hover:bg-[#9673d2] hover:text-white transition font-semibold border hover:translate-y-[-2px]" onClick={() => navigate("/pass")}>
                            Request a visit
                        </button>
                        <button className="bg-white/80 text-[#9673d2] px-6 py-3 rounded-full hover:bg-[#9673d2] hover:text-white transition font-semibold border hover:translate-y-[-2px]">
                            Full visitor history
                        </button>
                    </div>
                </div>
                <div className="py-8 px-2 my-2">
                    <h1 className="text-2xl font-[Merriweather] py-4">Visitors Today</h1>
                    {visitorsToday.length > 0 ? (
                        <div className="space-y-4">
                            {visitorsToday.map((visitor) => (
                                <div
                                    key={visitor.id}
                                    className="bg-white/70 backdrop-blur p-4 rounded-xl shadow-sm flex justify-between items-center"
                                >
                                    <div className="flex gap-4">
                                        <div>
                                            <img
                                                src={visitor.img}
                                                className="w-[50px] object-contain cursor-pointer hover:scale-105 transition"
                                                onClick={() => setSelectedImage(visitor.img)}
                                            />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {visitor.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {visitor.code} {visitor.contact} • {visitor.purpose} • {visitor.intime} - {visitor.outime}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`text-xs px-3 py-1 ml-2 rounded-full font-medium text-center
              ${visitor.status === "Inside"
                                                ? "bg-green-100 text-green-700"
                                                : visitor.status === "Approved"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-600"
                                            }
            `}
                                    >
                                        {visitor.status}
                                    </span>
                                </div>
                            ))}
                            {selectedImage && (
                                <div
                                    className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
                                    onClick={() => setSelectedImage(null)}
                                >
                                    <div
                                        className="relative"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <img
                                            src={selectedImage}
                                            className="max-w-[90vw] max-h-[90vh] rounded-2xl shadow-2xl"
                                        />

                                        <button
                                            className="absolute -top-3 -right-3 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-gray-200"
                                            onClick={() => setSelectedImage(null)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white/60 p-6 rounded-xl text-center text-gray-500 backdrop-blur shadow-sm">
                            No visitors today
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
