export default function AnimatedText({ text, delay = 0, className }) {
    return (
        <span className="inline-block">
            {text.split("").map((char, index) => (
                <span
                    key={index}
                    className={`inline-block opacity-0 animate-letter ${className}`}
                    style={{
                        animationDelay: `${delay + index * 0.05}s`,
                    }}
                >
                    {char === " " ? "\u00A0" : char}
                </span>
            ))}
        </span>
    );
}
