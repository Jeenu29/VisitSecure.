import Navbar from "./Navbar";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function VisitorHistory() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchVisitors();
    }, []);

    const fetchVisitors = async () => {
        try {
            const hostCode = localStorage.getItem("hostCode");
            const res = await fetch(`http://localhost:8080/api/visitor/history?hostCode=${hostCode}`);
            const data = await res.json();

            setVisitors(data);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch visitors");
            setLoading(false);
        }
    };

    const getDate = (ts) => {
        if (!ts) return "No date";
        return new Date(ts.seconds * 1000).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const getTime = (ts) => {
        if (!ts) return "No time";
        return new Date(ts.seconds * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatPhone = (phone) => {
        if (!phone) return "No phone";
        return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
    };

    return (
        <div className="min-h-screen grid-bg font-[Nunito] relative overflow-hidden">
            <Navbar
                mode="static"
                onLoginClick={() => setShowLogin(true)}
                onSignupClick={() => setShowSignup(true)}
            />
            {showLogin && <Login onClose={() => setShowLogin(false)} />}
            {showSignup && <Signup onClose={() => setShowSignup(false)} />}
            <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur p-6 rounded-2xl shadow mt-30">
                <h1 className="text-3xl font-[Merriweather] mb-6">
                    Visitor History
                </h1>

                {loading ? (
                    <p className="text-center">Loading...</p>
                )
                    : visitors.length > 0 ? (
                        <div className="space-y-4">
                            {visitors.map((visitor) => {

                                const statusText = visitor.entered
                                    ? "Inside"
                                    : visitor.status === "APPROVED"
                                        ? "Approved"
                                        : visitor.status === "REJECTED"
                                            ? "Rejected"
                                            : "Pending";

                                return (
                                    <div
                                        key={visitor.id}
                                        className="bg-white/70 backdrop-blur p-4 rounded-xl shadow-sm flex justify-between items-center"
                                    >
                                        <div className="flex gap-4">
                                            <div>
                                                <img
                                                    src={visitor.selfieUrl || "/user.png"}
                                                    className="w-[50px] rounded-2xl object-contain cursor-pointer hover:scale-105 transition"
                                                    onClick={() => setSelectedImage(visitor.selfieUrl)}
                                                />
                                            </div>

                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {visitor.name} • {getDate(visitor.visitTimeTs)}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    {formatPhone(visitor.phone)} • {visitor.purpose} •{" "}
                                                    {getTime(visitor.visitTimeTs)} - {getTime(visitor.expiresAt)}
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`text-xs px-3 py-1 ml-2 rounded-full font-medium text-center
                        ${statusText === "Inside" || statusText === "Approved"
                                                    ? "bg-green-100 text-green-700"
                                                    : statusText === "Rejected"
                                                        ? "bg-red-100 text-red-600"
                                                        : "bg-yellow-100 text-yellow-600"
                                                }
                    `}
                                        >
                                            {statusText}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">
                            No visitor history available.
                        </p>
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