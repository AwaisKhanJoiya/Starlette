"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart,
  Calendar,
  Users,
  Clock,
  ArrowUpRight,
  TrendingUp,
  BarChart2,
  Activity,
} from "lucide-react";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalClasses: 0,
    activeClasses: 0,
    totalUsers: 0,
    recentEnrollments: 0,
    upcomingClasses: [],
    analytics: {
      enrollmentTrend: "+12%",
      avgClassSize: "18",
      mostPopularClass: "Yoga Basics",
    },
  });

  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // This would be replaced with an actual API call
        // const response = await fetch('/api/admin/dashboard');
        // const data = await response.json();

        // Simulate API response
        setTimeout(() => {
          setDashboardData({
            totalClasses: 24,
            activeClasses: 16,
            totalUsers: 156,
            recentEnrollments: 32,
            upcomingClasses: [
              {
                id: "1",
                title: "Morning Yoga",
                instructor: "Sarah Johnson",
                date: "2023-11-12",
                time: "08:00",
                location: "Studio A",
                enrolledCount: 12,
                capacity: 20,
              },
              {
                id: "2",
                title: "HIIT Workout",
                instructor: "Mike Thompson",
                date: "2023-11-12",
                time: "10:00",
                location: "Gym Floor",
                enrolledCount: 15,
                capacity: 15,
              },
              {
                id: "3",
                title: "Pilates for Beginners",
                instructor: "Emma Davis",
                date: "2023-11-13",
                time: "09:30",
                location: "Studio B",
                enrolledCount: 8,
                capacity: 12,
              },
            ],
            analytics: {
              enrollmentTrend: "+12%",
              avgClassSize: "18",
              mostPopularClass: "Yoga Basics",
            },
          });
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-solid border-primary border-r-transparent rounded-full"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-background rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Classes</p>
              <p className="text-2xl font-bold">{dashboardData.totalClasses}</p>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-500">
              <span className="text-green-500 font-medium">
                {dashboardData.activeClasses}
              </span>{" "}
              active classes
            </p>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Users</p>
              <p className="text-2xl font-bold">{dashboardData.totalUsers}</p>
            </div>
            <div className="rounded-full bg-blue-50 p-3">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-500">
              <span className="text-green-500 font-medium">+12%</span> from last
              month
            </p>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Recent Enrollments
              </p>
              <p className="text-2xl font-bold">
                {dashboardData.recentEnrollments}
              </p>
            </div>
            <div className="rounded-full bg-green-50 p-3">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-500">
              <span className="text-green-500 font-medium">+5</span> this week
            </p>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Avg. Class Size
              </p>
              <p className="text-2xl font-bold">
                {dashboardData.analytics.avgClassSize}
              </p>
            </div>
            <div className="rounded-full bg-purple-50 p-3">
              <BarChart className="h-6 w-6 text-purple-500" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-500">
              <span className="text-green-500 font-medium">+2</span> from last
              month
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Classes */}
        <div className="lg:col-span-2 bg-background rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Upcoming Classes
              </h2>
              <Link
                href="/admin/classes"
                className="text-primary text-sm font-medium hover:underline flex items-center"
              >
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {dashboardData.upcomingClasses.map((cls) => (
              <div key={cls.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <Link
                      href={`/admin/classes/${cls.id}`}
                      className="text-base font-medium text-gray-800 hover:text-primary"
                    >
                      {cls.title}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      Instructor: {cls.instructor}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">
                      {formatDate(cls.date)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {cls.time} • {cls.location}
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    {cls.enrolledCount}/{cls.capacity}
                  </div>

                  <Link
                    href={`/admin/classes/${cls.id}`}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="bg-background rounded-lg shadow-md">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Quick Analytics
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-50 p-2 mr-3">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  </div>
                  <span className="text-sm font-medium">Enrollment Trend</span>
                </div>
                <span className="text-green-500 font-semibold">
                  {dashboardData.analytics.enrollmentTrend}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="rounded-full bg-amber-50 p-2 mr-3">
                    <BarChart2 className="h-5 w-5 text-amber-500" />
                  </div>
                  <span className="text-sm font-medium">Avg Class Size</span>
                </div>
                <span className="font-semibold">
                  {dashboardData.analytics.avgClassSize}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="rounded-full bg-purple-50 p-2 mr-3">
                    <Activity className="h-5 w-5 text-purple-500" />
                  </div>
                  <span className="text-sm font-medium">
                    Most Popular Class
                  </span>
                </div>
                <span className="font-semibold text-sm">
                  {dashboardData.analytics.mostPopularClass}
                </span>
              </div>
            </div>

            <hr className="border-gray-200" />

            <Link
              href="/admin/analytics"
              className="block text-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 rounded-md"
            >
              View Full Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
