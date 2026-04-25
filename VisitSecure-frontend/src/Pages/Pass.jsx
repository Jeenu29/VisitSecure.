import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Login from "../components/Login";
import Signup from "../components/Signup";

export default function Pass() {
    const { visitCode } = useParams();
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [pass, setPass] = useState(null);
    const [visitStart, setVisitStart] = useState(null);
    const [loading, setLoading] = useState(true);

    const parseTimestamp = (ts) => {
        if (!ts) return null;

        // Firestore Web SDK format
        if (ts._seconds) {
            return new Date(ts._seconds * 1000);
        }

        // Firestore Admin SDK (Java) format
        if (ts.seconds) {
            return new Date(ts.seconds * 1000);
        }

        // String fallback
        if (typeof ts === "string") {
            const cleaned = ts
                .replace(" at ", " ")
                .replace(" UTC", "");

            const d = new Date(cleaned);
            return isNaN(d.getTime()) ? null : d;
        }

        const d = new Date(ts);
        return isNaN(d.getTime()) ? null : d;
    };


    useEffect(() => {
        if (!visitCode || visitCode === "undefined") {
            setLoading(false);
            return;
        }

        console.log("visitCode:", visitCode);
        fetchPass();
    }, [visitCode]);

    const fetchPass = async () => {
        try {
            console.log("FETCH STARTED");
            const res = await fetch(
                `http://localhost:8080/api/visitor/pass?visitCode=${visitCode}`
            );
            console.log("visitCode:", visitCode);

            if (!res.ok) {
                setPass(null);
                setLoading(false);
                return;
            }

            const data = await res.json();
            setPass(data);

            const now = new Date();
            const vs = parseTimestamp(data.visitTimeTs);
            const exp = parseTimestamp(data.expiresAt);

            console.log("NOW:", now);
            console.log("VISIT START:", vs);
            console.log("EXPIRES:", exp);

            setVisitStart(vs);

            let active = false;

            if (data.status === "APPROVED" && vs && exp) {
                if (now >= vs && now <= exp) {
                    active = true;
                }
            }

            const secondsLeft = exp
                ? Math.max(0, Math.floor((exp - now) / 1000))
                : 0;

            setIsActive(active);
            setTimeLeft(secondsLeft);

        } catch (err) {
            console.error(err);
            setPass(null);
        } finally {
            setLoading(false); // 🔥 VERY IMPORTANT
        }
    };

    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600 text-xl">
                Loading pass...
            </div>
        );
    }

    if (!pass) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-600 text-xl font-semibold">
                Invalid or expired pass
            </div>
        );
    }

    if (pass.status !== "APPROVED") {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-600 text-xl font-semibold">
                Pass not approved
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
            {!isActive && visitStart && Date.now() < visitStart.getTime() && (
                <div className="text-yellow-600 text-center mt-2">
                    Pass not active yet
                </div>
            )}
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
                        <p className="text-xs text-gray-500">Visit ID: {visitCode}</p>
                    </div>

                    <div className="flex justify-center mb-4">
                        <img
                            src={pass.selfieUrl}
                            alt="Visitor"
                            className={`w-24 h-24 rounded-full object-cover border-6
                            ${isActive ? "border-green-200" : "border-red-400"}
                            `}
                        />
                    </div>

                    <div className="space-y-2 text-sm">
                        <p><strong>Name:</strong> {pass.name}</p>
                        <p><strong>Purpose:</strong> {pass.purpose}</p>
                        <p><strong>Visit Time:</strong> {visitStart?.toLocaleString()}</p>
                        <p><strong>Approved At:</strong> {parseTimestamp(pass.approvedAt)?.toLocaleString()}</p>
                        <p><strong>Expires:</strong> {parseTimestamp(pass.expiresAt)?.toLocaleString()}</p>
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
