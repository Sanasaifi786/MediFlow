import { useState, useEffect } from "react";

const slides = [
  {
    title: "AI Patient Care",
    desc: "Empower your clinical staff with multi-agent intelligence that assists in diagnostics and fast decision making.",
    bg: "from-green-600 via-green-500 to-blue-500",
    icon: "🩺"
  },
  {
    title: "Resource Scheduling",
    desc: "Manage inventory levels in real-time, anticipate hospital supply needs, and prevent stock interruptions.",
    bg: "from-blue-500 via-blue-700 to-green-600",
    icon: "📦"
  },
  {
    title: "Seamless Insurance",
    desc: "Review past insurance claims, log medical events, and process patient medical billing efficiently.",
    bg: "from-green-500 via-blue-500 to-blue-700",
    icon: "💳"
  }
];

export default function Slideshow() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((s) => (s + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`w-full md:w-1/2 p-12 text-white bg-gradient-to-br ${slides[slide].bg} transition-all duration-700 ease-in-out flex flex-col justify-between relative overflow-hidden select-none h-full min-h-full flex-1 self-stretch`}
    >
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10 flex flex-col justify-between flex-1">
        <div>
          <span className="text-4xl bg-white/20 backdrop-blur-md p-3.5 rounded-2xl inline-block shadow-lg mb-6">
            {slides[slide].icon}
          </span>
          <h3 className="text-3xl font-bold font-outfit mb-3 tracking-wide leading-snug drop-shadow">
            {slides[slide].title}
          </h3>
          <p className="text-white/80 font-normal leading-relaxed text-sm">
            {slides[slide].desc}
          </p>
        </div>

        <div className="flex justify-between items-center mt-8">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  slide === i ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
          <span className="text-white/40 text-xs font-semibold uppercase tracking-widest">
            Feature {slide + 1} of {slides.length}
          </span>
        </div>
      </div>
    </div>
  );
}
