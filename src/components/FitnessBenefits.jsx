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

const icons = [
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
            className="group relative bg-white py-1 px-2 text-black rounded-2xl border-2 border-dashed border-[#000] flex flex-col justify-center"
          >
            <div className="flex items-center gap-1">
              <Icon className="w-4 h-4" />
              <div>
                <p className="text-[10px] font-bold tracking-wider">
                  {benefit.title}
                </p>
                <p className="text-[10px] mb-0 whitespace-pre-line">
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
