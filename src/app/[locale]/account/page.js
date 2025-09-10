import React from "react";
import Image from "next/image";
import AccountDashboard from "@/components/AccountDashboard";
import Footer from "@/components/Footer";

const AccountPage = () => {
  return (
    <>
      <div className="min-h-screen bg-white text-black px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10 flex justify-center items-center">
          <Image
            src="/schedule-logo.jpg"
            alt="Account"
            width={400}
            height={400}
            className="w-40"
          />
        </div>

        <div>
          <AccountDashboard />
        </div>
      </div>
    </>
  );
};

export default AccountPage;
