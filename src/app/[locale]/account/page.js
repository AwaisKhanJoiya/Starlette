import Navbar from "@/components/Navbar";
import React from "react";
import Image from "next/image";
import AccountDashboard from "@/components/AccountDashboard";
import Footer from "@/components/Footer";

const AccountPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-black max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-12">
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
      <Footer />
    </>
  );
};

export default AccountPage;
