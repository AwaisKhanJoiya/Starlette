"use client";

import React, { useState } from "react";
import { Plus, Edit, Menu, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function AccountDashboard() {
  const t = useTranslations("account");
  const sections = [
    "myInformation",
    "myBookings",
    "myClassPack",
    "classHistory",
    "mySubscription",
  ];

  const [open, setOpen] = useState(null); // index of open section or null
  const toggle = (index) => setOpen(open === index ? null : index);

  // Header component — no bg by default; selected gets bg-primary + text-white
  const Header = ({ label, index, isOpen, isLast }) => {
    // base classes: full width, top border; last item also gets bottom border (applied where rendering)
    const base = `w-full flex items-center justify-between gap-4 px-4 py-2 text-left border-t border-[#000000] transition focus:outline-none focus:ring-2 focus:ring-pink-300`;
    const selected = isOpen
      ? "bg-primary text-white"
      : "bg-transparent text-black";

    // if it's the last header and not open, we still want its bottom border visible
    const lastBorder = isLast ? "border-b" : "";

    return (
      <button
        onClick={() => toggle(index)}
        aria-expanded={isOpen}
        aria-controls={`acc-panel-${index}`}
        className={`${base} ${selected} ${lastBorder}`}
      >
        <div>
          <div className="text-xs font-medium">{label}</div>
        </div>

        <div className="flex items-center ml-4">
          <Plus
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-45" : ""
            }`}
          />
        </div>
      </button>
    );
  };

  // Render details mapped as you requested (details reassigned to related headers)
  const renderDetail = (key) => {
    switch (key) {
      case "myInformation":
        // Now shows contact info (originally under myBookings)
        return (
          <div className="py-6">
            <div className="space-y-2 font-arial">
              <div className="flex justify-between items-center">
                <span className="uppercase tracking-wider">Dana Toledano</span>
                <Edit className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex justify-between items-center">
                <span className="">+33 7 45 35 30 50</span>
                <Edit className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex justify-between items-center">
                <span className="tracking-wider">01/02/1998</span>
                <Edit className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex justify-between items-center">
                <span className="uppercase tracking-wider">
                  danatoledano@hotmail.fr
                </span>
                <Edit className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        );

      case "myBookings":
        return (
          <div className="space-y-4">
            <div className="py-6">
              <h3 className="font-medium mb-3">
                {t("details.upcomingClasses")}
              </h3>

              {/* container with single top & bottom borders and single divider between rows */}
              <div className="border-t border-b border-[#000000] divide-y divide-[#000000]  overflow-hidden">
                {[
                  ["31/05/2025", "08:00", "FULL BODY", "Dana", "3/5"],
                  ["06/05/2025", "10:00", "FULL BODY", "Dana", "5/5"],
                  ["22/05/2025", "08:00", "FULL BODY", "Dana", "5/5"],
                ].map((row, i) => (
                  <div
                    key={i}
                    className="py-3 px-4 grid grid-cols-2 md:grid-cols-6 gap-3 items-center"
                  >
                    {/* Date */}
                    <div className="text-xs md:text-sm text-[#000000] font-medium">
                      {row[0]}
                    </div>

                    {/* Time */}
                    <div className="text-xs md:text-sm text-[#000000] font-medium">
                      {row[1]}
                    </div>

                    {/* Class name */}
                    <div className="text-xs md:text-sm text-[#000000] font-medium">
                      {row[2]}
                    </div>

                    {/* Instructor */}
                    <div className="text-xs md:text-sm text-[#000000] font-medium">
                      {row[3]}
                    </div>

                    {/* Slot / capacity */}
                    <div className="text-xs md:text-sm text-black">
                      {row[4]}
                    </div>

                    {/* Action / status (right aligned) */}
                    <div className="flex justify-end">
                      {i < 2 ? (
                        <button className="text-xs  px-6 py-1 rounded-md bg-primary font-medium transition">
                          {t("buttons.modify")}
                        </button>
                      ) : (
                        <button className="text-xs  px-6 py-1 rounded-md bg-custome-gray font-medium transition">
                          {t("status.waitingList")}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "myClassPack":
        // Now shows subscription table + notes (originally under mySubscription)
        return (
          <div className="space-y-4">
            <div className=" py-4 ">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-600  text-xs">
                      <th className="text-left py-2">{t("table.pack")}</th>
                      <th className="text-left py-2">
                        {t("table.purchaseDate")}
                      </th>
                      <th className="text-left py-2">
                        {t("table.validUntil")}
                      </th>
                      <th className="text-left py-2">{t("table.remaining")}</th>
                      <th className="text-left py-2">{t("table.status")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-[#000000] font-medium">
                      <td className="py-2">10 {t("table.classes")}</td>
                      <td>10/05/2025</td>
                      <td>10/06/2025</td>
                      <td>8</td>
                      <td>
                        <span className=" px-2 py-1 text-[#000000]  text-xs">
                          {t("status.active")}
                        </span>
                      </td>
                    </tr>
                    <tr className="border-y border-[#000000] font-medium ">
                      <td className="py-2">{t("details.welcomePack")}</td>
                      <td>10/03/2024</td>
                      <td>10/05/2025</td>
                      <td>0</td>
                      <td>
                        <span className="text-[#FABDCE] font-medium px-2 py-1  text-xs">
                          {t("status.expired")}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="text-xs text-gray-600 mt-4 space-y-1">
                <p className="font-medium">{t("details.happyJune")}</p>
                <p>{t("details.classPackNote")}</p>
              </div>
            </div>
          </div>
        );

      case "classHistory":
        return (
          <div className="space-y-4">
            <div className="py-6">
              <h3 className="font-medium mb-3">{t("details.pastClasses")}</h3>

              {/* single top & bottom border with single dividers between rows */}
              <div className="border-t border-b border-[#000000] divide-y divide-[#000000]  overflow-hidden">
                {[
                  ["31/05/2025", "08:00", "FULL BODY", "Dana", "present"],
                  ["06/05/2025", "10:00", "FULL BODY", "Dana", "present"],
                  ["22/05/2025", "08:00", "FULL BODY", "Dana", "missed"],
                ].map((r, i) => {
                  const statusKey = r[4]; // "present" | "missed"
                  const badgeClass =
                    statusKey === "missed"
                      ? " text-[#FABDCE]"
                      : " text-[#000000]";

                  return (
                    <div
                      key={i}
                      className="py-3 px-4 grid grid-cols-2 text-[#000] font-medium md:grid-cols-6 gap-3 items-center hover:bg-gray-50 transition"
                    >
                      {/* Date */}
                      <div className="text-xs md:text-sm ">{r[0]}</div>

                      {/* Time */}
                      <div className="text-xs md:text-sm ">{r[1]}</div>

                      {/* Class name */}
                      <div className="text-xs md:text-sm ">{r[2]}</div>

                      {/* Instructor */}
                      <div className="text-xs md:text-sm ">{r[3]}</div>

                      {/* (optional) other column if needed */}
                      <div className="text-xs md:text-sm ">
                        {/* reserved */}
                      </div>

                      {/* Status badge (right aligned) */}
                      <div className="flex justify-end">
                        <span className={`text-xs px-2 py-1  ${badgeClass}`}>
                          {t(`status.${statusKey}`)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case "mySubscription":
        // subscription summary (was originally myInformation)
        return (
          <div className="space-y-4 font-arial">
            <div className="py-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex  gap-2">
                  <div>
                    <Image
                      src="/star.jpg"
                      alt="starlette"
                      width={30}
                      height={30}
                      className="relative z-10"
                    />
                  </div>
                  <div>
                    <h2 className="text-base  text-[#FABDCE] font-extrabold">
                      "A SUPERSTAR-LETTE"
                    </h2>
                    <div className="divide-y divide-[#000000] ">
                      <div className="text-sm font-medium mb-2">
                        {t("details.subscriptionInfo")}
                      </div>
                      <div className="text-sm font-semibold text-gray-800 pt-2">
                        {t("details.classesPerWeek")}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs bg-primary text-black font-medium px-10 py-3 rounded-md">
                    {t("buttons.modify")}
                  </button>
                  <button className="text-xs bg-primary text-black font-medium px-10 py-3 rounded-md">
                    {t("buttons.cancellation")}
                  </button>
                </div>
              </div>
            </div>

            <div className="text-sm text-black">
              <p className="font-medium">
                {t("details.subscriptionModification")}
              </p>
              <p>{t("details.subscriptionText")}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold tracking-wider mb-4 text-black">
        {t("title")}
      </h1>

      <div className="space-y-0">
        {sections.map((sKey, idx) => {
          const isOpen = open === idx;
          const isLast = idx === sections.length - 1;

          return (
            <div key={sKey} className="bg-transparent">
              <Header
                label={t(`sections.${sKey}`)}
                index={idx}
                isOpen={isOpen}
                isLast={isLast}
              />

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`acc-panel-${idx}`}
                    key={`panel-${idx}`}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    className="px-4 pb-4"
                  >
                    <div className="mt-2">{renderDetail(sKey)}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
