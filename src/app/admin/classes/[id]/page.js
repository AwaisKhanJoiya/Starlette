"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  ArrowLeft,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";

export default function ClassDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchClassDetails() {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/classes/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch class details");
        }

        const data = await response.json();
        setClassData(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching class details:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchClassDetails();
    }
  }, [id]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Delete class
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;

    try {
      const response = await fetch(`/api/admin/classes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete class");
      }

      alert("Class deleted successfully");
      router.push("/admin/classes");
    } catch (err) {
      alert("Error deleting class: " + err.message);
      console.error("Error deleting class:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent"></div>
        <p className="mt-4">Loading class details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => router.push("/admin/classes")}
          className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Class not found</p>
        <button
          onClick={() => router.push("/admin/classes")}
          className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/admin/classes")}
          className="flex items-center text-gray-600 hover:text-primary"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Classes
        </button>

        <div className="flex space-x-3">
          <Link
            href={`/admin/classes/${id}/edit`}
            className="flex items-center bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
          >
            <Edit size={16} className="mr-2" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {classData.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <Calendar className="w-5 h-5 mr-3 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{formatDate(classData.startDate)}</p>
                {classData.endDate && (
                  <p className="text-sm text-gray-500">
                    Until {formatDate(classData.endDate)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="w-5 h-5 mr-3 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">
                  {classData.startTime} 
                  <span className="text-sm text-gray-500 ml-2">(50 minutes)</span>
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="w-5 h-5 mr-3 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{classData.location}</p>
              </div>
            </div>

            <div className="flex items-start">
              <User className="w-5 h-5 mr-3 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Instructor</p>
                <p className="font-medium">{classData.coach.name}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Users className="w-5 h-5 mr-3 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Capacity</p>
                <p className="font-medium">
                  {classData.enrolledStudents?.filter(
                    (s) => s.status === "confirmed"
                  ).length || 0}{" "}
                  / {classData.capacity}
                </p>
                <p className="text-xs text-gray-500">(Maximum capacity is 5)</p>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Recurrence</h3>
              <div className="flex items-center">
                <span
                  className={`px-3 py-1 text-sm rounded-full capitalize ${
                    classData.recurrenceType === "onetime"
                      ? "bg-gray-100 text-gray-800"
                      : classData.recurrenceType === "daily"
                      ? "bg-blue-100 text-blue-800"
                      : classData.recurrenceType === "weekly"
                      ? "bg-green-100 text-green-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {classData.recurrenceType}
                </span>
                {classData.recurrenceType !== "onetime" && (
                  <span className="ml-2 text-sm text-gray-600">
                    {classData.recurrenceDays?.join(", ")}
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-line">
                {classData.description || "No description provided."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Students Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Enrolled Students</h2>

        {!classData.enrolledStudents ||
        classData.enrolledStudents.length === 0 ? (
          <p className="text-gray-500">No students enrolled yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classData.enrolledStudents.map((student, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          student.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : student.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : student.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
