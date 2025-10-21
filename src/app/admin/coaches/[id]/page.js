"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import Link from "next/link";

export default function CoachDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchCoachDetails() {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/coaches/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch coach details");
        }

        const data = await response.json();
        setCoach(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching coach details:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchCoachDetails();
    }
  }, [id]);

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this coach? This action cannot be undone."
      )
    ) {
      try {
        setIsDeleting(true);
        const response = await fetch(`/api/admin/coaches/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete coach");
        }

        router.push("/admin/coaches");
      } catch (err) {
        console.error("Error deleting coach:", err);
        alert("Failed to delete coach. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent"></div>
        <p className="mt-4">Loading coach details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => router.push("/admin/coaches")}
          className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Coach not found</p>
        <button
          onClick={() => router.push("/admin/coaches")}
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
          onClick={() => router.push("/admin/coaches")}
          className="flex items-center text-gray-600 hover:text-primary"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Coaches
        </button>

        <div className="flex space-x-2">
          <Link
            href={`/admin/coaches/${id}/edit`}
            className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            <Edit size={16} className="mr-1" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-70"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-r-transparent rounded-full mr-1"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash size={16} className="mr-1" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-background shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{coach.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">
                Contact Information
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{coach.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{coach.phone || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Bio</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="whitespace-pre-wrap">
                {coach.bio || "No bio available."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Classes</h2>
          <p className="text-gray-500">
            This section will list all classes taught by this coach.
          </p>
        </div>
      </div>
    </div>
  );
}
