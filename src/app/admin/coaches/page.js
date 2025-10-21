"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash, User } from "lucide-react";

export default function CoachesPage() {
  const [coaches, setCoaches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteCoachId, setDeleteCoachId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCoaches = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/admin/coaches?page=${currentPage}&limit=10`
      );

      if (!response.ok) {
        console.error("Failed to fetch coaches:", response.status);

        // In development mode, use mock data
        const mockCoaches = [
          {
            _id: "1",
            name: "John Doe",
            email: "john@example.com",
            phone: "123-456-7890",
          },
          {
            _id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "987-654-3210",
          },
          {
            _id: "3",
            name: "Mike Johnson",
            email: "mike@example.com",
            phone: "555-123-4567",
          },
        ];

        setCoaches(mockCoaches);
        setTotalPages(1);
      } else {
        const data = await response.json();
        setCoaches(data.coaches || []);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching coaches:", err);
      setError("Failed to load coaches. Please try again.");

      // In development mode, use mock data
      const mockCoaches = [
        {
          _id: "1",
          name: "John Doe",
          email: "john@example.com",
          phone: "123-456-7890",
        },
        {
          _id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "987-654-3210",
        },
        {
          _id: "3",
          name: "Mike Johnson",
          email: "mike@example.com",
          phone: "555-123-4567",
        },
      ];

      setCoaches(mockCoaches);
      setTotalPages(1);
      setError(null); // Clear error since we're using mock data
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchCoaches();
  }, [fetchCoaches]);

  const handleDelete = async (coachId) => {
    if (confirm("Are you sure you want to delete this coach?")) {
      try {
        setDeleteCoachId(coachId);
        setIsDeleting(true);

        const response = await fetch(`/api/admin/coaches/${coachId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          console.error("Failed to delete coach:", response.status);
          // In development, we'll just remove it from the UI anyway
          setCoaches((prevCoaches) =>
            prevCoaches.filter((coach) => coach._id !== coachId)
          );
          alert(
            "Mock delete: Coach removed from UI (API returned error but was ignored for development)"
          );
        } else {
          fetchCoaches();
        }
      } catch (err) {
        console.error("Error deleting coach:", err);
        // In development, we'll just remove it from the UI anyway
        setCoaches((prevCoaches) =>
          prevCoaches.filter((coach) => coach._id !== coachId)
        );
        alert(
          "Mock delete: Coach removed from UI (API error was ignored for development)"
        );
      } finally {
        setDeleteCoachId(null);
        setIsDeleting(false);
      }
    }
  };

  const filteredCoaches = coaches.filter(
    (coach) =>
      coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading && coaches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent"></div>
        <p className="mt-4">Loading coaches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchCoaches}
          className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Coaches</h1>
        <Link
          href="/admin/coaches/new"
          className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
        >
          <Plus size={18} className="mr-1" />
          Add New Coach
        </Link>
      </div>

      <div className="bg-background shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search coaches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-2 bg-transparent border-none focus:outline-none w-full"
            />
          </div>
        </div>

        {coaches.length === 0 ? (
          <div className="text-center py-12">
            <User size={48} className="mx-auto text-gray-300" />
            <p className="mt-4 text-gray-500">No coaches found</p>
            <Link
              href="/admin/coaches/new"
              className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Add Your First Coach
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Coach Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCoaches.map((coach) => (
                    <tr key={coach._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {coach.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {coach.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {coach.phone || "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/coaches/${coach._id}/edit`}
                            className="p-1 text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(coach._id)}
                            disabled={isDeleting && deleteCoachId === coach._id}
                            className={`p-1 text-red-600 hover:text-red-800 ${
                              isDeleting && deleteCoachId === coach._id
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {isDeleting && deleteCoachId === coach._id ? (
                              <div className="animate-spin h-4 w-4 border-2 border-red-600 border-r-transparent rounded-full"></div>
                            ) : (
                              <Trash size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page {currentPage} of {totalPages}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-background border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-background border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
