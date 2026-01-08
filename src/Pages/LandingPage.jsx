import Navbar from "./Navbar";
import { useEffect, useState, useRef } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import AnimatedText from "../components/animatedtext";
import Card from "../components/Card";


export default function LandingPage() {
    const [index, setIndex] = useState(0);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [x, setX] = useState(0);
    const sectionRef = useRef(null);
    const trackRef = useRef(null);

    const taglines = [
        "Smarter visits. Safer spaces.",
        "Security that starts before the gate.",
        "Access granted — the smart way.",
        "Your gate just got smarter.",
    ];

    useEffect(() => {
        const Interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % taglines.length);
        }, 3500);
        return () => clearInterval(Interval);
    }, []);


    useEffect(() => {
        setLoaded(true);
    }, []);

    useEffect(() => {
        const onScroll = () => {
            const section = sectionRef.current;
            const track = trackRef.current;
            if (!section || !track) return;

            const scrollTop = window.scrollY;
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const windowHeight = window.innerHeight;

            const progress =
                (scrollTop - sectionTop) / (sectionHeight - windowHeight);

            const maxX = track.scrollWidth - window.innerWidth;

            setX(Math.min(Math.max(progress * maxX, 0), maxX));
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);


    return (
        <div className=" min-h-screen
  bg-[linear-gradient(120deg,#738fbd,#d2b3db,#dbd6df,#db88a4,#cc8eb1)]
  animate-gradient">
            <div className=" w-full flex justify-center">
                <div className="w-full max-w-6xl mx-2">
                    <Navbar onLoginClick={() => setShowLogin(true)} onSignupClick={() => setShowSignup(true)} />
                </div>
            </div>
            {showLogin && (
                <Login onClose={() => setShowLogin(false)} />
            )}
            {showSignup && (
                <Signup onClose={() => setShowSignup(false)} />
            )}
            <div className="max-w-6xl mx-auto px-6 mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className={`transition-all  duration-900 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} `}>
                        <h1 className={`font-bold text-3xl lg:text-4xl leading-tight text-[#9673d2]`}>
                            <AnimatedText text="Welcome to VisitSecure." />
                        </h1>
                        <p className="text-md mt-4" key={index}>
                            <AnimatedText text={taglines[index]} />
                        </p>
                        <button className="bg-white/80 mt-8 text-[#9673d2] px-5 py-3 rounded-full hover:bg-[#9673d2] hover:text-white transition font-semibold border">Request a visit</button>
                    </div>
                    <div className={`flex justify-center md:justify-end transition-all ease-out delay-300 duration-900 ${loaded ? "opacity-100 translate-y-4" : "opacity-0 translate-y-0"}`}>
                        <div className="w-[350px] h-[400px] rounded-4xl bg-white/50 shadow-xl p-6 relative mb-20">
                            <h3 className="text-lg font-semibold flex justify-center mb-4">Visitor card</h3>
                            <img src="user.png" className={`object-contain w-full h-30 rounded-full mb-8 transition-all ease-out delay-300 duration-900 ${loaded ? "opacity-100 translate-y-4" : "opacity-0 translate-y-0"}`} />
                            <p className="ml-2 text-nd ">Name: Jeenu Bishnoi<br />
                                Visiting: CS Dept<br />
                                Time: 10:30 AM</p>
                            <span className="absolute bottom-4 right-4 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                Active
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <section ref={sectionRef} className="relative bg-[#f8f9fe] h-[140vh]">
                <div className="max-w-6xl mx-auto px-6 pt-24 py-4 text-center">
                    <h1 className="text-3xl font-bold text-[#9673d2]">
                        How VisitSecure. works
                    </h1>
                </div>

                <div className="sticky top-24 lg:min-h-[50vh] min-h-[20vh] flex items-center overflow-hidden">
                    <div
                        ref={trackRef}
                        className="flex gap-8 px-20"
                        style={{ transform: `translateX(-${x}px)` }}
                    >
                        <Card title="Visitor Request" text="The visitor submits a visit request with basic details, purpose, and host code." number="1" image="1.png" className="text-[#aec7ff]" />
                        <Card title="Selfie Verification" text="A live selfie is captured to verify identity and prevent unauthorized access." number="2" image="2.png" className="text-[#d0ceee]" />
                        <Card title="Email Approval" text="The host receives an email alert and approves or declines the request in seconds." number="3" image="3.png" className="text-[#aedfcb]" />
                        <Card title="Visitor Pass Created" text="After approval, a secure digital visitor pass is instantly generated." number="4" image="4.png" className="text-[#fd949c]" />
                        <Card title="Auto Deactivation" text="The visitor pass remains active for a limited time and expires automatically." number="5" image="5.png" className="text-[#f0cfde]" />
                    </div>
                </div>
            </section>
        </div>
    );
}