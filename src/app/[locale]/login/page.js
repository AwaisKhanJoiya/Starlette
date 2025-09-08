"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login with:", formData);
    // Add login logic here

    // Redirect to schedule after login
    // router.push("./schedule");
  };

  return (
    <>
      <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white p-6">
          <div className="mb-8 flex flex-col items-center">
            <h2 className="text-xs font-medium text-[#000000] mb-2">
              {t("loginStep")}
            </h2>
            <div className="flex items-center justify-center mb-2">
              <Image
                src="/schedule-logo.jpg"
                alt="starlette"
                width={200}
                height={130}
                className="object-cover"
              />
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="email"
              name="email"
              placeholder={t("email")}
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2.5 border border-black border-dashed rounded-xl text-sm placeholder-[#000000] italic font-medium tracking-wider focus:outline-none focus:border-pink-300"
            />

            <input
              type="password"
              name="password"
              placeholder={t("password")}
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2.5 border border-black border-dashed rounded-xl text-sm placeholder-[#000000] italic font-medium tracking-wider focus:outline-none focus:border-primary"
            />

            <div className="mt-8 space-y-4">
              <button
                type="submit"
                className="w-full px-4 py-2.5 text-sm text-[#000000] bg-primary rounded-xl uppercase tracking-wider focus:outline-none relative"
              >
                {t("login")}
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  ➝
                </span>
              </button>

              <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-[#000000]"></div>
                <span className="px-3 text-sm text-[#000000]">{t("or")}</span>
                <div className="flex-grow h-px bg-[#000000]"></div>
              </div>

              <Link
                href="./register"
                className="block w-full text-center px-4 py-2.5 text-sm text-[#000000] bg-primary rounded-xl uppercase tracking-wider relative"
              >
                {t("createAccount")}
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  ➝
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
