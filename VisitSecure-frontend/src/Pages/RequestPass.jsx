import { useState, useEffect } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import Navbar from "./Navbar";
import Webcam from "react-webcam";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default function Pass() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [hours, setHours] = useState(1);
    const [selfie, setSelfie] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [hostCode, setHostCode] = useState("");
    const [purpose, setPurpose] = useState("");
    const [visitTime, setVisitTime] = useState("");
    const [status, setStatus] = useState("FORM");
    const [visitCode, setVisitCode] = useState("");
    const [visitorId, setVisitorId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const webcamRef = useRef(null);
    const navigate = useNavigate();

    const increase = () => {
        if (hours < 6) setHours(hours + 1);
    };

    const decrease = () => {
        if (hours > 1) setHours(hours - 1);
    };

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setSelfie(imageSrc);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8080/api/visitor/request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    purpose,
                    hostCode: hostCode.trim().toUpperCase(),
                    visitTime,
                    durationHours: hours,
                    selfie: selfie
                })
            });

            const data = await res.json();
            const existing = JSON.parse(localStorage.getItem("visitorRequests")) || [];
            existing.push(data.id);
            localStorage.setItem("visitorRequests", JSON.stringify(existing));

            if (res.ok) {
                setVisitorId(data.id);
                setStatus("PENDING");
            } else {
                console.log("Error: " + data);
            }

        } catch (error) {
            console.error("Network error:", error);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const requests = JSON.parse(localStorage.getItem("visitorRequests")) || [];

        if (requests.length > 0) {
            const latestId = requests[requests.length - 1];
            setVisitorId(latestId);
        }
    }, []);

    useEffect(() => {
        if (status === "REJECTED") {
            localStorage.removeItem("visitorId");
            setVisitorId(null);
        }
    }, [status]);

    useEffect(() => {
        if (!visitorId) return;

        const unsubscribe = onSnapshot(
            doc(db, "visitors", visitorId),
            (docSnap) => {
                if (!docSnap.exists()) return;

                const data = docSnap.data();

                const requests = JSON.parse(localStorage.getItem("visitorRequests")) || [];

                if (data.status === "APPROVED") {
                    const updated = requests.filter(id => id !== visitorId);
                    localStorage.setItem("visitorRequests", JSON.stringify(updated));

                    navigate(`/pass/${data.visitCode}`);
                }

                if (data.status === "REJECTED") {
                    const updated = requests.filter(id => id !== visitorId);
                    localStorage.setItem("visitorRequests", JSON.stringify(updated));

                    setStatus("REJECTED");
                }
            }
        );

        return () => unsubscribe();
    }, [visitorId]);

    if (loading) {
        return <div>Submitting request...</div>;
    }

    const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

    return (
        <div className="min-h-screen grid-bg p-6">
            <Navbar
                mode="static"
                onLoginClick={() => setShowLogin(true)}
                onSignupClick={() => setShowSignup(true)}
            />
            {showLogin && <Login onClose={() => setShowLogin(false)} />}
            {showSignup && <Signup onClose={() => setShowSignup(false)} />}
            {status === "FORM" && (
                <div className="max-w-3xl mx-auto bg-[#f9ffcfdd] backdrop-blur p-8 rounded-2xl shadow mt-24">
                    <h1 className="text-3xl font-bold text-[#9673d2] font-[Merriweather] mb-6">
                        Request a Visitor Pass
                    </h1>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {phone && !isValidPhone(phone) && (
                            <p className="text-red-500 text-sm">Invalid phone number</p>
                        )}
                        <input
                            type="text"
                            placeholder="Visitor Name"
                            className="w-full p-3 rounded-lg border"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="Visitor Email"
                            className="w-full p-3 rounded-lg border"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="tel"
                            placeholder="Visitor Mobile Number"
                            className="w-full p-3 rounded-lg border"
                            value={phone}
                            onChange={(e) => {
                                // allow only digits, max 10
                                const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
                                setPhone(cleaned);
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Host Code"
                            className="w-full p-3 rounded-lg border"
                            value={hostCode}
                            onChange={(e) => setHostCode(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Purpose of Visit"
                            className="w-full p-3 rounded-lg border"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                        />
                        <input
                            type="datetime-local"
                            className="w-full p-3 rounded-lg border"
                            value={visitTime}
                            onChange={(e) => setVisitTime(e.target.value)}

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
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Visitor Selfie
                            </label>
                            {!selfie ? (
                                <>
                                    <Webcam
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        className="rounded-lg w-full max-w-sm"
                                    />
                                    <button
                                        onClick={capture}
                                        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded"
                                    >
                                        Capture Selfie
                                    </button>
                                </>
                            ) : (
                                <>
                                    <img src={selfie} alt="selfie" className="rounded-lg w-48" />
                                    <button
                                        onClick={() => setSelfie(null)}
                                        className="mt-3 px-4 py-2 bg-gray-500 text-white rounded"
                                    >
                                        Retake
                                    </button>
                                </>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="bg-[#9673d2] text-white px-6 py-3 rounded-full hover:scale-105 transition"
                        >
                            Submit Request
                        </button>
                    </form>
                </div>
            )}
            {status === "PENDING" && (
                <div className="text-center mt-20">
                    <h2 className="text-2xl font-bold text-yellow-600">Request Pending</h2>
                    <p>Waiting for host approval...</p>

                    <button
                        onClick={() => {
                            setStatus("FORM");
                            setVisitorId(null);
                        }}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Create New Request
                    </button>
                </div>
            )}

            {status === "REJECTED" && (
                <div className="text-center mt-20">
                    <h2 className="text-2xl font-bold text-red-600">Rejected</h2>
                    <p>Your request was denied</p>
                </div>
            )}
        </div>
    );
}