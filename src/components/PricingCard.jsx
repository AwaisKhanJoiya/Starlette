// components/PricingCard.jsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
// Adjust this Button import to match your project path
import { Button } from "@/components/ui/button";

const PricingCard = React.memo(function PricingCard({ data = {} }) {
  const router = useRouter();
  const {
    slug = "",
    price = "",
    headline = "",
    gift = "",
    buttonLabel = "BOOK",
    star = "★",
    onClick = null,
  } = data;

  const handleClick = () => {
    if (typeof onClick === "function") {
      onClick();
      return;
    }
    // default behaviour: navigate to '/'
    router.push("/");
  };

  return (
    <div className="relative">
      <div className="bg-white border-2 text-black border-black rounded-xl py-8 px-4 w-56 md:w-60 text-center shadow-sm">
        {slug && (
          <div className="text-xs md:text-sm mb-2 font-bold text-primary">
            {slug}
          </div>
        )}

        <div className="text-4xl md:text-5xl font-bold mb-2">{price}</div>
        <div className="text-2xl md:text-3xl font-bold mb-2">{star}</div>
        {headline && (
          <div className="text-lg md:text-xl trea font-semibold mb-2 tracking-wider">
            {headline}
          </div>
        )}
        {gift && <div className="text-xs md:text-sm mb-6">{gift}</div>}
      </div>

      <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
        <Button
          onClick={handleClick}
          className="bg-secondary border border-black text-black py-2 px-6 rounded shadow-md"
          aria-label={buttonLabel}
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
});

export default PricingCard;
// "use client";

// import React from "react";
// import Image from "next/image";
// import { useTranslations } from "next-intl";
// // Adjust this Button import to match your project (shadcn/ui or custom).
// import { Button } from "@/components/ui/button";
// import FitnessBookingCalendar from "@/components/FitnessBookingCalendar";
// import DownloadApp from "@/components/DownloadApp";

// export default function PricingCard() {
//   const t = useTranslations("packages");

//   return (
//     <section>
//       <div className="px-4 lg:px-8 md:flex hidden flex-col md:flex-row justify-between items-end mb-8 pt-12 ">
//         <div className="flex-1 ">
//           <div className="space-y-4">
//             <div className="h-[2px] mr-4 bg-black"></div>
//             <div className="h-[2px] bg-black"></div>
//           </div>
//         </div>

//         <div>
//           <Image
//             src="/welcome-pack.jpg"
//             alt="globe"
//             width={130}
//             height={130}
//             className="object-contain"
//           />
//         </div>
//       </div>

//       <div className="relative pt-6 pb-8">
//         <div
//           className="absolute inset-0"
//           style={{
//             backgroundImage: 'url("/light-logo.jpg")',
//             backgroundRepeat: "repeat",
//             backgroundSize: "60px 60px",
//           }}
//         ></div>

//         <div className="relative z-10 flex flex-col md:flex-row justify-center items-center gap-8">
//           <div className="relative">
//             <div className="bg-white border-2 text-black border-black rounded-xl py-8 px-4 w-56 md:w-60 text-center shadow-sm">
//               <div className="text-4xl md:text-5xl font-bold mb-2">
//                 {t("oneClassPrice")}
//               </div>
//               <div className="text-2xl md:text-3xl font-bold mb-2">★</div>
//               <div className="text-lg md:text-xl trea font-semibold mb-2 tracking-wider">
//                 {t("oneClassText")}
//               </div>
//               <div className="text-xs md:text-sm mb-6">{t("gift")}</div>
//             </div>
//             <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
//               <Button className="bg-secondary border border-black text-black py-2 px-6 rounded shadow-md">
//                 {t("book")}
//               </Button>
//             </div>
//           </div>

//           <div className="relative">
//             <div className="bg-white border-2 text-black border-black rounded-xl py-8 px-4 w-56 md:w-60 text-center shadow-sm">
//               <div className="text-4xl md:text-5xl font-bold mb-2">
//                 {t("threeClassPrice")}
//               </div>
//               <div className="text-2xl md:text-3xl font-bold mb-2">★</div>
//               <div className="text-lg md:text-xl trea font-semibold mb-2 tracking-wider">
//                 {t("threeClassText")}
//               </div>
//               <div className="text-xs md:text-sm mb-6">{t("gift")}</div>
//             </div>
//             <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
//               <Button className="bg-secondary border border-black text-black py-2 px-6 rounded shadow-md">
//                 {t("book")}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="relative z-10 mt-6 text-xs md:text-sm text-black px-4 sm:px-6 lg:px-8">
//         <div className="mb-1 flex items-start">
//           <span className="text-black font-bold mr-2">★</span>
//           <span>{t("bullets.one")}</span>
//         </div>
//         <div className="mb-1 flex items-start">
//           <span className="text-black font-bold mr-2">★</span>
//           <span>{t("bullets.two")}</span>
//         </div>
//         <div className="flex items-start">
//           <span className="text-black font-bold mr-2">★</span>
//           <span>{t("bullets.three")}</span>
//         </div>
//       </div>

//       <div className="px-4 sm:px-6 lg:px-8 pt-12">
//         <FitnessBookingCalendar />
//       </div>

//       <div className="px-4 sm:px-6 lg:px-8 pt-12 pb-10">
//         <DownloadApp />
//       </div>
//     </section>
//   );
// }
