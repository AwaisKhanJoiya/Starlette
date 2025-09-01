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
    <div className="aspect-video  overflow-hidden bg-black relative">
      <video
        ref={videoRef}
        src={VIDEO_URL}
        poster={POSTER}
        className="w-full h-full object-cover"
        controls
        playsInline
        preload="metadata"
        style={{ position: "relative", zIndex: 10 }}
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
          <Image
            src={POSTER}
            alt="video poster"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
            style={{ userSelect: "none" }}
            width={100}
            height={100}
          />

          <div className="absolute inset-0 bg-black/30" />

          <button
            onClick={(ev) => {
              ev.stopPropagation();
              startPlayback();
            }}
            className="relative z-30 flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur transition hover:bg-white/30"
            aria-label="Play"
          >
            <Play size={36} className="ml-1" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BannerVideo;
