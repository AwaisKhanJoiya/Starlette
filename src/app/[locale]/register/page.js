"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    agreedToTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration data:", formData);
    // Add registration logic here

    // Redirect to schedule after registration
    // router.push("./schedule");
  };

  return (
    <>
      <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white p-6">
          <div className="mb-8 flex flex-col items-center">
            <h2 className="text-xs font-medium text-[#000000] mb-2">
              {t("registrationStep")} {step}/3
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

          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-6">
              <input
                type="text"
                name="firstName"
                placeholder={t("firstName")}
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-black border-dashed rounded-xl text-sm placeholder-[#000000] italic font-medium tracking-wider focus:outline-none focus:border-pink-300"
              />

              <input
                type="text"
                name="lastName"
                placeholder={t("lastName")}
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-black border-dashed rounded-xl text-sm placeholder-[#000000] italic font-medium tracking-wider focus:outline-none focus:border-pink-300"
              />

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
                className="w-full px-4 py-2.5 border border-black border-dashed rounded-xl text-sm placeholder-[#000000] italic font-medium tracking-wider focus:outline-none focus:border-pink-300"
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder={t("confirmPassword")}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-black border-dashed rounded-xl text-sm placeholder-[#000000] italic font-medium tracking-wider focus:outline-none focus:border-pink-300"
              />

              <button
                type="submit"
                className="w-full px-4 py-2.5 text-sm text-[#000000] bg-primary rounded-xl uppercase tracking-wider focus:outline-none relative"
              >
                {t("next")}
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  ➝
                </span>
              </button>

              <div className="text-center mt-4">
                <Link
                  href="./login"
                  className="text-sm underline text-[#000000]"
                >
                  {t("alreadyHaveAccount")}
                </Link>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleNextStep} className="space-y-6">
              <input
                type="tel"
                name="phoneNumber"
                placeholder={t("phoneNumber")}
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-black border-dashed rounded-xl text-sm placeholder-[#000000] italic font-medium tracking-wider focus:outline-none focus:border-pink-300"
              />

              <input
                type="text"
                name="address"
                placeholder={t("address")}
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-black border-dashed rounded-xl text-sm placeholder-[#000000] italic font-medium tracking-wider focus:outline-none focus:border-pink-300"
              />

              <input
                type="text"
                name="city"
                placeholder={t("city")}
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-black border-dashed rounded-xl text-sm placeholder-[#000000] italic font-medium tracking-wider focus:outline-none focus:border-pink-300"
              />

              <input
                type="text"
                name="zipCode"
                placeholder={t("zipCode")}
                value={formData.zipCode}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-black border-dashed rounded-xl text-sm placeholder-[#000000] italic font-medium tracking-wider focus:outline-none focus:border-pink-300"
              />

              <input
                type="text"
                name="country"
                placeholder={t("country")}
                value={formData.country}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-black border-dashed rounded-xl text-sm placeholder-[#000000] italic font-medium tracking-wider focus:outline-none focus:border-pink-300"
              />

              <div className="flex justify-between space-x-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-1/2 px-4 py-2.5 text-sm text-[#000000] bg-gray-200 rounded-xl uppercase tracking-wider focus:outline-none relative"
                >
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    ←
                  </span>
                  {t("back")}
                </button>

                <button
                  type="submit"
                  className="w-1/2 px-4 py-2.5 text-sm text-[#000000] bg-primary rounded-xl uppercase tracking-wider focus:outline-none relative"
                >
                  {t("next")}
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    ➝
                  </span>
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border border-black border-dashed rounded-xl p-4">
                <div className="flex items-start mb-4">
                  <input
                    type="checkbox"
                    id="terms"
                    name="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onChange={handleInputChange}
                    required
                    className="mr-2 mt-1"
                  />
                  <label htmlFor="terms" className="text-sm">
                    {t("termsAgreement")}
                  </label>
                </div>

                <div className="h-40 overflow-auto border border-gray-300 p-2 text-xs">
                  {t("termsContent")}
                </div>
              </div>

              <div className="flex justify-between space-x-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-1/2 px-4 py-2.5 text-sm text-[#000000] bg-gray-200 rounded-xl uppercase tracking-wider focus:outline-none relative"
                >
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    ←
                  </span>
                  {t("back")}
                </button>

                <button
                  type="submit"
                  disabled={!formData.agreedToTerms}
                  className={`w-1/2 px-4 py-2.5 text-sm text-[#000000] ${
                    formData.agreedToTerms ? "bg-primary" : "bg-gray-300"
                  } rounded-xl uppercase tracking-wider focus:outline-none relative`}
                >
                  {t("register")}
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    ➝
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
