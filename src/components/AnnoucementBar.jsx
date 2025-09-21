"use client";

import React, { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

const AnnoucementBar = () => {
  const t = useTranslations("announcement");
  const scrollingText = t("scrolling_text");
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const updateAnimation = () => {
      const contentWidth = contentRef.current.offsetWidth;
      const containerWidth = containerRef.current.offsetWidth;

      const duration = contentWidth / 50; // Adjust the divisor to control speed

      containerRef.current.style.setProperty("--duration", `${duration}s`);
    };

    updateAnimation();

    window.addEventListener("resize", updateAnimation);
    return () => window.removeEventListener("resize", updateAnimation);
  }, [scrollingText]);

  return (
    <div className="bg-primary w-full py-2 overflow-hidden open-sans">
      <div ref={containerRef} className="marquee-container">
        <div ref={contentRef} className="marquee-content">
          <span className="text-light-gray font-medium tracking-wider me-2">
            {scrollingText}
          </span>
          <span className="text-light-gray font-medium tracking-wider me-2">
            {scrollingText}
          </span>
          <span className="text-light-gray font-medium tracking-wider me-2">
            {scrollingText}
          </span>
          <span className="text-light-gray font-medium tracking-wider me-2">
            {scrollingText}
          </span>
          <span className="text-light-gray font-medium tracking-wider me-2">
            {scrollingText}
          </span>
        </div>
        <div className="marquee-content" aria-hidden="true">
          <span className="text-light-gray font-medium tracking-wider me-2">
            {scrollingText}
          </span>
          <span className="text-light-gray font-medium tracking-wider me-2">
            {scrollingText}
          </span>
          <span className="text-light-gray font-medium tracking-wider me-2">
            {scrollingText}
          </span>
          <span className="text-light-gray font-medium tracking-wider me-2">
            {scrollingText}
          </span>
          <span className="text-light-gray font-medium tracking-wider me-2">
            {scrollingText}
          </span>
        </div>
      </div>
      <style jsx>{`
        .marquee-container {
          display: flex;
          width: 100%;
          overflow: hidden;
        }

        .marquee-content {
          display: flex;
          white-space: nowrap;
          animation: marquee var(--duration, 20s) linear infinite;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
};

export default AnnoucementBar;
