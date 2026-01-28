import Navbar from "./Navbar";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function VisitorHistory() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    //from backend
    const visitors = [
        {
            id: "VS-29408",
            name: "Anita Sharma",
            purpose: "Project Discussion",
            date: "2026-01-26",
            intime: "10:30 AM",
            outime: "11:30 AM",
            status: "Approved",
            img: "/user.png",
            contact: "3637282910",
            code: "+91",
        },
        {
            id: "VS-29409",
            name: "Rahul Verma",
            purpose: "Interview",
            date: "2026-01-27",
            intime: "12:30 AM",
            outime: "2:30 AM",
            status: "Not Approved",
            img: "/user.png",
            contact: "7289103792",
            code: "+91",
        },
    ];

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
            <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur p-6 rounded-2xl shadow mt-10">
                <h1 className="text-3xl font-[Merriweather] mb-6">
                    Visitor History
                </h1>

                {visitors.length === 0 ? (
                    <p className="text-gray-500 text-center">
                        No visitor history available.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {visitors.map((visitor) => (
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
                                            {visitor.name} • {visitor.date}
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
                    </div>
                )}
            </div>
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
    );
}