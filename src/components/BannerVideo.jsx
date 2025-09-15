import { useState, useRef } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";

const BannerVideo = () => {
  const videoRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

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
          className="object-cover w-full"
          controls={false}
          autoPlay={true}
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
          <h1 className="font-shrikhand text-4xl md:text-5xl text-primary m-0">
            <span className="outlined-text">A </span>
            <span className="text-8xl">Starlette</span>{" "}
            <span className="outlined-text">is Born</span>
          </h1>
          <p className="text-primary uppercase text-md letter-spacing-2 tracking-widest m-0">
            Where elegance meets strength – the Lagree experience in Tel Aviv
          </p>
        </div>

        <div
          onClick={() => setIsMuted(!isMuted)}
          className="absolute bg-slate-600 rounded-full p-2 bottom-5 right-5"
        >
          {isMuted ? <VolumeX /> : <Volume2 />}
        </div>

        {/* {!hasStarted && (
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
              fill
              className="object-cover"
              draggable={false}
              style={{ userSelect: "none" }}
            />

            <div className="absolute inset-0 bg-black/40" />

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
        )} */}
      </div>
    </div>
  );
};

export default BannerVideo;
