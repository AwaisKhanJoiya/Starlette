"use client";

import React from "react";
import {
  Flame,
  User,
  Dumbbell,
  Star,
  Zap,
  Users,
  Clock,
  Activity,
  Target,
  RotateCcw,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const icons = [
  "/icons/fire.png",
  "/icons/posture.png",
  "/icons/diet.png",
  "/icons/star.png",
  "/icons/sun.png",
  "/icons/yoga-pose.png",
  "/icons/stopwatch.png",
  "/icons/foot.png",
  "/icons/tornado.png",
  "/icons/recycle.png",
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
            className="group relative p-2 text-dark-gray rounded-3xl border-4 border-dashed border-[#000] flex flex-col justify-center"
          >
            <div className="flex items-start gap-2">
              {/* <Icon className="w-8 h-8" /> */}
              <Image src={Icon} width={40} height={40} />
              <div className="flex-1">
                <p className="text-sm font-bold tracking-wider border-b-2 border-dashed border-light-gray w-full mb-1">
                  {benefit.title}
                </p>
                <p className="text-xs mb-0 whitespace-pre-line">
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
