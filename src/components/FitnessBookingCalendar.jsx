"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useUserAuthContext } from "@/context/UserAuthContext";
import axios from "axios";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { formatDate } from "date-fns/format";
import { Calendar as CalendarUI } from "./ui/calendar";

const FitnessBookingCalendar = () => {
  const t = useTranslations("fitness");
  const locale = useLocale();

  const [selectedDate, setSelectedDate] = useState(() => {
    // Initialize with current date at midnight to avoid timezone issues
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingClassId, setBookingClassId] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookedClasses, setBookedClasses] = useState(new Map()); // Map classId to enrollment status
  const [expandedClassId, setExpandedClassId] = useState(null);
  const [open, setOpen] = useState(false);

  // Use auth context
  const { getAuthToken } = useUserAuthContext();

  // Fetch user's enrolled classes
  const fetchEnrolledClasses = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await axios.get("/classes/enrolled");

      if (response.status === 200) {
        const data = response.data;
        // Create a map of classId -> enrollment status
        const enrolledMap = new Map();
        data.classes.forEach((classItem) => {
          enrolledMap.set(classItem.id, classItem.enrollmentStatus);
        });
        setBookedClasses(enrolledMap);
      }
    } catch (error) {
      console.error("Error fetching enrolled classes:", error);
    }
  }, [getAuthToken]);

  // Fetch classes from the API
  const fetchClasses = useCallback(
    async (date) => {
      const token = getAuthToken();
      try {
        setLoading(true);
        setError(null);

        // Format date for API using local timezone to avoid UTC conversion issues
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
        const day = String(date.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;

        // Fetch classes from our API for the selected date
        const response = await fetch(`/api/classes?date=${dateStr}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch classes: ${response.status}`);
        }

        const data = await response.json();
        setClasses(data.classes || []);

        // If user is authenticated, fetch their enrolled classes
        await fetchEnrolledClasses();
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [fetchEnrolledClasses]
  );

  // Get dates for the current week
  const getWeekDates = (date) => {
    const weekDates = [];
    // Create a new date object to avoid modifying the original date
    const startOfWeek = new Date(date);
    // Adjust to the start of the week (Sunday)
    startOfWeek.setDate(date.getDate() - date.getDay());

    for (let i = 0; i < 7; i++) {
      // Important: Create a NEW date object for each day to avoid reference issues
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      // Ensure the date is set to midnight to avoid timezone issues
      currentDate.setHours(0, 0, 0, 0);
      weekDates.push(currentDate);
    }

    return weekDates;
  };

  // Get classes for a specific date
  const getClassesForDate = (date) => {
    if (!classes || classes.length === 0) {
      return [];
    }

    // Format date consistently using local timezone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    return classes.filter((classItem) => classItem.date === dateStr);
  };

  useEffect(() => {
    fetchClasses(selectedDate);
  }, [selectedDate, fetchClasses]);

  useEffect(() => {
    // Fetch enrolled classes on component mount
    fetchEnrolledClasses();
  }, [fetchEnrolledClasses]);

  const weekDates = getWeekDates(selectedDate);

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameDate = (date1, date2) => {
    // Compare year, month, and day independently to avoid timezone issues
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
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
    // Create a new date object and ensure it's set to midnight in local time
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    setSelectedDate(newDate);
  };

  const handleDatePickerChange = (date) => {
    console.log(date);
    // Get the date from input and ensure it's treated as a local date
    const dateStr = formatDate(date, "yyyy-MM-dd");
    const [year, month, day] = dateStr
      .split("-")
      .map((num) => parseInt(num, 10));
    const newDate = new Date(year, month - 1, day); // Month is 0-indexed in JavaScript
    newDate.setHours(0, 0, 0, 0);
    setSelectedDate(newDate);
    setShowDatePicker(false);
  };

  const handleBookClass = async (classId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        window.location.href =
          "/login?redirect=" + encodeURIComponent(window.location.pathname);
        return;
      }

      // Find the class in our list to get the original class ID and date
      const classToBook = classes.find((c) => c.id === classId);
      if (!classToBook) {
        setBookingError("Class not found");
        return;
      }

      // For booking, we need the original class ID and the date for recurring classes
      const bookingData = {
        classId: classToBook.originalClassId, // Use the original class ID stored in our data
        date: classToBook.date, // For recurring classes, this is the specific date instance
        instanceId: classId, // The instance ID (for recurring classes this is a compound ID)
      };

      setBookingClassId(classId);
      setBookingError(null);
      setBookingSuccess(null);

      const { data } = await axios.post("/classes/book", bookingData);

      // Update booked classes map with the new status
      setBookedClasses((prev) => {
        const newMap = new Map(prev);
        newMap.set(classId, data.status);
        return newMap;
      });

      setBookingSuccess(data.message);

      // Refresh classes to get updated capacity info
      await fetchClasses(selectedDate);
    } catch (error) {
      console.log(error);
    } finally {
      setBookingClassId(null);
    }
  };

  const toggleClassDetails = (classId) => {
    setExpandedClassId(expandedClassId === classId ? null : classId);
  };

  // Handle cancellation of booked class
  const handleCancelClass = async (classId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        window.location.href = "/login";
        return;
      }

      setBookingClassId(classId);
      setBookingError(null);
      setBookingSuccess(null);

      const { data } = await axios.post("/classes/cancel", { classId });

      // Update booked classes map
      setBookedClasses((prev) => {
        const newMap = new Map(prev);
        newMap.set(classId, "cancelled");
        return newMap;
      });

      setBookingSuccess(data.message);

      // Refresh classes to get updated capacity info
      await fetchClasses(selectedDate);
    } catch (error) {
      console.log(error);
    } finally {
      setBookingClassId(null);
    }
  };

  const getClassStatus = (classItem) => {
    // Check if class is in the bookedClasses map
    if (bookedClasses.has(classItem.id)) {
      const status = bookedClasses.get(classItem.id);
      if (status === "confirmed") return "booked";
      if (status === "waitlisted") return "waitlisted";
      if (status === "cancelled") return classItem.status; // Use original status if cancelled
      return status;
    }
    return classItem.status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-primary";
      case "full":
        return "bg-custome-gray cursor-not-allowed";
      case "booked":
        return "bg-green-600 text-white";
      case "waitlisted":
        return "bg-yellow-400 text-white";
      default:
        return "bg-gray-100";
    }
  };

  const getStatusText = (status) => {
    return t(`status.${status}`);
  };

  const currentClasses = getClassesForDate(selectedDate);

  const currentMonth = selectedDate
    .toLocaleDateString(locale || "en-US", { month: "long" })
    .toUpperCase();

  return (
    <div>
      <div className="flex items-center justify-between py-3 sm:py-4 border-gray-100 ">
        <h1 className="text-lg sm:text-xl font-medium tracking-wide truncate text-dark-gray">
          {currentMonth}
        </h1>

        {/* Datepicker container: on small screens it expands full width below icon */}
        <div className="relative">
          <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
            <PopoverTrigger asChild>
              <Calendar
                className="w-6 h-6 cursor-pointer hover:text-gray-800 transition-colors"
                aria-label="Open date picker"
              />
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="end">
              <CalendarUI
                mode="single"
                selected={selectedDate}
                captionLayout="dropdown"
                // month={month}
                // onMonthChange={setMonth}
                onSelect={handleDatePickerChange}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Week Navigation with Chevrons */}
      <div className="py-4 sm:py-6 w-full">
        <div className="flex items-center gap-3 sm:gap-6 justify-center">
          <ChevronLeft
            className="w-14 h-14 md:w-10 md:h-10 text-custome-gray cursor-pointer hover:text-dark-gray transition-colors p-1"
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
                    <span className="text-xs sm:text-sm text-[#000000] tracking-tight mb-1 sm:mb-2 group-hover:text-gray-700 transition-colors">
                      {formatDayName(date, index)}
                    </span>

                    <div
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border text-[#000000] border-black flex items-center justify-center font-medium transition-all duration-200 ${
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
            className="w-14 h-14 md:w-10 md:h-10 text-custome-gray cursor-pointer hover:text-dark-gray transition-colors p-1"
            onClick={() => navigateWeek(1)}
            aria-label="Next week"
          />
        </div>
      </div>

      {/* Selected Date Display */}
      <div className="pb-3 border-b">
        <h2 className="font-bold text-sm sm:text-base tracking-tight">
          {selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h2>
      </div>

      {/* Classes List */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-400" />
            <p>{t("error.loading_classes")}</p>
            <p className="text-sm mt-2">{t("error.try_again")}</p>
            <button
              onClick={() => fetchClasses(selectedDate)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              {t("error.refresh")}
            </button>
          </div>
        ) : currentClasses.length > 0 ? (
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
                    <span className="text-xs tracking-tight italic">
                      {classItem.duration}
                    </span>
                  </div>

                  {/* Title + Instructor (spans two cols on mobile if needed) */}
                  <div className="flex flex-col">
                    <h3 className="font-semibold mb-1 tracking-wider truncate">
                      {classItem.type}
                    </h3>
                    <p className="text-xs tracking-wider truncate">
                      {classItem.instructor}
                    </p>
                    <p
                      className="text-[10px] sm:text-[8px] font-semibold tracking-wider hover:text-gray-700 cursor-pointer truncate"
                      onClick={() => toggleClassDetails(classItem.id)}
                    >
                      {expandedClassId === classItem.id
                        ? `${t("hide_details")} ▲`
                        : `${t("show_details")} ▼`}
                    </p>
                  </div>

                  {/* Capacity + Spots Left */}
                  <div className="flex items-center sm:justify-start justify-between space-x-3 text-dark-gray">
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
                      {bookingClassId === classItem.id ? (
                        <button
                          disabled
                          className="w-full px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 bg-gray-300"
                        >
                          <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                        </button>
                      ) : status === "booked" ? (
                        <button
                          onClick={() => handleCancelClass(classItem.id)}
                          className="w-full px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 bg-red-500 text-white hover:bg-red-600"
                        >
                          {t("status.cancel")}
                        </button>
                      ) : status === "waitlisted" ? (
                        <button
                          onClick={() => handleCancelClass(classItem.id)}
                          className="w-full px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 bg-yellow-400 text-white hover:bg-yellow-500"
                        >
                          {t("status.cancel_waitlist")}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBookClass(classItem.id)}
                          disabled={status === "full"}
                          className={`w-full px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${getStatusColor(
                            status
                          )}`}
                        >
                          {getStatusText(status)}
                        </button>
                      )}

                      {status === "full" &&
                        classItem.waitlistEnabled &&
                        !bookedClasses.has(classItem.id) && (
                          <button
                            onClick={() => handleBookClass(classItem.id)}
                            className="text-[10px] underline italic tracking-wider cursor-pointer hover:text-primary"
                          >
                            {t("join_waiting_list")}
                          </button>
                        )}

                      {bookingError && bookingClassId === classItem.id && (
                        <span className="text-[10px] text-red-500 italic mt-1">
                          {bookingError}
                        </span>
                      )}

                      {bookingSuccess && bookingClassId === classItem.id && (
                        <span className="text-[10px] text-green-500 italic mt-1 flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {bookingSuccess}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded class details */}
                {expandedClassId === classItem.id && (
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                    <div className="text-sm">
                      <h4 className="font-semibold mb-2">
                        {t("class_details")}
                      </h4>
                      <p className="mb-2">
                        {classItem.description || t("no_description")}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mt-3">
                        <div>
                          <span className="font-medium">{t("location")}: </span>
                          {classItem.location || t("studio")}
                        </div>
                        {classItem.languages && (
                          <div>
                            <span className="font-medium">
                              {t("languages")}:{" "}
                            </span>
                            {Array.isArray(classItem.languages)
                              ? classItem.languages.join(", ")
                              : classItem.languages || "English"}
                          </div>
                        )}
                      </div>

                      {classItem.equipment && (
                        <div className="mt-2 text-xs">
                          <span className="font-medium">
                            {t("equipment")}:{" "}
                          </span>
                          {classItem.equipment}
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
