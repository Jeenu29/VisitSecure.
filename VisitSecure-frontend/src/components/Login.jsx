import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function Login({ onClose }) {
    const [closing, setClosing] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetMsg, setResetMsg] = useState("");
    const [resetError, setResetError] = useState("");

    const navigate = useNavigate();

    const handleForgotPassword = async () => {
        setResetMsg("");
        setResetError("");

        if (!email) {
            setResetError("Enter your email first");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setResetMsg("Password reset link sent to your email");
        } catch (error) {
            console.error(error);

            if (error.code === "auth/user-not-found") {
                setResetError("No account found with this email");
            } else if (error.code === "auth/invalid-email") {
                setResetError("Invalid email format");
            } else {
                setResetError("Failed to send reset email");
            }
        }
    };

    const handleLogin = async () => {
        setError("");

        if (!email || !password) {
            setError("All fields are required");
            return;
        }

        try {
            setLoading(true);
            const userCred = await signInWithEmailAndPassword(auth, email, password);

            const token = await userCred.user.getIdToken();

            localStorage.setItem("token", token); // MUST

            const res = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const hostCode = await res.text();
            localStorage.setItem("hostCode", hostCode);

            navigate("/dashboard");
            onClose();

        } catch (error) {
            console.error(error);

            if (error.code === "auth/user-not-found") {
                setError("No account found with this email");
            } else if (error.code === "auth/wrong-password") {
                setError("Incorrect password");
            } else if (error.code === "auth/invalid-email") {
                setError("Invalid email");
            } else {
                setError("Login failed. Try again");
            }

        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setClosing(true);
        setTimeout(onClose, 250);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className={`absolute inset-0 bg-black/60 ${closing ? "animate-fade-out" : "animate-fade-in"}`} onClick={() => {
                onClose();
                handleClose();
            }} />
            <div className={`relative z-10 max-w-md w-full bg-[#f8f9fe] rounded-2xl p-8 shadow-lg animate-scaleIn  ${closing ? "animate-scale-out" : "animate-scale-in"}`}>
                <button className="absolute top-3 right-3 text-[#3e2522] hover:text-black" onClick={() => {
                    onClose();
                    handleClose();
                }}>✕</button>
                <h2 className="text-xl text-center mb-4">Welcome to <span className="font-[Merriweather]">VisitSecure.</span></h2>
                {error && (
                    <p className="text-red-500 text-sm mb-2">{error}</p>
                )}
                <p className="pl-1 mb-1 text-sm">Email</p>
                <input className="w-full border rounded-2xl px-4 py-2 text-sm mb-4" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                <p className="pl-1 mb-1 text-sm">Password</p>
                <div className="relative mb-1">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full border rounded-2xl px-4 py-2 text-sm pr-10"
                    />

                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                    >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </span>
                </div>
                {resetMsg && (
                    <p className="text-green-600 text-sm mb-2">{resetMsg}</p>
                )}

                {resetError && (
                    <p className="text-red-500 text-sm mb-2">{resetError}</p>
                )}
                <a className="text-sm text-blue-600 pl-1" onClick={handleForgotPassword}>forgot your password?</a>
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full text-sm font-semibold bg-[#ccaae6] text-white rounded-2xl p-3 mt-4 hover:bg-[#8a6fc7]"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </div>
        </div>
    );
}
