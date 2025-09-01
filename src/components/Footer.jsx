import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <div className="px-8 py-1 font-arial mt-10">
      <div className="flex justify-between items-center ">
        <ul className="flex justify-center gap-8 text-sm text-[#000000] font-bold ">
          <li className="tracking-widest">HOME</li>
          <li className="tracking-widest">THE STUDIO</li>
          <li className="tracking-widest">THE METHOD</li>
          <li className="tracking-widest">PRICING</li>
          <li className="tracking-widest">SCHEDULE</li>
          <li className="tracking-widest">ACCOUNT</li>
        </ul>
        <div className="flex items-center gap-2">
          <Image src="/whatsapp-icon.png" alt="phone" width={24} height={24} />
          <span className="tracking-widest text-[#000000] font-bold">
            CONTACT
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 py-4">
        <p className="text-black tracking-widest ">
          STARLETTE.TLV@GMAIL.COM
        </p>
        <p className="text-[#000000] tracking-widest font-semibold italic">
          © Starlette. All Rights Reserved. Licensing.
        </p>
      </div>
    </div>
  );
};

export default Footer;
