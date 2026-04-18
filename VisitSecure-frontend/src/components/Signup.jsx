import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Signup({ onClose }) {
    const [closing, setClosing] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleClose = () => {
        setClosing(true);
        setTimeout(onClose, 250);
    }

    const handleSignup = async () => {
        setError("");

        if (!name || !email || !password) {
            setError("All fields are required");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const userCred = await createUserWithEmailAndPassword(auth, email, password);

            await updateProfile(userCred.user, {
                displayName: name
            });

            const token = await userCred.user.getIdToken(true);

            localStorage.setItem("token", token);

            setTimeout(() => {
                onClose();
            }, 1500);

        } catch (error) {
            console.error(error);
            if (error.code === "auth/email-already-in-use") {
                setError("This email is already registered");
            } else if (error.code === "auth/invalid-email") {
                setError("Please enter a valid email address");
            } else if (error.code === "auth/weak-password") {
                setError("Password is too weak");
            } else {
                setError("Something went wrong. Please try again");
            }
        } finally {
            setLoading(false);
        }
    };


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
                {error && (
                    <p className="text-red-500 text-sm mb-2">{error}</p>
                )}
                <p className="pl-1 mb-1 text-sm">Name</p>
                <input className="w-full border rounded-2xl px-4 py-2 text-sm mb-4" type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
                <p className="pl-1 mb-1 text-sm">Email</p>
                <input className="w-full border rounded-2xl px-4 py-2 text-sm mb-4" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <p className="pl-1 mb-1 text-sm">Password</p>
                <div className="relative mb-4">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded-2xl px-4 py-2 text-sm pr-10"
                    />

                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5"
                    >
                        <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                        />
                    </span>
                </div>
                <p className="pl-1 mb-1 text-sm">Confirm Password</p>
                <div className="relative mb-4">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border rounded-2xl px-4 py-2 text-sm pr-10"
                    />

                    <span
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2.5"
                    >
                        <FontAwesomeIcon
                            icon={showConfirmPassword ? faEyeSlash : faEye}
                        />
                    </span>
                </div>
                <button className="w-full text-sm font-semibold bg-[#ccaae6] text-white rounded-2xl p-3 mt-4 hover:bg-[#8a6fc7]" onClick={handleSignup} disabled={loading}>{loading ? "Creating..." : "Sign Up"}</button>
            </div>
        </div>
    );
}