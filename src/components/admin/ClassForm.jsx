"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  Info,
  MapPin,
  User,
  Globe,
  ListChecks,
  Languages,
  Type,
  ToggleRight,
} from "lucide-react";

export default function ClassForm({ initialData, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [selectedDays, setSelectedDays] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [isLoadingCoaches, setIsLoadingCoaches] = useState(true);

  useEffect(() => {
    // Initialize selected days from initialData if recurrenceDays exists
    if (initialData.recurrenceDays && initialData.recurrenceDays.length > 0) {
      setSelectedDays(initialData.recurrenceDays);
    }

    // Fetch coaches
    const fetchCoaches = async () => {
      try {
        setIsLoadingCoaches(true);
        const response = await fetch("/api/admin/coaches");
        if (response.ok) {
          const data = await response.json();
          setCoaches(data.coaches || []);
        } else {
          console.error("Failed to fetch coaches:", response.status);
          // In development, we can use mock data
          setCoaches([
            { _id: "1", name: "Coach John" },
            { _id: "2", name: "Coach Sarah" },
            { _id: "3", name: "Coach Mike" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching coaches:", error);
        // In development, we can use mock data
        setCoaches([
          { _id: "1", name: "Coach John" },
          { _id: "2", name: "Coach Sarah" },
          { _id: "3", name: "Coach Mike" },
        ]);
      } finally {
        setIsLoadingCoaches(false);
      }
    };

    fetchCoaches();
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "capacity") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for the field being updated
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleRecurrenceTypeChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      recurrenceType: value,
      // Reset recurrence days if changing to onetime
      recurrenceDays: value === "onetime" ? [] : prev.recurrenceDays,
    }));

    if (value === "onetime") {
      setSelectedDays([]);
    }
  };

  const handleDayToggle = (day) => {
    let updatedDays;

    if (selectedDays.includes(day)) {
      updatedDays = selectedDays.filter((d) => d !== day);
    } else {
      updatedDays = [...selectedDays, day];
    }

    setSelectedDays(updatedDays);
    setFormData((prev) => ({
      ...prev,
      recurrenceDays: updatedDays,
    }));

    // Clear error for recurrence days
    if (errors.recurrenceDays) {
      setErrors((prev) => ({
        ...prev,
        recurrenceDays: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.coach) {
      newErrors.coach = "Coach selection is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.classType) {
      newErrors.classType = "Class type is required";
    }

    if (!formData.languages || formData.languages.length === 0) {
      newErrors.languages = "At least one language is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    }

    if (formData.capacity <= 0) {
      newErrors.capacity = "Capacity must be greater than zero";
    }

    if (
      formData.recurrenceType !== "onetime" &&
      (!formData.recurrenceDays || formData.recurrenceDays.length === 0)
    ) {
      newErrors.recurrenceDays =
        "Select at least one day for recurring classes";
    }

    if (
      formData.endDate &&
      formData.startDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      newErrors.endDate = "End date cannot be before start date";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Class Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Title*
            </label>
            <div className="relative">
              <Info className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`pl-10 pr-4 py-2 w-full border ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="Enter class title"
              />
            </div>
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coach*
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                name="coach"
                value={formData.coach || ""}
                onChange={handleChange}
                className={`pl-10 pr-4 py-2 w-full border ${
                  errors.coach ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                disabled={isLoadingCoaches}
              >
                <option value="">Select a coach</option>
                {coaches.map((coach) => (
                  <option key={coach._id} value={coach._id}>
                    {coach.name}
                  </option>
                ))}
              </select>
              {isLoadingCoaches && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-r-transparent rounded-full"></div>
                </div>
              )}
            </div>
            {errors.coach && (
              <p className="mt-1 text-sm text-red-500">{errors.coach}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location*
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`pl-10 pr-4 py-2 w-full border ${
                  errors.location ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="Enter class location"
              />
            </div>
            {errors.location && (
              <p className="mt-1 text-sm text-red-500">{errors.location}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Type*
            </label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                name="classType"
                value={formData.classType || ""}
                onChange={handleChange}
                className={`pl-10 pr-4 py-2 w-full border ${
                  errors.classType ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
              >
                <option value="">Select class type</option>
                <option value="lagree">Lagree</option>
                <option value="intro">Intro</option>
                <option value="advanced">Advanced</option>
                <option value="private">Private</option>
              </select>
            </div>
            {errors.classType && (
              <p className="mt-1 text-sm text-red-500">{errors.classType}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Capacity*
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                className={`pl-10 pr-4 py-2 w-full border ${
                  errors.capacity ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="Enter maximum capacity"
              />
            </div>
            {errors.capacity && (
              <p className="mt-1 text-sm text-red-500">{errors.capacity}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date*
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`pl-10 pr-4 py-2 w-full border ${
                  errors.startDate ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
              />
            </div>
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date{" "}
              <span className="text-xs text-gray-500">
                (for recurring classes)
              </span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`pl-10 pr-4 py-2 w-full border ${
                  errors.endDate ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
              />
            </div>
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time*
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={`pl-10 pr-4 py-2 w-full border ${
                    errors.startTime ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                />
              </div>
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-500">{errors.startTime}</p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time*
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={`pl-10 pr-4 py-2 w-full border ${
                    errors.endTime ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                />
              </div>
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-500">{errors.endTime}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recurrence Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700">
          Recurrence Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recurrence Type
            </label>
            <select
              name="recurrenceType"
              value={formData.recurrenceType}
              onChange={handleRecurrenceTypeChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="onetime">One-time Class</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {formData.recurrenceType !== "onetime" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recurrence Days
              </label>
              <div className="flex flex-wrap gap-2">
                {weekDays.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedDays.includes(day)
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>
              {errors.recurrenceDays && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.recurrenceDays}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Language and Waitlist Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700">
          Additional Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Languages*
            </label>
            <div className="relative mb-2">
              <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <div
                className={`pl-10 pr-4 py-2 w-full border ${
                  errors.languages ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[42px] flex items-center flex-wrap gap-2`}
              >
                <div className="flex flex-wrap gap-2">
                  {formData.languages &&
                    formData.languages.map((lang) => (
                      <span
                        key={lang}
                        className="bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        {lang}
                        <button
                          type="button"
                          onClick={() => {
                            const updatedLanguages = formData.languages.filter(
                              (l) => l !== lang
                            );
                            setFormData((prev) => ({
                              ...prev,
                              languages: updatedLanguages,
                            }));
                            if (
                              errors.languages &&
                              updatedLanguages.length > 0
                            ) {
                              setErrors((prev) => ({
                                ...prev,
                                languages: null,
                              }));
                            }
                          }}
                          className="ml-1 text-white hover:text-gray-200"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {["English", "French", "Spanish"].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    const currentLanguages = formData.languages || [];
                    if (!currentLanguages.includes(lang)) {
                      const updatedLanguages = [...currentLanguages, lang];
                      setFormData((prev) => ({
                        ...prev,
                        languages: updatedLanguages,
                      }));
                      if (errors.languages) {
                        setErrors((prev) => ({
                          ...prev,
                          languages: null,
                        }));
                      }
                    }
                  }}
                  disabled={
                    formData.languages && formData.languages.includes(lang)
                  }
                  className={`px-3 py-1 rounded-full text-sm ${
                    formData.languages && formData.languages.includes(lang)
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            {errors.languages && (
              <p className="mt-1 text-sm text-red-500">{errors.languages}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Waitlist Settings
            </label>
            <div className="relative flex items-center">
              <ToggleRight className="mr-2 text-gray-400 h-5 w-5" />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="waitlistEnabled"
                  name="waitlistEnabled"
                  checked={formData.waitlistEnabled || false}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      waitlistEnabled: e.target.checked,
                    }));
                  }}
                  className="mr-2 h-4 w-4 text-primary rounded focus:ring-primary"
                />
                <label
                  htmlFor="waitlistEnabled"
                  className="text-sm text-gray-700"
                >
                  Enable waitlist for this class
                </label>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              When enabled, students can join a waitlist after the class is full
              and will be automatically moved into the class if spots become
              available.
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter class description"
        ></textarea>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 flex items-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-r-transparent rounded-full mr-2"></div>
              Saving...
            </>
          ) : (
            "Save Class"
          )}
        </button>
      </div>
    </form>
  );
}
