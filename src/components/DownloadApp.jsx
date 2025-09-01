import React from "react";
import Image from "next/image";
import { InstagramIcon } from "lucide-react";

const DownloadApp = () => {
  return (
    <div className="flex align-items-center  justify-between md:gap-10 gap-0  ">
      <div className="flex flex-1 justify-center relative">
        {/* Circle background */}
        <div className="absolute w-96 h-96 bg-primary rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

        {/* Image on top */}
        <Image
          src="/download-app.jpg"
          alt="starlette"
          width={200}
          height={100}
          className="relative z-10"
        />
      </div>

      <div className="flex flex-col  flex-1">
        <h1 className="text-2xl font-bold mb-4 tracking-wider text-right">
          OUR APP TO DOWNLOAD
        </h1>

        <div className=" leading-relaxed font-arial text-right">
          <p className="text-sm tracking-wider ">
            BOOK YOUR CLASSES, DISCOVER OUR EXCLUSIVE OFFERS,
            <br /> AND EXPERIENCE
            <span className="font-semibold">STARLETTE</span>
            WHEREVER YOU ARE.
          </p>
          <div className="flex justify-end gap-4 mt-6">
            <Image
              src="/google-app.jpg"
              alt="starlette"
              width={250}
              height={250}
            />
          </div>
          <p className="font-medium tracking-wider my-2 text-lg ">
            FIND US ON INSTAGRAM & TIKTOK
          </p>
          <div className="flex justify-end gap-4 mt-2">
            <InstagramIcon color="black" size={30} />
            <Image src="/tiktok.png" alt="starlette" width={30} height={30} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadApp;
