import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Users,
} from "lucide-react";

const FitnessBookingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Generate dynamic class data based on date
  const generateClassesForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    const dayOfWeek = date.getDay();
    const seed = date.getDate() + date.getMonth() * 31;

    // Different class schedules based on day of week
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
      // Generate pseudo-random capacity based on date and class
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
    if (isToday(date)) return "Today";
    const days = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];
    return days[index];
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
        return "bg-primary  ";
      case "full":
        return "bg-custome-gray  cursor-not-allowed";
      case "booked":
        return "bg-green-100 ";
      default:
        return "bg-gray-100 ";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "available":
        return "BOOK";
      case "full":
        return "FULL";
      case "booked":
        return "BOOKED";
      default:
        return "BOOK";
    }
  };

  const currentClasses = generateClassesForDate(selectedDate);
  const currentMonth = selectedDate
    .toLocaleDateString("en-US", { month: "long" })
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
      <div className="flex items-center justify-between px-4 py-4  border-gray-100 text-black">
        <h1 className="text-2xl font-medium  tracking-wide">{currentMonth}</h1>
        <div className="relative date-picker-container">
          <Calendar
            className="w-6 h-6  cursor-pointer hover:text-gray-800 transition-colors"
            onClick={handleCalendarClick}
          />
          {showDatePicker && (
            <div className="absolute top-8 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
              <input
                type="date"
                value={selectedDate.toISOString().split("T")[0]}
                onChange={handleDatePickerChange}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Week Navigation with Chevrons */}
      <div className="px-6 py-6 w-full">
        <div className="flex justify-center items-center">
          {/* Left Chevron */}
          <ChevronLeft
            className="w-10 h-10 text-custome-gray cursor-pointer hover:text-black transition-colors p-1"
            onClick={() => navigateWeek(-1)}
          />

          {/* Week Days */}
          <div className="flex space-x-16">
            {weekDates.map((date, index) => {
              const todayIs = isToday(date);
              const selectedIs = isSameDate(date, selectedDate);

              return (
                <div
                  key={index}
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={() => handleDateSelect(date)}
                >
                  <span className="text-sm text-gray-500 mb-2 group-hover:text-gray-700 transition-colors">
                    {formatDayName(date, index)}
                  </span>

                  <div
                    className={`w-10 h-10 rounded-full border border-black flex items-center justify-center font-medium transition-all duration-200 ${
                      todayIs
                        ? "bg-primary  shadow-sm"
                        : selectedIs
                        ? "bg-[#EBEAEA]  shadow-sm"
                        : "hover:bg-[#EBEAEA"
                    }`}
                  >
                    {date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Chevron */}
          <ChevronRight
            className="w-10 h-10 text-custome-gray cursor-pointer hover:text-black transition-colors p-1"
            onClick={() => navigateWeek(1)}
          />
        </div>
      </div>

      {/* Selected Date Display */}
      <div className="px-6 pb-4 border-b ">
        <h2 className="font-bold ">
          {selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h2>
      </div>

      {/* Classes List */}
      <div className="px-6  ">
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
                <div className="grid grid-cols-4 items-center p-4 gap-4">
                  {/* Time + Duration */}
                  <div className="flex flex-col">
                    <span className="font-bold mb-1">{classItem.time}</span>
                    <span className="text-xs italic">{classItem.duration}</span>
                  </div>

                  {/* Title + Instructor */}
                  <div className="flex flex-col">
                    <h3 className="font-semibold mb-1 tracking-wider">
                      {classItem.type}
                    </h3>
                    <p className="text-xs tracking-wider">
                      {classItem.instructor}
                    </p>
                    <p className="text-[8px] font-semibold tracking-wider hover:text-gray-700 cursor-pointer">
                      SHOW DETAILS ▼
                    </p>
                  </div>

                  {/* Capacity + Spots Left */}
                  <div className="flex space-x-10 text-black">
                    <span className="text-sm font-medium">
                      {classItem.capacity}
                    </span>
                    {isNearlyFull && (
                      <span className="flex items-center text-[10px] italic tracking-wider">
                        <Clock className="w-3 h-3 mr-1" /> ONLY{" "}
                        {total - current} SPOT{total - current !== 1 ? "S" : ""}{" "}
                        LEFT
                      </span>
                    )}
                  </div>

                  {/* Button */}
                  <div className="flex  justify-end">
                    <div className="flex flex-col items-center justify-center space-y-1 w-[60%]">
                      <button
                        onClick={() => handleBookClass(classItem.id)}
                        disabled={status === "full" || status === "booked"}
                        className={`w-full px-6 py-2 rounded-md text-xs font-medium transition-all duration-200 ${getStatusColor(
                          status
                        )}`}
                      >
                        {getStatusText(status)}
                      </button>

                      {status === "full" && (
                        <span className="flex text-center font-bold cursor-pointer items-center text-[10px] underline     italic tracking-wider">
                          JOIN THE WAITINGS LIST
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No classes scheduled for this day</p>
            <p className="text-sm mt-2">Try selecting a different date</p>
          </div>
        )}
      </div>

      {/* Bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
};

export default FitnessBookingCalendar;
