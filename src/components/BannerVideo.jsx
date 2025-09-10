import { useState, useRef } from "react";
import { Play } from "lucide-react";
import Image from "next/image";

const BannerVideo = () => {
  const videoRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  const POSTER = "/home.jpg";
  const VIDEO_URL = "/banner-video.mp4";

  const startPlayback = async () => {
    if (!videoRef.current) return;
    try {
      const playPromise = videoRef.current.play();
      if (playPromise instanceof Promise) {
        await playPromise;
      }
    } catch (err) {
      console.warn("video.play() rejected:", err);
    } finally {
      setHasStarted(true);
    }
  };

  return (
    <div className="relative w-full mx-auto">
      <div className="relative w-full aspect-video overflow-hidden bg-black max-h-screen">
        <video
          ref={videoRef}
          src={VIDEO_URL}
          poster={POSTER}
          className="object-cover"
          controls
          playsInline
          preload="metadata"
        />

        {!hasStarted && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              startPlayback();
            }}
            role="button"
            aria-label="Play video"
          >
            {/* Poster Image */}
            <Image
              src={POSTER}
              alt="video poster"
              fill
              className="object-cover"
              draggable={false}
              style={{ userSelect: "none" }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Play button */}
            <button
              onClick={(ev) => {
                ev.stopPropagation();
                startPlayback();
              }}
              className="relative z-30 flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#000000] opacity-70 backdrop-blur transition "
              aria-label="Play"
            >
              <Play size={32} className="ml-1 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerVideo;
