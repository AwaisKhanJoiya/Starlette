"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import TermsOfUse from "./TermsOfUse";

export default function StarletteRegistration() {
  const t = useTranslations("schedule");
  const [currentStep, setCurrentStep] = useState(1);
  const [showTerms, setShowTerms] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    lastName: "",
    firstName: "",
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
    agreeTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContinue = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleLogin = () => console.log("Login clicked");
  const handleCreateAccount = () => console.log("Create account:", formData);

  const StepCard = ({ stepNumber, children }) => (
    <div
      className={`bg-white border-y border-dashed border-black p-4 w-full max-w-sm mx-auto lg:mx-0 ${
        stepNumber % 2 === 0
          ? "border-x border-black border-dashed"
          : "border-0"
      }`}
    >
      <div className="mb-8 flex flex-col items-center">
        <h2 className="text-xs font-medium text-[#000000] mb-2">
          STEP {stepNumber}
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
      {children}
    </div>
  );

  // Step contents simplified for brevity
  const Step1Content = () => (
    <div className="space-y-4">
      <input
        type="email"
        name="email"
        placeholder={t("form.step1.email")}
        value={formData.email}
        onChange={handleInputChange}
        className="w-full px-4 py-2.5 border border-black border-dashed rounded-xl text-sm placeholder-[#000000] italic font-medium tracking-wider focus:outline-none focus:border-pink-300"
      />
      <input
        type="password"
        name="password"
        placeholder={t("form.step1.password")}
        value={formData.password}
        onChange={handleInputChange}
        className="w-full px-4 py-2.5 border border-black border-dashed rounded-xl text-sm placeholder-[#000000] italic font-medium tracking-wider focus:outline-none focus:border-primary"
      />

      <div className="mt-8 space-y-3">
        <button
          onClick={handleLogin}
          className="w-full px-4 py-2.5 text-sm text-[#000000] italic font-semibold tracking-wider focus:outline-none"
        >
          {t("form.step1.login")}
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-[#000000]"></div>
          <span className="px-3 text-sm text-[#000000]">or</span>
          <div className="flex-grow h-px bg-[#000000]"></div>
        </div>

        <button
          onClick={() => setCurrentStep(2)}
          className="w-full px-4 py-2.5 rounded-xl text-sm text-[#000000] bg-primary uppercase tracking-wider relative"
        >
          {t("form.step1.createAccount")}
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
            ➝
          </span>
        </button>
      </div>
    </div>
  );

  const Step2Content = () => (
    <div className="space-y-4">
      <input
        type="email"
        name="email"
        placeholder={t("form.step2.email")}
        value={formData.email}
        onChange={handleInputChange}
        className="w-full px-4 py-2.5 border border-black border-dashed rounded-xl text-sm placeholder-[#000000] italic font-medium tracking-wider focus:outline-none focus:border-primary"
      />
      <input
        type="password"
        name="password"
        placeholder={t("form.step2.password")}
        value={formData.password}
        onChange={handleInputChange}
        className="w-full px-4 py-2.5 border border-black border-dashed rounded-xl text-sm placeholder-[#000000] italic font-medium tracking-wider focus:outline-none focus:border-primary"
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder={t("form.step2.confirmPassword")}
        value={formData.confirmPassword}
        onChange={handleInputChange}
        className="w-full px-4 py-2.5 border border-black border-dashed rounded-xl text-sm placeholder-[#000000] italic font-medium tracking-wider focus:outline-none focus:border-primary"
      />

      <div className="mt-8">
        <button
          onClick={handleContinue}
          className="w-full px-4 py-2.5 rounded-xl text-sm text-[#000000] bg-primary uppercase tracking-wider relative"
        >
          {t("form.step2.continue")}
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
            ➝
          </span>
        </button>
      </div>
    </div>
  );

  const Step3Content = () => (
    <div className="space-y-4">
      <input
        type="text"
        name="lastName"
        placeholder={t("form.step3.lastName")}
        value={formData.lastName}
        onChange={handleInputChange}
        className="w-full px-4 py-2.5 border border-black border-dashed rounded-xl text-sm placeholder-[#000000] italic font-medium tracking-wider focus:outline-none focus:border-primary"
      />
      <input
        type="text"
        name="firstName"
        placeholder={t("form.step3.firstName")}
        value={formData.firstName}
        onChange={handleInputChange}
        className="w-full px-4 py-2.5 border border-black border-dashed rounded-xl text-sm placeholder-[#000000] italic font-medium tracking-wider focus:outline-none focus:border-primary"
      />
      <input
        type="date"
        name="dateOfBirth"
        placeholder={t("form.step3.dateOfBirth")}
        value={formData.dateOfBirth}
        onChange={handleInputChange}
        className="w-full px-4 py-2.5 border border-black border-dashed rounded-xl text-sm placeholder-[#000000] italic font-medium tracking-wider focus:outline-none focus:border-primary"
      />
      <input
        type="tel"
        name="phoneNumber"
        placeholder={t("form.step3.phoneNumber")}
        value={formData.phoneNumber}
        onChange={handleInputChange}
        className="w-full px-4 py-2.5 border border-black border-dashed rounded-xl text-sm placeholder-[#000000] italic font-medium tracking-wider focus:outline-none focus:border-primary"
      />
      <input
        type="text"
        name="address"
        placeholder={t("form.step3.address")}
        value={formData.address}
        onChange={handleInputChange}
        className="w-full px-4 py-2.5 border border-black border-dashed rounded-xl text-sm placeholder-[#000000] italic font-medium tracking-wider focus:outline-none focus:border-primary"
      />

      <div className="mt-6">
        <label className="flex items-center text-sm text-[#000000] font-medium italic">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleInputChange}
            className="mr-2 w-4 h-4 text-primary border-black rounded focus:ring-primary"
          />
          {t("form.step3.agreeTerms1")}
          <span
            onClick={() => setShowTerms(true)}
            className="text-[#FABDCE] font-semibold ml-1 underline cursor-pointer"
          >
            {t("form.step3.agreeTerms2")}
          </span>
        </label>
      </div>

      <div className="mt-8">
        <button
          onClick={handleCreateAccount}
          className="w-full px-4 py-2.5 rounded-xl text-sm text-[#000000] bg-primary uppercase tracking-wider relative"
        >
          {t("form.step3.submit")}
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
            ➝
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Mobile view */}
      <div className="lg:hidden">
        <StepCard stepNumber={currentStep}>
          {currentStep === 1 && <Step1Content />}
          {currentStep === 2 && <Step2Content />}
          {currentStep === 3 && <Step3Content />}
        </StepCard>

        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {[1, 2, 3].map((step) => (
            <button
              key={step}
              onClick={() => setCurrentStep(step)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentStep === step ? "bg-pink-300" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden lg:flex lg:max-w-6xl gap-6">
        <StepCard stepNumber={1}>
          <Step1Content />
        </StepCard>
        <StepCard stepNumber={2}>
          <Step2Content />
        </StepCard>
        <StepCard stepNumber={3}>
          <Step3Content />
        </StepCard>
      </div>

      {/* Terms Section below cards */}
      {showTerms && (
        <div className="w-full max-w-6xl mt-8">
          <TermsOfUse onClose={() => setShowTerms(false)} />
        </div>
      )}
    </div>
  );
}
