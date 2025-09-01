import React from "react";

const AnnoucementBar = () => {
  const scrollingText =
    "SCULPTED - FEMININE - POWERFUL - SUPERSTAR - SCULPTED - ICONIC - FOCUSED - DIVINE - LIMITLESS - SHINING - CONTROLLED";

  return (
    <div className="bg-primary w-full py-2 overflow-hidden open-sans">
      <div className="whitespace-nowrap animate-scroll">
        <span className="text-black font-medium  tracking-wider mx-8">
          {scrollingText} - {scrollingText} - {scrollingText}
        </span>
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AnnoucementBar;
