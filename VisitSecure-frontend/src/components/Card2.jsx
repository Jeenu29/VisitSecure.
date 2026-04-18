export default function Card2({ title, points, icon, align = "right", visible, shadow }) {
    return (
        <div
            className={`
        transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${visible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-12 scale-95 blur-xs"}
        flex ${align === "right" ? "justify-end" : "justify-start"}
    `}
        >
            <div
                style={{
                    boxShadow: visible
                        ? `0 30px 80px ${shadow}`
                        : "0 10px 30px rgba(0,0,0,0.08)",
                }}
                className="
            w-full max-w-2xl
            p-8 md:p-10
            border border-white/40
            hover:scale-[1.02] transition
            bg-white/80 backdrop-blur-xl
            border border-white/60
            shadow-[0_30px_80px_rgba(0,0,0,0.12)]
            rounded-3xl"
            >
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#9673d2]/15 flex items-center justify-center text-2xl">
                        {icon}
                    </div>

                    <h3 className="text-lg md:text-3xl font-[Merriweather] text-gray-900">
                        {title}
                    </h3>
                </div>
                <ul className="space-y-4 text-sm text-gray-700 leading-relaxed">
                    {points.map((point, i) => (
                        <li key={i} className="flex gap-2">
                            <span className="text-[#9673d2] font-bold">•</span>
                            {point}
                        </li>
                    ))}
                </ul>
            </div>
        </div >
    );
}