"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Users, DollarSign } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    classesCount: 0,
    upcomingClassesCount: 0,
    enrollmentsCount: 0,
  });

  // Fetch dashboard stats
  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/classes");
        if (response.ok) {
          const data = await response.json();

          // Calculate stats based on the classes data
          const now = new Date();
          const upcomingClasses = data.classes.filter(
            (c) => new Date(c.startDate) > now
          );

          setStats({
            classesCount: data.pagination.total || 0,
            upcomingClassesCount: upcomingClasses.length,
            enrollmentsCount: data.classes.reduce(
              (acc, c) => acc + c.enrolledStudents.length,
              0
            ),
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    }

    fetchStats();
  }, []);

  // Quick links for admin tasks
  const quickLinks = [
    {
      title: "Create New Class",
      description: "Add a new class to the schedule",
      href: "/admin/classes/new",
      color: "bg-green-100",
    },
    {
      title: "Manage Users",
      description: "View and manage user accounts",
      href: "/admin/users",
      color: "bg-blue-100",
    },
    {
      title: "View Schedule",
      description: "See the full class schedule",
      href: "/admin/classes",
      color: "bg-purple-100",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Classes"
          value={stats.classesCount}
          icon={<Calendar className="text-primary" size={24} />}
        />
        <StatsCard
          title="Upcoming Classes"
          value={stats.upcomingClassesCount}
          icon={<Calendar className="text-green-600" size={24} />}
        />
        <StatsCard
          title="Total Enrollments"
          value={stats.enrollmentsCount}
          icon={<Users className="text-blue-600" size={24} />}
        />
      </div>

      {/* Quick Links */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={`${link.color} p-6 rounded-xl hover:shadow-md transition-shadow`}
            >
              <h3 className="font-semibold text-lg mb-2">{link.title}</h3>
              <p className="text-sm text-gray-600">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="space-y-4">
            {[
              "New class 'Full Body' was created",
              "User Dana Toledano enrolled in 'Full Body'",
              "Class 'Pilates' was updated",
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center py-2 border-b border-gray-100 last:border-b-0"
              >
                <div className="w-2 h-2 rounded-full bg-primary mr-3"></div>
                <p className="text-sm">{activity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats card component
function StatsCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-center">
        <div className="mr-4">{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
