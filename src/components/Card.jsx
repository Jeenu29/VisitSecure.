import { useEffect, useRef, useState } from "react";
export default function Card({ title, text, number, image, className }) {
    const cardRef = useRef(null);
    const [style, setStyle] = useState({});

    useEffect(() => {
        const handleScroll = () => {
            if (!cardRef.current) return;

            const rect = cardRef.current.getBoundingClientRect();
            const windowCenter = window.innerWidth / 2;
            const cardCenter = rect.left + rect.width / 2;

            const distance = Math.abs(windowCenter - cardCenter);

            // Normalize distance (0 → 1)
            const maxDistance = window.innerWidth / 2;
            const percent = Math.min(distance / maxDistance, 1);
            // Scale & opacity
            const scale = 1 - percent * 0.08;
            const opacity = 1 - percent * 0.3;

            setStyle({
                transform: `scale(${scale})`,
                opacity,
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
        <div ref={cardRef} style={style} className={`h-[400px] w-[300px] transition-transform duration-300 ease-out shrink-0 relative rounded-t-2xl p-6 mx-6 my-2 bg-white/50 border shadow-lg ${className}`}>
            <span className="absolute left-6 top-6 h-[30px] w-[30px] rounded-full bg-white flex items-center justify-center border text-sm font-semibold">{number}</span>
            <div className="mt-14 space-y-2">
                <h3 className="text-xl font-bold uppercase">{title}</h3>
                <p className="text-sm text-gray-700">
                    {text}
                </p>
            </div>
            <img src={image} alt={title} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full object-contain"
            />
        </div>
    );
}
