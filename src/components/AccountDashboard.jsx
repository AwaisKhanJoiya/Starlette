"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Plus, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import LoadingButton from "@/components/ui/LoadingButton";
import { useUserAuthContext } from "@/context/UserAuthContext";
import EditUserModal from "@/components/EditUserModal";
import { locales } from "@/i18n/navigation";

export default function AccountDashboard() {
  const {
    user: { user },
    getAuthToken,
    updateUser,
  } = useUserAuthContext();
  const t = useTranslations("account");
  const sections = [
    "myInformation",
    "myBookings",
    "myClassPack",
    "mySubscription",
    "classHistory",
  ];
  const [bookedClasses, setBookedClasses] = useState([]); // Array of enrolled classes
  const [loading, setLoading] = useState(false); // Loading state
  const [userLoading, setUserLoading] = useState(false); // User profile loading state
  const [open, setOpen] = useState(null); // Default open to "myBookings" section (index 1)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState(null);

  // Fetch user's enrolled classes
  const fetchEnrolledClasses = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch("/api/classes/enrolled", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Store the classes array directly
        setBookedClasses(data.classes || []);
      } else {
        console.error("Failed to fetch enrolled classes:", response.status);
      }
    } catch (error) {
      console.error("Error fetching enrolled classes:", error);
    } finally {
      setLoading(false);
    }
  }, [getAuthToken]);

  useEffect(() => {
    fetchEnrolledClasses();
  }, [fetchEnrolledClasses]);
  // const toggle = (index) => setOpen(open === index ? null : index);
  const toggle = useCallback((index) => {
    setOpen((prev) => (prev === index ? null : index));
  }, []);

  const Header = ({ label, index, isOpen, isLast }) => {
    const base = `w-full flex items-center hover:bg-primary hover:text-white justify-between gap-4 px-4 py-2 text-left border-t border-[#000000] transition focus:outline-none focus:ring-2 focus:ring-pink-300`;
    const selected = isOpen
      ? "bg-primary text-white"
      : "bg-transparent text-dark-gray";

    // if it's the last header and not open, we still want its bottom border visible
    const lastBorder = isLast ? "border-b" : "";

    return (
      <button
        onClick={() => toggle(index)}
        aria-expanded={isOpen}
        aria-controls={`acc-panel-${index}`}
        className={`${base} ${selected} ${lastBorder} `}
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
        // Now shows contact info from the user context
        return (
          <div className="py-6">
            {!user ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin h-6 w-6 border-2 border-solid border-primary border-r-transparent rounded-full mr-2"></div>
                <p>{t("loading")}</p>
              </div>
            ) : (
              <div className="space-y-2 font-arial">
                {/* Full name */}
                <div className="flex justify-between items-center">
                  <span className="uppercase tracking-wider">{user.name}</span>
                  <Edit
                    className="w-4 h-4 text-gray-600 cursor-pointer"
                    onClick={() => {
                      setFieldToEdit("name");
                      setIsEditModalOpen(true);
                    }}
                  />
                </div>

                {/* Phone number */}
                <div className="flex justify-between items-center">
                  <span>{user.phoneNumber || t("noPhoneProvided")}</span>
                  <Edit
                    className="w-4 h-4 text-gray-600 cursor-pointer"
                    onClick={() => {
                      setFieldToEdit("phoneNumber");
                      setIsEditModalOpen(true);
                    }}
                  />
                </div>

                {/* Birthday */}
                <div className="flex justify-between items-center">
                  <span className="tracking-wider">
                    {user.dateOfBirth
                      ? new Date(user.dateOfBirth).toLocaleDateString()
                      : t("noBirthdayProvided")}
                  </span>
                  <Edit
                    className="w-4 h-4 text-gray-600 cursor-pointer"
                    onClick={() => {
                      setFieldToEdit("dateOfBirth");
                      setIsEditModalOpen(true);
                    }}
                  />
                </div>

                {/* Email */}
                <div className="flex justify-between items-center">
                  <span className="uppercase tracking-wider">{user.email}</span>
                  <Edit
                    className="w-4 h-4 text-gray-600 cursor-pointer"
                    onClick={() => {
                      setFieldToEdit("email");
                      setIsEditModalOpen(true);
                    }}
                  />
                </div>

                {/* Edit Modal */}
                {isEditModalOpen && (
                  <EditUserModal
                    user={user}
                    fieldToEdit={fieldToEdit}
                    onClose={() => {
                      setIsEditModalOpen(false);
                      setFieldToEdit(null);
                    }}
                    onUpdate={(updatedUser) => {
                      if (updateUser) {
                        updateUser(updatedUser);
                      }
                    }}
                  />
                )}
              </div>
            )}
          </div>
        );

      case "myBookings":
        return (
          <div className="space-y-4">
            <div className="py-6">
              <h3 className="font-bold mb-3">{t("details.upcomingClasses")}</h3>

              {/* container with single top & bottom borders and single divider between rows */}
              <div className="border-t border-b border-[#000000] divide-y divide-[#000000] overflow-hidden">
                {loading ? (
                  <div className="py-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-solid border-primary border-r-transparent"></div>
                    <p className="mt-2 text-sm">{t("loading")}</p>
                  </div>
                ) : bookedClasses.length === 0 ? (
                  <div className="py-6 text-center capitalize text-gray-500">
                    {t("noBookedClasses")}
                  </div>
                ) : (
                  bookedClasses.map((classItem, i) => {
                    // Format the date nicely
                    const classDate = new Date(classItem.date);
                    const formattedDate = classDate.toLocaleDateString(
                      "default",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    );

                    return (
                      <div
                        key={classItem.id}
                        className="py-3 px-4 grid grid-cols-2 md:grid-cols-6 gap-3 items-center"
                      >
                        {/* Date */}
                        <div className="text-xs md:text-sm text-dark-gray font-bold">
                          {formattedDate}
                        </div>

                        {/* Time */}
                        <div className="text-xs md:text-sm text-dark-gray font-bold">
                          {classItem.time}
                        </div>

                        {/* Class name */}
                        <div className="text-xs md:text-sm text-dark-gray font-bold">
                          {classItem.title || classItem.type}
                        </div>

                        {/* Instructor */}
                        <div className="text-xs md:text-sm text-dark-gray font-bold">
                          {classItem.instructor}
                        </div>

                        {/* Slot / capacity */}
                        <div className="text-xs md:text-sm text-dark-gray">
                          {classItem.capacity}
                        </div>

                        {/* Action / status (right aligned) */}
                        <div className="flex justify-end">
                          {classItem.enrollmentStatus === "confirmed" ? (
                            <LoadingButton
                              text={t("buttons.modify")}
                              loadingText={t("loading")}
                              className="text-xs px-6 py-2 rounded-md font-medium"
                              variant="primary"
                            />
                          ) : (
                            <button className="text-xs px-6 py-2 rounded-md bg-custome-gray font-medium transition">
                              {t("status.waitingList")}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <p className="uppercase text-[10px] py-3 text-[#686867] font-arial">
                  {t.rich("bookingInfo", {
                    a: (chunks) => (
                      <a href="mailto: starlette.tlv@gmail.com">{chunks}</a>
                    ),
                    b: (chunks) => (
                      <span className="font-extrabold text-black">
                        {chunks}
                      </span>
                    ),
                    br: () => <br />,
                  })}
                </p>
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
                {/* <table className="w-full text-sm">
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
                    <tr className="border-t border-[#000000] font-semibold">
                      <td className="py-2">10 {t("table.classes")}</td>
                      <td>10/05/2025</td>
                      <td>10/06/2025</td>
                      <td>8</td>
                      <td>
                        <span className=" px-2 py-1 text-dark-gray  text-xs">
                          {t("status.active")}
                        </span>
                      </td>
                    </tr>
                    <tr className="border-y border-[#000000] font-semibold">
                      <td className="py-2">{t("details.welcomePack")}</td>
                      <td>10/03/2024</td>
                      <td>10/05/2025</td>
                      <td>0</td>
                      <td>
                        <span className="text-[#FABDCE] italic font-medium px-2 py-1  text-xs">
                          {t("status.expired")}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table> */}
              </div>

              <p className="uppercase text-[10px] py-3 text-[#686867] font-arial">
                {t.rich("classpackInfo", {
                  a: (chunks) => (
                    <a
                      href="/pricing"
                      className="text-primary font-bold underline"
                    >
                      {chunks}
                    </a>
                  ),
                  b: (chunks) => (
                    <span className="font-extrabold text-black">{chunks}</span>
                  ),
                  br: () => <br />,
                })}
              </p>
            </div>
          </div>
        );

      case "classHistory":
        return (
          <div className="space-y-4">
            <div className="py-6">
              <h3 className="font-semibold mb-3">{t("details.pastClasses")}</h3>

              {/* single top & bottom border with single dividers between rows */}
              {/* <div className="border-t border-b border-[#000000] divide-y divide-[#000000]  overflow-hidden">
                {[
                  ["31/05/2025", "08:00", "FULL BODY", "Dana", "present"],
                  ["06/05/2025", "10:00", "FULL BODY", "Dana", "present"],
                  ["22/05/2025", "08:00", "FULL BODY", "Dana", "missed"],
                ].map((r, i) => {
                  const statusKey = r[4]; 
                  const badgeClass =
                    statusKey === "missed"
                      ? " text-[#FABDCE] italic font-semibold"
                      : " text-dark-gray";

                  return (
                    <div
                      key={i}
                      className="py-3 px-4 grid grid-cols-2 text-black font-semibold md:grid-cols-6 gap-3 items-center hover:bg-gray-50 transition"
                    >
                      <div className="text-xs md:text-sm ">{r[0]}</div>

                      <div className="text-xs md:text-sm ">{r[1]}</div>

                      <div className="text-xs md:text-sm ">{r[2]}</div>

                      <div className="text-xs md:text-sm ">{r[3]}</div>

                      <div className="text-xs md:text-sm ">
                      </div>

                      <div className="flex justify-end">
                        <span className={`text-xs px-2 py-1  ${badgeClass}`}>
                          {t(`status.${statusKey}`)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div> */}
            </div>
          </div>
        );

      case "mySubscription":
        // subscription summary (was originally myInformation)
        return (
          <div className="space-y-4 font-arial">
            <div className="py-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex justify-center items-center gap-2">
                  <div>
                    <Image
                      src="/star.png"
                      alt="starlette"
                      width={40}
                      height={40}
                      className="relative z-10"
                    />
                  </div>
                  <div>
                    <h2 className="mb-1 text-lg font-extrabold text-[#FABDCE] [text-stroke:0.2px_#545454] [-webkit-text-stroke:0.2px_#545454]">
                      "A SUPERSTAR—LETTE"
                    </h2>

                    <div className="divide-y divide-[#000000] ">
                      <div className="flex items-center gap-2 pb-2">
                        <div className="text-sm   font-bold  ">
                          {t("details.subscriptionInfo")}
                        </div>
                        <div className="text-[10px] font-semibold italic text-[#787C7C]">
                          {t("details.remaining")}
                        </div>
                      </div>
                      <div className="text-[10px] font-semibold pt-2 italic text-[#787C7C]">
                        {t("details.classesPerWeek")}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <LoadingButton
                    text={t("buttons.modify")}
                    loadingText={t("loading")}
                    className="text-black text-xs px-10 py-1 rounded-md font-medium sm:w-40 w-auto"
                    variant="primary"
                  />
                  <LoadingButton
                    text={t("buttons.cancellation")}
                    loadingText={t("processing")}
                    className="text-black text-xs px-10 py-1 rounded-md font-medium sm:w-40 w-auto"
                    variant="primary"
                  />
                </div>
              </div>
            </div>

            <p className="uppercase text-[10px] text-[#686867] font-arial">
              {t.rich("details.subscriptionPolicy", {
                b: (chunks) => (
                  <span className="font-extrabold text-black">{chunks}</span>
                ),
                br: () => <br />,
              })}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold tracking-wider mb-4 text-dark-gray">
        {user ? `${t("welcome")} ${user.name?.toUpperCase()}` : t("title")}
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
