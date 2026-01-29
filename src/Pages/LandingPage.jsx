import Navbar from "./Navbar";
import { useEffect, useState, useRef } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import AnimatedText from "../components/animatedtext";
import Card1 from "../components/Card1";
import { useNavigate } from "react-router-dom";
import Card2 from "../components/Card2";

export default function LandingPage() {
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [x, setX] = useState(0);
    const howItWorksRef = useRef(null);
    const useCasesRef = useRef(null);
    const trackRef = useRef(null);
    let delay = 0;
    const [startSecurityAnim, setStartSecurityAnim] = useState(false);
    const securityRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStartSecurityAnim(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );

        if (securityRef.current) {
            observer.observe(securityRef.current);
        }

        return () => observer.disconnect();
    }, []);


    const next = (text) => {
        const current = delay;
        delay += text.length * 0.01 + 0.4;
        return current;
    }

    const items = [
        {
            title: "Identity Verification",
            text: "Live selfie verification confirms real visitor identity.",
            color: "#ffc4ff9f",
            textcolor: "#763a76ff"
        },
        {
            title: "Host-Approved Access",
            text: "Visitors enter only after host approval.",
            color: "#e2eafc9f",
            textcolor: "#3c5285ff",
        },
        {
            title: "Time-Bound Passes",
            text: "QR passes expire automatically after the visit.",
            color: "#bdd2999f",
            textcolor: "#4d7a00ff",
        },
        {
            title: "Audit Logs",
            text: "Every entry is logged in real time.",
            color: "#baa8d69f",
            textcolor: "#482d73ff",
        },
    ];

    const taglines = [
        "Smarter visits. Safer spaces.",
        "Security that starts before the gate.",
        "Access granted — the smart way.",
        "Trust & Security at Every Step.",
    ];

    const useCases = [
        {
            title: "Corporate Offices",
            icon: "🏢",
            points: [
                "No unauthorized walk-ins",
                "Verified visitors only",
                "Instant host approvals",
                "Complete visit audit trail",
            ],
            align: "right",
            shadow: "rgba(59,130,246,0.22)",
        },
        {
            title: "Educational Campuses",
            icon: "🎓",
            points: [
                "Secure parent & guest entry",
                "Time-bound digital passes",
                "Live visitor monitoring",
                "No manual registers",
            ],
            align: "left",
            shadow: "rgba(150,115,210,0.25)",
        },
        {
            title: "Hospitals & Clinics",
            icon: "🏥",
            points: [
                "Controlled visitor flow",
                "Reduced crowding",
                "Identity-verified entry",
                "Faster emergency access",
            ],
            align: "right",
            shadow: "rgba(34,197,94,0.22)",
        },
        {
            title: "Gated Communities",
            icon: "🏘️",
            points: [
                "Resident-approved visits",
                "Entry & exit monitored",
                "Auto-expiring passes",
                "Zero paper logs",
            ],
            align: "left",
            shadow: "rgba(245, 11, 218, 0.22)",
        },
    ];

    useEffect(() => {
        const onScroll = () => {
            const section = useCasesRef.current;
            if (!section) return;

            const rect = section.getBoundingClientRect();
            const totalScroll = rect.height - window.innerHeight;

            if (totalScroll <= 0) return;

            const scrolled = Math.min(
                Math.max(-rect.top, 0),
                totalScroll
            );

            const segment = totalScroll / useCases.length;
            const index = Math.floor(scrolled / segment);

            setActiveIndex(
                Math.min(index, useCases.length - 1)
            );
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

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
            const section = howItWorksRef.current;
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
        <div className=" min-h-screen font-[Nunito]">
            <Navbar
                mode="scroll"
                onLoginClick={() => setShowLogin(true)}
                onSignupClick={() => setShowSignup(true)}
            />
            {showLogin && (
                <Login onClose={() => setShowLogin(false)} />
            )}
            {showSignup && (
                <Signup onClose={() => setShowSignup(false)} />
            )}
            <section className="pt-20 bg-[linear-gradient(120deg,#738fbd,#d2b3db,#dbd6df,#db88a4,#cc8eb1)] animate-gradient">
                <div className="max-w-6xl mx-auto px-6 mt-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className={`transition-all  duration-900 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} `}>
                            <h1 className={`text-3xl lg:text-4xl leading-tight font-[Merriweather]`}>
                                <AnimatedText text="Welcome to VisitSecure." />
                            </h1>
                            <p className="text-md mt-4" key={index}>
                                <AnimatedText text={taglines[index]} />
                            </p>
                            <button className="bg-white/80 mt-8 text-[#9673d2] px-5 py-3 rounded-full hover:bg-[#9673d2] hover:text-white transition font-semibold border hover:translate-y-[-2px]" onClick={() => navigate("/pass")}>Request a visit</button>
                        </div>
                        <div className={`flex justify-center md:justify-end transition-all ease-out delay-300 duration-900 ${loaded ? "opacity-100 translate-y-4" : "opacity-0 translate-y-0"}`}>
                            <div className="w-[350px] h-[400px] rounded-4xl bg-white/50 shadow-xl p-6 relative mb-20">
                                <h3 className="text-lg font-[Merriweather] flex justify-center mb-4">Visitor card</h3>
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
            </section>
            <section id="howItWorks" ref={howItWorksRef} className="relative bg-[#f8f9fe] h-[140vh]">
                <div className="max-w-6xl mx-auto px-6 pt-24 py-6 text-center">
                    <h1 className="text-3xl font-[Merriweather]">
                        How VisitSecure. works
                    </h1>
                </div>

                <div className="sticky top-24 lg:min-h-[50vh] min-h-[20vh] flex items-center overflow-hidden">
                    <div
                        ref={trackRef}
                        className="flex gap-8 px-20"
                        style={{ transform: `translateX(-${x}px)` }}
                    >
                        <Card1 title="Visitor Request" text="The visitor submits a visit request with basic details, purpose, and host code." number="1" image="1.png" className="text-[#aec7ff]" />
                        <Card1 title="Selfie Verification" text="A live selfie is captured to verify identity and prevent unauthorized access." number="2" image="2.png" className="text-[#d0ceee]" />
                        <Card1 title="Email Approval" text="The host receives an email alert and approves or declines the request in seconds." number="3" image="3.png" className="text-[#aedfcb]" />
                        <Card1 title="Visitor Pass Created" text="After approval, a secure digital visitor pass is instantly generated." number="4" image="4.png" className="text-[#fd949c]" />
                        <Card1 title="Auto Deactivation" text="The visitor pass remains active for a limited time and expires automatically." number="5" image="5.png" className="text-[#f0cfde]" />
                    </div>
                </div>
            </section>
            <section id="security" className="min-h-screen bg-white p-10 grid-bg" ref={securityRef}>
                <div className="font-[Merriweather]">
                    <h1 className="text-5xl">
                        Security isn’t an add-on. <br /> It’s the foundation.
                    </h1>
                    <p className="my-4">VisitSecure is built with multi-layered verification and time-bound access to keep your premises safe—without slowing anyone down.</p>
                </div>
                {startSecurityAnim && (
                    <div className="mt-20 p-3 grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-2 lg:gap-y-16 ">
                        {items.map((item, i) => (
                            <div key={i} style={{ backgroundColor: item.color }} className="rounded-xl p-6" >
                                <h3 className="text-xl font-semibold">
                                    <AnimatedText
                                        text={item.title}
                                        delay={next(item.title)}
                                    />
                                </h3>
                                <p style={{ color: item.textcolor }} className="mt-2">
                                    <AnimatedText
                                        text={item.text}
                                        delay={next(item.text)}
                                    />
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
            <section id="useCases" ref={useCasesRef} className="min-h-[300vh] pb-20">
                <div className="sticky top-20 max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <p className="font-[Merriweather] text-3xl pt-10">
                            Who Uses VisitSecure?
                        </p>
                        <p className="text-md text-gray-600">
                            One platform. Total visitor control.
                        </p>
                    </div>

                    <div className="space-y-16">
                        {useCases.map((item, i) => (
                            <Card2
                                key={i}
                                {...item}
                                visible={i === activeIndex}
                            />
                        ))}
                    </div>
                </div>
            </section>
            <footer className="relative bg-white pt-24 overflow-hidden h-[500px]">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 relative z-10">
                    <div>
                        <p className="text-xs tracking-widest text-gray-400 mb-4">
                            SECTIONS
                        </p>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li><a className="hover:text-[#ccaae6]" href="#howItWorks">How it Works</a></li>
                            <li><a className="hover:text-[#ccaae6]" href="#security">Security</a></li>
                            <li><a className="hover:text-[#ccaae6]" href="#useCases">Use Cases</a></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-xs tracking-widest text-gray-400 mb-4">
                            COMMUNITY
                        </p>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>LinkedIn</li>
                            <li>X (Twitter)</li>
                            <li>Blog</li>
                            <li>Contact</li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-xs tracking-widest text-gray-400 mb-4">
                            RESOURCES
                        </p>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>Docs</li>
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto px-6 mt-16 relative z-10">
                    <p className="text-center text-sm text-gray-400 mt-6">
                        © {new Date().getFullYear()} VisitSecure. All rights reserved.
                    </p>
                </div>
                <div
                    className="absolute bottom-[-60px] left-1/2 -translate-x-1/2
             text-[10rem] font-[Inter] font-extrabold
             tracking-[0.04em]
             text-transparent
             pointer-events-none select-none"
                    style={{
                        WebkitTextStroke: "1.25px rgba(150, 115, 210, 0.25)",
                    }}
                >
                    VISITSECURE.
                </div>
            </footer>
        </div>
    );
}