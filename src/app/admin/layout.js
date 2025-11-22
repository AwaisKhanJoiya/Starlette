"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAdminAuthContext } from "@/context/AdminAuthContext";
import AdminErrorBoundary from "@/components/AdminErrorBoundary";
import {
  LayoutDashboard,
  Calendar,
  Users,
  LogOut,
  Settings,
  Menu,
  X,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAdminAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  // Skip auth check for login page
  const isLoginPage = pathname === "/admin/login";

  // Check if user is admin and redirect if not (except for login page)
  useEffect(() => {
    if (!isLoginPage && (!user || user.role !== "admin")) {
      router.push("/admin/login");
    }
  }, [user, router, isLoginPage, pathname]);

  // For login page, just render the children without layout
  if (isLoginPage) {
    return children;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-xl mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  // If user is not admin, don't render admin UI
  if (user && user.role !== "admin") {
    return null;
  }

  // Navigation items for sidebar
  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Classes",
      href: "/admin/classes",
      icon: <Calendar size={20} />,
    },
    {
      name: "Coaches",
      href: "/admin/coaches",
      icon: <Users size={20} />,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: <Users size={20} />,
    },
  ];

  return (
    <AdminErrorBoundary>
      <div className="h-screen flex overflow-hidden bg-gray-50">
        {/* Mobile sidebar toggle */}
        <div className="lg:hidden fixed top-4 left-4 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-gray-700 bg-background shadow-md"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed z-30 inset-y-0 left-0 w-64 transition-transform duration-300 ease-in-out bg-background border-r border-gray-200 lg:static lg:inset-0 lg:block`}
        >
          <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="px-4 py-6 border-b border-gray-200">
              <Link
                href="/admin"
                className="flex items-center space-x-2 text-primary font-bold text-xl"
              >
                <span>STARLETTE ADMIN</span>
              </Link>
            </div>

            {/* Nav items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium ${
                    pathname === item.href
                      ? "bg-primary text-dark-gray"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>

            {/* User info and logout */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.name || "Admin"}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <LogOut size={16} className="mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
        </div>
      </div>
    </AdminErrorBoundary>
  );
}
