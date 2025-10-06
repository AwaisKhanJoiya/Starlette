"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ClassForm from "@/components/admin/ClassForm";

export default function NewClass() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initial data for a new class
  const initialData = {
    title: "",
    description: "",
    coach: "", // Changed from instructor to coach
    location: "",
    classType: "", // New field for class type
    languages: [], // New field for languages
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    capacity: 20,
    recurrenceType: "onetime", // 'onetime', 'daily', 'weekly', 'monthly'
    recurrenceDays: [],
    waitlistEnabled: false, // New field for waitlist
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/admin/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create class");
      }

      router.push("/admin/classes");
    } catch (err) {
      console.error("Error creating class:", err);
      alert("Error creating class: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={() => router.push("/admin/classes")}
          className="flex items-center text-gray-600 hover:text-primary"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Classes
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Create New Class
        </h1>

        <ClassForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
