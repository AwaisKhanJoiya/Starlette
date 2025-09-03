"use client";

import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";

const FitnessBookingCalendar = () => {
  const t = useTranslations("fitness");
  const locale = useLocale();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Generate dynamic class data based on date
  const generateClassesForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    const dayOfWeek = date.getDay();
    const seed = date.getDate() + date.getMonth() * 31;

    const schedules = {
      0: [
        {
          time: "08:00",
          duration: "50 min",
          type: "FULL BODY",
          instructor: "Dana",
          baseCapacity: 6,
        },
        {
          time: "09:00",
          duration: "50 min",
          type: "FULL BODY",
          instructor: "Dana",
          baseCapacity: 6,
        },
        {
          time: "10:00",
          duration: "55 min",
          type: "FULL BODY",
          instructor: "Dana",
          baseCapacity: 5,
        },
      ],
      1: [
        {
          time: "07:00",
          duration: "45 min",
          type: "CARDIO BLAST",
          instructor: "Mike",
          baseCapacity: 8,
        },
        {
          time: "12:00",
          duration: "50 min",
          type: "STRENGTH",
          instructor: "Alex",
          baseCapacity: 6,
        },
        {
          time: "18:00",
          duration: "60 min",
          type: "YOGA FLOW",
          instructor: "Sarah",
          baseCapacity: 10,
        },
      ],
      2: [
        {
          time: "06:30",
          duration: "45 min",
          type: "HIIT",
          instructor: "Alex",
          baseCapacity: 8,
        },
        {
          time: "09:30",
          duration: "50 min",
          type: "PILATES",
          instructor: "Emma",
          baseCapacity: 8,
        },
        {
          time: "17:00",
          duration: "50 min",
          type: "FULL BODY",
          instructor: "Dana",
          baseCapacity: 6,
        },
      ],
      3: [
        {
          time: "08:00",
          duration: "45 min",
          type: "BOXING",
          instructor: "Tom",
          baseCapacity: 8,
        },
        {
          time: "12:30",
          duration: "55 min",
          type: "CORE BLAST",
          instructor: "Mike",
          baseCapacity: 6,
        },
        {
          time: "19:00",
          duration: "60 min",
          type: "YOGA FLOW",
          instructor: "Sarah",
          baseCapacity: 10,
        },
      ],
      4: [
        {
          time: "07:30",
          duration: "50 min",
          type: "STRENGTH",
          instructor: "Alex",
          baseCapacity: 8,
        },
        {
          time: "18:30",
          duration: "45 min",
          type: "DANCE FIT",
          instructor: "Zoe",
          baseCapacity: 10,
        },
      ],
      5: [
        {
          time: "08:00",
          duration: "50 min",
          type: "FULL BODY",
          instructor: "Dana",
          baseCapacity: 6,
        },
        {
          time: "17:30",
          duration: "45 min",
          type: "HIIT",
          instructor: "Mike",
          baseCapacity: 8,
        },
      ],
      6: [
        {
          time: "09:00",
          duration: "60 min",
          type: "RECOVERY YOGA",
          instructor: "Sarah",
          baseCapacity: 8,
        },
        {
          time: "11:00",
          duration: "55 min",
          type: "FULL BODY",
          instructor: "Dana",
          baseCapacity: 6,
        },
      ],
    };

    const daySchedule = schedules[dayOfWeek] || [];

    return daySchedule.map((classTemplate, index) => {
      const randomFactor = (seed + index * 7) % 100;
      const occupancyRate = 0.3 + (randomFactor / 100) * 0.6; // 30% to 90% full
      const currentCapacity = Math.floor(
        classTemplate.baseCapacity * occupancyRate
      );

      return {
        id: `${dateStr}-${index}`,
        time: classTemplate.time,
        duration: classTemplate.duration,
        type: classTemplate.type,
        instructor: classTemplate.instructor,
        capacity: `${currentCapacity}/${classTemplate.baseCapacity}`,
        status:
          currentCapacity >= classTemplate.baseCapacity ? "full" : "available",
      };
    });
  };

  const [bookedClasses, setBookedClasses] = useState(new Set());

  const getWeekDates = (centerDate) => {
    const start = new Date(centerDate);
    const day = start.getDay();
    start.setDate(start.getDate() - day);
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const weekDates = getWeekDates(selectedDate);

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameDate = (date1, date2) => {
    return date1.toDateString() === date2.toDateString();
  };

  const formatDayName = (date, index) => {
    if (isToday(date)) return t("today");

    const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    return t(`days.${dayKeys[index]}`);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    setSelectedDate(newDate);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(new Date(date));
  };

  const handleCalendarClick = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDatePickerChange = (e) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
    setShowDatePicker(false);
  };

  const handleBookClass = (classId) => {
    if (!bookedClasses.has(classId)) {
      setBookedClasses((prev) => new Set([...prev, classId]));
    }
  };

  const getClassStatus = (classItem) => {
    if (bookedClasses.has(classItem.id)) return "booked";
    return classItem.status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-primary";
      case "full":
        return "bg-custome-gray cursor-not-allowed";
      case "booked":
        return "bg-green-100";
      default:
        return "bg-gray-100";
    }
  };

  const getStatusText = (status) => {
    return t(`status.${status}`);
  };

  const currentClasses = generateClassesForDate(selectedDate);

  const currentMonth = selectedDate
    .toLocaleDateString(locale || "en-US", { month: "long" })
    .toUpperCase();

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDatePicker && !event.target.closest(".date-picker-container")) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDatePicker]);

  return (
    <div>
      <div className="flex items-center justify-between py-3 sm:py-4 border-gray-100 text-black">
        <h1 className="text-lg sm:text-2xl font-medium tracking-wide truncate">
          {currentMonth}
        </h1>

        {/* Datepicker container: on small screens it expands full width below icon */}
        <div className="relative date-picker-container">
          <Calendar
            className="w-6 h-6 cursor-pointer hover:text-gray-800 transition-colors"
            onClick={handleCalendarClick}
            aria-label="Open date picker"
          />

          {showDatePicker && (
            <div className="absolute z-10 top-10 inset-x-4 sm:inset-auto sm:right-0  sm:left-auto w-auto sm:w-44 max-w-xs sm:max-w-none bg-white border border-gray-200 rounded-lg shadow-lg p-3 sm:p-4">
              <input
                type="date"
                value={selectedDate.toISOString().split("T")[0]}
                onChange={handleDatePickerChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          )}
        </div>
      </div>

      {/* Week Navigation with Chevrons */}
      <div className="py-4 sm:py-6 w-full">
        <div className="flex items-center gap-3 sm:gap-6 justify-center">
          <ChevronLeft
            className="w-14 h-14 md:w-10 md:h-10 text-custome-gray cursor-pointer hover:text-black transition-colors p-1"
            onClick={() => navigateWeek(-1)}
            aria-label="Previous week"
          />

          {/* Scrollable week days for small devices */}
          <div className="overflow-x-auto -mx-4 px-4 sm:overflow-visible sm:mx-0 sm:px-0 sm:flex sm:justify-center">
            <div className="flex gap-4 sm:gap-12 min-w-max">
              {weekDates.map((date, index) => {
                const todayIs = isToday(date);
                const selectedIs = isSameDate(date, selectedDate);
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center cursor-pointer group min-w-[56px] sm:min-w-[64px]"
                    onClick={() => handleDateSelect(date)}
                  >
                    <span className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2 group-hover:text-gray-700 transition-colors">
                      {formatDayName(date, index)}
                    </span>

                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-black flex items-center justify-center font-medium transition-all duration-200 ${
                        todayIs
                          ? "bg-primary shadow-sm"
                          : selectedIs
                          ? "bg-[#EBEAEA] shadow-sm"
                          : "hover:bg-[#EBEAEA]"
                      }`}
                    >
                      {date.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <ChevronRight
            className="w-14 h-14 md:w-10 md:h-10 text-custome-gray cursor-pointer hover:text-black transition-colors p-1"
            onClick={() => navigateWeek(1)}
            aria-label="Next week"
          />
        </div>
      </div>

      {/* Selected Date Display */}
      <div className="pb-3 sm:pb-4 border-b">
        <h2 className="font-bold text-sm sm:text-base">
          {selectedDate.toLocaleDateString(locale || "en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h2>
      </div>

      {/* Classes List */}
      <div>
        {currentClasses.length > 0 ? (
          currentClasses.map((classItem, index) => {
            const status = getClassStatus(classItem);
            const [current, total] = classItem.capacity.split("/").map(Number);
            const isNearlyFull = current >= total - 1 && status !== "full";

            return (
              <div
                key={classItem.id}
                className={`border-b border-black overflow-hidden transition-shadow duration-200 ${
                  index === 0 ? "border-t" : ""
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center p-3 sm:p-4 gap-3 sm:gap-4">
                  {/* Time + Duration */}
                  <div className="flex flex-col">
                    <span className="font-bold text-sm sm:text-base mb-0.5">
                      {classItem.time}
                    </span>
                    <span className="text-xs italic">{classItem.duration}</span>
                  </div>

                  {/* Title + Instructor (spans two cols on mobile if needed) */}
                  <div className="flex flex-col">
                    <h3 className="font-semibold mb-1 tracking-wider truncate">
                      {classItem.type}
                    </h3>
                    <p className="text-xs tracking-wider truncate">
                      {classItem.instructor}
                    </p>
                    <p className="text-[10px] sm:text-[8px] font-semibold tracking-wider hover:text-gray-700 cursor-pointer truncate">
                      {t("show_details")}
                    </p>
                  </div>

                  {/* Capacity + Spots Left */}
                  <div className="flex items-center sm:justify-start justify-between space-x-3 text-black">
                    <span className="text-sm font-medium truncate">
                      {classItem.capacity}
                    </span>

                    {isNearlyFull && (
                      <span className="flex items-center text-[10px] italic tracking-wider">
                        <Clock className="w-3 h-3 mr-1" />
                        {t("only_spots_left", { count: total - current })}
                      </span>
                    )}
                  </div>

                  {/* Button - full width on small screens, compact on larger */}
                  <div className="flex justify-end">
                    <div className="w-full sm:w-[80%] flex flex-col items-center justify-center space-y-1">
                      <button
                        onClick={() => handleBookClass(classItem.id)}
                        disabled={status === "full" || status === "booked"}
                        className={`w-full px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${getStatusColor(
                          status
                        )}`}
                      >
                        {getStatusText(status)}
                      </button>

                      {status === "full" && (
                        <span className="text-[10px] underline italic tracking-wider cursor-pointer">
                          {t("join_waiting_list")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>{t("no_classes")}</p>
            <p className="text-sm mt-2">{t("try_another_date")}</p>
          </div>
        )}
      </div>

      {/* Bottom spacing */}
      <div className="h-6 sm:h-8"></div>
    </div>
  );
};

export default FitnessBookingCalendar;
