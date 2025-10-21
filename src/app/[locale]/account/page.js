import React from "react";
import Image from "next/image";
import AccountDashboard from "@/components/AccountDashboard";

const AccountPage = () => {
  return (
    <>
      <div className="min-h-screen bg-white text-dark-gray px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10 flex justify-center items-center">
          <Image
            src="/schedule-logo.jpg"
            alt="Account"
            width={600}
            height={600}
            className="w-40 object-contain"
          />
        </div>

        <div >
          <AccountDashboard />
        </div>
      </div>
    </>
  );
};

export default AccountPage;
