"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const icons = [
  "/icons/flamme.png",
  "/icons/dos.png",
  "/icons/ventre.png",
  "/icons/etoiles.png",
  "/icons/soleil.png",
  "/icons/fille.png",
  "/icons/timer.png",
  "/icons/pied.png",
  "/icons/tornade.png",
  "/icons/roue.png",
];

const FitnessBenefits = () => {
  const t = useTranslations("benefits");
  const benefits = t.raw("benefits");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-6">
      {benefits.map((benefit, index) => {
        const Icon = icons[index];
        return (
          <div
            key={index}
            className="group relative p-2 text-dark-gray rounded-3xl border-4 border-dashed border-[#464646] flex flex-col"
          >
            <div className="flex items-center gap-2">
              {/* <Icon className="w-8 h-8" /> */}
              <Image
                src={Icon}
                width={45}
                height={45}
                className="object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-bold tracking-widest border-b-2 border-dashed border-light-gray w-full mb-1">
                  {benefit.title}
                </p>
                <p className="text-xs mb-0 whitespace-pre-line flex items-center h-full">
                  {benefit.subtitle}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FitnessBenefits;
