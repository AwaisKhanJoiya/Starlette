"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Calendar,
  CreditCard,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Eye,
  Filter,
  Download,
} from "lucide-react";
import { useAdminAuthContext } from "@/context/AdminAuthContext";

export default function UsersManagement() {
  const { getAuthToken } = useAdminAuthContext();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, subscription, classpack, none
  const [expandedUser, setExpandedUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    activeClassPacks: 0,
    totalBookings: 0,
  });

  // Fetch users data
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        setError("Not authenticated");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users || []);
      setFilteredUsers(data.users || []);
      setStats(data.stats || {});
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [getAuthToken]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter and search users
  useEffect(() => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phoneNumber?.includes(searchTerm)
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((user) => {
        if (filterStatus === "subscription") {
          return user.currentPlan.subscription !== null;
        } else if (filterStatus === "classpack") {
          return user.currentPlan.classPacks.length > 0;
        } else if (filterStatus === "none") {
          return (
            user.currentPlan.subscription === null &&
            user.currentPlan.classPacks.length === 0
          );
        }
        return true;
      });
    }

    setFilteredUsers(filtered);
  }, [searchTerm, filterStatus, users]);

  const toggleUserExpansion = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPlanBadge = (user) => {
    if (user.currentPlan.subscription) {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
          Subscription
        </span>
      );
    } else if (user.currentPlan.classPacks.length > 0) {
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
          Class Pack
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
          No Plan
        </span>
      );
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Current Plan",
      "Available Classes",
      "Total Bookings",
      "Member Since",
    ];
    const csvData = filteredUsers.map((user) => [
      user.name,
      user.email,
      user.phoneNumber || "N/A",
      user.currentPlan.subscription
        ? "Subscription"
        : user.currentPlan.classPacks.length > 0
        ? "Class Pack"
        : "None",
      user.availableClasses.total,
      user.bookingHistory.total,
      formatDate(user.createdAt),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-solid border-primary border-r-transparent rounded-full"></div>
        <span className="ml-3 text-gray-600">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-medium">Error loading users</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="rounded-full bg-blue-50 p-3">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Subscriptions</p>
              <p className="text-2xl font-bold">{stats.activeSubscriptions}</p>
            </div>
            <div className="rounded-full bg-green-50 p-3">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Class Packs</p>
              <p className="text-2xl font-bold">{stats.activeClassPacks}</p>
            </div>
            <div className="rounded-full bg-purple-50 p-3">
              <CreditCard className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold">{stats.totalBookings}</p>
            </div>
            <div className="rounded-full bg-amber-50 p-3">
              <Calendar className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Users</option>
              <option value="subscription">With Subscription</option>
              <option value="classpack">With Class Pack</option>
              <option value="none">No Active Plan</option>
            </select>
          </div>
        </div>

        <div className="mt-2 text-sm text-gray-500">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available Classes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member Since
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <React.Fragment key={user._id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                        {user.phoneNumber && (
                          <div className="text-xs text-gray-400">
                            {user.phoneNumber}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPlanBadge(user)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {user.currentPlan.subscription ? (
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.availableClasses.fromSubscription}
                            </div>
                            <div className="text-xs text-gray-500">
                              Subscription
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.availableClasses.fromClassPacks}
                            </div>
                            <div className="text-xs text-gray-500">
                              Class Packs
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {user.bookingHistory.total}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.bookingHistory.upcoming} upcoming
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => toggleUserExpansion(user._id)}
                        className="flex items-center gap-1 text-primary hover:text-primary/80"
                      >
                        <Eye className="h-4 w-4" />
                        {expandedUser === user._id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Details */}
                  {expandedUser === user._id && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 bg-gray-50">
                        <div className="space-y-4">
                          {/* Subscription Details */}
                          {user.currentPlan.subscription && (
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <h4 className="font-semibold text-gray-900 mb-3">
                                Subscription Details
                              </h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-500">Plan</p>
                                  <p className="font-medium">
                                    {user.currentPlan.subscription.planId}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Classes/Week</p>
                                  <p className="font-medium">
                                    {
                                      user.currentPlan.subscription
                                        .classesPerWeek
                                    }
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Amount</p>
                                  <p className="font-medium">
                                    ₪{user.currentPlan.subscription.amount}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Next Billing</p>
                                  <p className="font-medium">
                                    {formatDate(
                                      user.currentPlan.subscription
                                        .nextBillingDate
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Class Packs Details */}
                          {user.currentPlan.classPacks.length > 0 && (
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <h4 className="font-semibold text-gray-900 mb-3">
                                Class Packs
                              </h4>
                              <div className="space-y-2">
                                {user.currentPlan.classPacks.map(
                                  (pack, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                    >
                                      <div>
                                        <p className="font-medium text-sm">
                                          {pack.totalClasses} Classes Pack
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          Valid until{" "}
                                          {formatDate(pack.validUntil)}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-semibold text-primary">
                                          {pack.remainingClasses} remaining
                                        </p>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          {/* Booking History */}
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Recent Booking History
                            </h4>
                            {user.bookingHistory.recentBookings.length > 0 ? (
                              <div className="space-y-2">
                                {user.bookingHistory.recentBookings.map(
                                  (booking, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                                    >
                                      <div>
                                        <p className="font-medium">
                                          {booking.classTitle}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {formatDate(booking.date)} at{" "}
                                          {booking.time}
                                        </p>
                                      </div>
                                      <span
                                        className={`px-2 py-1 text-xs rounded-full ${
                                          booking.status === "confirmed"
                                            ? "bg-green-100 text-green-800"
                                            : booking.status === "cancelled"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-yellow-100 text-yellow-800"
                                        }`}
                                      >
                                        {booking.status}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">
                                No booking history
                              </p>
                            )}
                          </div>

                          {/* Summary Stats */}
                          <div className="grid grid-cols-4 gap-4">
                            <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                              <p className="text-xs text-gray-500">Upcoming</p>
                              <p className="text-lg font-semibold text-blue-600">
                                {user.bookingHistory.upcoming}
                              </p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                              <p className="text-xs text-gray-500">Past</p>
                              <p className="text-lg font-semibold text-gray-600">
                                {user.bookingHistory.past}
                              </p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                              <p className="text-xs text-gray-500">Cancelled</p>
                              <p className="text-lg font-semibold text-red-600">
                                {user.bookingHistory.cancelled}
                              </p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                              <p className="text-xs text-gray-500">Total</p>
                              <p className="text-lg font-semibold text-primary">
                                {user.bookingHistory.total}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
