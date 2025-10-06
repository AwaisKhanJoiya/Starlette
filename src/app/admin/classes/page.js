"use client";

import React, { useEffect, useState } from "react";
import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ClassesManagement() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const router = useRouter();

  // Load classes
  useEffect(() => {
    async function fetchClasses() {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/admin/classes?page=${pagination.page}&limit=${pagination.limit}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch classes");
        }

        const data = await response.json();
        setClasses(data.classes || []);
        setPagination(data.pagination || pagination);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching classes:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchClasses();
  }, [pagination.page, pagination.limit]);

  // Filter classes by search term
  const filteredClasses = classes.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Delete class
  const handleDelete = async (classId) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;

    try {
      const response = await fetch(`/api/admin/classes/${classId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete class");
      }

      // Remove class from state
      setClasses(classes.filter((c) => c._id !== classId));
      alert("Class deleted successfully");
    } catch (err) {
      alert("Error deleting class: " + err.message);
      console.error("Error deleting class:", err);
    }
  };

  // Handle pagination
  const goToPage = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination({ ...pagination, page });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Classes Management</h1>
        <Link
          href="/admin/classes/new"
          className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
        >
          <Plus size={16} className="mr-2" />
          Create Class
        </Link>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-grow">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Classes table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4">Loading classes...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recurrence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClasses.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No classes found
                  </td>
                </tr>
              ) : (
                filteredClasses.map((cls) => (
                  <tr key={cls._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {cls.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {cls.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cls.coach.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(cls.startDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cls.startTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          cls.recurrenceType === "onetime"
                            ? "bg-gray-100 text-gray-800"
                            : cls.recurrenceType === "daily"
                            ? "bg-blue-100 text-blue-800"
                            : cls.recurrenceType === "weekly"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {cls.recurrenceType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {
                        cls.enrolledStudents.filter(
                          (s) => s.status === "confirmed"
                        ).length
                      }{" "}
                      / {cls.capacity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() =>
                            router.push(`/admin/classes/${cls._id}`)
                          }
                          className="p-1 text-blue-600 hover:text-blue-900"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() =>
                            router.push(`/admin/classes/${cls._id}/edit`)
                          }
                          className="p-1 text-green-600 hover:text-green-900"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(cls._id)}
                          className="p-1 text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => goToPage(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex items-center space-x-1">
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${
                    pagination.page === i + 1
                      ? "bg-primary text-white"
                      : "border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => goToPage(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
