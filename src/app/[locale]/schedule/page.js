import FitnessBookingCalendar from "@/components/FitnessBookingCalendar";
import React from "react";
import { useTranslations } from "next-intl";

const SchedulePage = () => {
  const t = useTranslations("schedule");

  return (
    <>
      <div className="min-h-screen bg-background text-dark-gray px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 tracking-wider">
            {t("title")}
          </h1>
        </div>

        {/* Calendar */}
        <div className="mb-8">
          <FitnessBookingCalendar />
        </div>
      </div>
    </>
  );
};

export default SchedulePage;
