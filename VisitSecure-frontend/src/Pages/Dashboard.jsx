import { useState, useEffect } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import Navbar from "./Navbar";
import { Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function Dashboard() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [copied, setCopied] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [user, setUser] = useState(null);
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [hostCode, setHostCode] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        let code = localStorage.getItem("hostCode");
        setHostCode(code);
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        fetchTodayVisitors();
    }, []);

    const fetchTodayVisitors = async () => {
        try {
            const hostCode = localStorage.getItem("hostCode")?.trim().toUpperCase();
            const res = await fetch(`http://localhost:8080/api/visitor/today?hostCode=${hostCode}`);
            const data = await res.json();

            setVisitors(data);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch visitors");
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(hostCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const getDate = (ts) => {
        if (!ts) return "No date";
        return new Date(ts.seconds * 1000).toLocaleDateString();
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
            {showLogin && (
                <Login onClose={() => setShowLogin(false)} />
            )}
            {showSignup && (
                <Signup onClose={() => setShowSignup(false)} />
            )}
            <div className="max-w-6xl mx-auto p-6 pt-30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#f9ffcfdd] p-6 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:translate-y-[-2px] transition-transform duration-300">
                        <p className="text-sm mb-2">Your Visit Code</p>

                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold text-[#9673d2] font-[Merriweather]">
                                {hostCode}
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
                        <button className="bg-white/80 text-[#9673d2] px-6 py-3 rounded-full hover:bg-[#9673d2] hover:text-white transition font-semibold border hover:translate-y-[-2px]" onClick={() => navigate("/history")}>
                            Full visitor history
                        </button>
                    </div>
                </div>
                <div className="py-8 px-2 my-2">
                    <h1 className="text-2xl font-[Merriweather] py-4">Visitors Today</h1>
                    {loading ? (
                        <p className="text-center">Loading...</p>
                    ) : visitors.length > 0 ? (
                        <div className="space-y-4">
                            {visitors.map((visitor) => {

                                const statusText = visitor.entered
                                    ? "Inside"
                                    : visitor.status === "APPROVED"
                                        ? "Approved"
                                        : visitor.status === "REJECTED"
                                            ? "Rejected"
                                            : "Pending";

                                const statusStyle =
                                    visitor.entered || visitor.status === "APPROVED"
                                        ? "bg-green-100 text-green-700"
                                        : visitor.status === "REJECTED"
                                            ? "bg-red-100 text-red-600"
                                            : "bg-yellow-100 text-yellow-700";

                                return (
                                    <div
                                        key={visitor.id}
                                        className="bg-white/70 backdrop-blur p-4 rounded-xl shadow-sm flex justify-between items-center"
                                    >
                                        <div className="flex gap-4">
                                            <div>
                                                <img
                                                    src={visitor.selfieUrl || "user.png"}
                                                    className="w-[50px] rounded-2xl object-contain cursor-pointer hover:scale-105 transition"
                                                    onClick={() => setSelectedImage(visitor.selfieUrl)}
                                                />
                                            </div>

                                            <div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">
                                                        {visitor.name} • {getDate(visitor.visitTimeTs)}
                                                    </p>

                                                    <p className="text-sm text-gray-500">
                                                        {formatPhone(visitor.phone) || "No phone"} • {visitor.purpose} •{" "}
                                                        {getTime(visitor.visitTimeTs)} - {getTime(visitor.expiresAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <span
                                            className={`text-xs px-3 py-1 ml-2 rounded-full font-medium ${statusStyle}`}
                                        >
                                            {statusText}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white/60 p-6 rounded-xl text-center text-gray-500 backdrop-blur shadow-sm">
                            No visitors today
                        </div>
                    )}
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
            </div>
        </div>
    );
}
