"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useUserAuthContext } from "@/context/UserAuthContext";
import {
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle,
} from "lucide-react";

const EnrolledClassesList = () => {
  const t = useTranslations("profile");
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedClassId, setExpandedClassId] = useState(null);
  const [cancellingClassId, setCancellingClassId] = useState(null);
  const [cancelError, setCancelError] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  // Use auth context
  const { user, getAuthToken } = useUserAuthContext();

  // Fetch enrolled classes from API
  const fetchEnrolledClasses = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setError("You must be logged in to view enrolled classes");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/classes/enrolled?includeHistory=${showHistory}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch enrolled classes: ${response.status}`);
      }

      const data = await response.json();
      setEnrolledClasses(data.classes || []);
    } catch (err) {
      console.error("Error fetching enrolled classes:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getAuthToken, showHistory]);

  // Handle cancellation of a class
  const handleCancelClass = async (classId) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      setCancellingClassId(classId);
      setCancelError(null);
      setCancelSuccess(null);

      const response = await fetch("/api/classes/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ classId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCancelError(data.message);
        return;
      }

      setCancelSuccess(data.message);

      // Refresh the list after cancellation
      await fetchEnrolledClasses();
    } catch (error) {
      console.error("Error cancelling class:", error);
      setCancelError(error.message || "Failed to cancel class");
    } finally {
      setCancellingClassId(null);
    }
  };

  // Toggle class details
  const toggleClassDetails = (classId) => {
    setExpandedClassId(expandedClassId === classId ? null : classId);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status text and colors
  const getStatusInfo = (status, isPast) => {
    if (isPast) {
      return {
        text: t("status.completed"),
        color: "text-gray-500",
        bgColor: "bg-gray-100",
      };
    }

    switch (status) {
      case "confirmed":
        return {
          text: t("status.confirmed"),
          color: "text-green-700",
          bgColor: "bg-green-100",
        };
      case "waitlisted":
        return {
          text: t("status.waitlisted"),
          color: "text-yellow-700",
          bgColor: "bg-yellow-100",
        };
      case "cancelled":
        return {
          text: t("status.cancelled"),
          color: "text-red-700",
          bgColor: "bg-red-100",
        };
      default:
        return {
          text: status,
          color: "text-gray-700",
          bgColor: "bg-gray-100",
        };
    }
  };

  // Load enrolled classes on component mount
  useEffect(() => {
    fetchEnrolledClasses();
  }, [fetchEnrolledClasses]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t("my_classes")}</h2>

        <div className="flex items-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showHistory}
              onChange={() => setShowHistory(!showHistory)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-background after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            <span className="ms-3 text-sm font-medium text-gray-900">
              {t("show_history")}
            </span>
          </label>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-gray-500">
          <p>{error}</p>
          <button
            onClick={fetchEnrolledClasses}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            {t("refresh")}
          </button>
        </div>
      ) : enrolledClasses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-medium mb-2">{t("no_classes")}</h3>
          <p className="text-gray-500">{t("book_classes_message")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {enrolledClasses.map((classItem) => {
            const statusInfo = getStatusInfo(
              classItem.enrollmentStatus,
              classItem.isPast
            );

            return (
              <div
                key={classItem.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4">
                  {/* Date and Time */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      {formatDate(classItem.date)}
                    </p>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-gray-500" />
                      <p className="font-semibold">{classItem.time}</p>
                      <span className="mx-1">•</span>
                      <p className="text-sm text-gray-500">
                        {classItem.duration}
                      </p>
                    </div>
                  </div>

                  {/* Class Details */}
                  <div>
                    <p className="font-bold">{classItem.type}</p>
                    <p className="text-sm">
                      {t("with")} {classItem.instructor}
                    </p>
                    <p className="text-xs text-gray-500">
                      {classItem.location}
                    </p>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col items-end">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color} mb-2`}
                    >
                      {statusInfo.text}
                    </span>

                    <div className="flex space-x-3">
                      {classItem.canCancel &&
                        (cancellingClassId === classItem.id ? (
                          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                        ) : (
                          <button
                            onClick={() => handleCancelClass(classItem.id)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            {t("cancel_class")}
                          </button>
                        ))}

                      <button
                        onClick={() => toggleClassDetails(classItem.id)}
                        className="flex items-center text-xs text-gray-500 hover:text-primary"
                      >
                        {expandedClassId === classItem.id ? (
                          <>
                            {t("hide_details")}
                            <ChevronUp className="ml-1 w-3 h-3" />
                          </>
                        ) : (
                          <>
                            {t("show_details")}
                            <ChevronDown className="ml-1 w-3 h-3" />
                          </>
                        )}
                      </button>
                    </div>

                    {cancelError && cancellingClassId === classItem.id && (
                      <p className="text-xs text-red-500 mt-2">{cancelError}</p>
                    )}

                    {cancelSuccess && cancellingClassId === classItem.id && (
                      <p className="text-xs text-green-500 flex items-center mt-2">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {cancelSuccess}
                      </p>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedClassId === classItem.id && (
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                    <h4 className="font-medium mb-2">
                      {t("class_description")}
                    </h4>
                    <p className="text-sm mb-4">
                      {classItem.description || t("no_description")}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium">{t("capacity")}: </span>
                        {classItem.capacity}
                      </div>
                      <div>
                        <span className="font-medium">{t("languages")}: </span>
                        {Array.isArray(classItem.languages)
                          ? classItem.languages.join(", ")
                          : classItem.languages}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EnrolledClassesList;
