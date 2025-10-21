"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { useUserAuthContext } from "@/context/UserAuthContext";

const UserProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useUserAuthContext();
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  // Handle profile navigation
  const goToProfile = () => {
    router.push("/account");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User icon button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="User menu"
      >
        <Image
          src="/user-placeholder.svg"
          alt="User"
          width={32}
          height={32}
          className="rounded-full"
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 py-1 bg-background border border-gray-200 rounded-md shadow-lg z-50">
          {/* User info */}
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>

          {/* Menu items */}
          <button
            onClick={goToProfile}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <UserIcon size={14} className="mr-2" />
            My Profile
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <LogOut size={14} className="mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
