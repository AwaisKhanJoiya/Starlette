"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import LoadingButton from "@/components/ui/LoadingButton";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const { register, error: authError, isLoading } = useAuth();
  const [formError, setFormError] = useState(null);
  
  const initialFormData = {
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
  };
  
  const {
    currentStep,
    formData,
    nextStep,
    prevStep,
    handleChange,
    isLastStep
  } = useMultiStepForm(3, initialFormData);

  // Form validation for each step
  const validateStep = (stepNumber) => {
    setFormError(null);
    
    switch(stepNumber) {
      case 1:
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
          setFormError(t("registerRequiredFields"));
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setFormError(t("passwordsDoNotMatch"));
          return false;
        }
        if (formData.password.length < 8) {
          setFormError(t("passwordTooShort"));
          return false;
        }
        return true;
        
      case 2:
        if (!formData.phoneNumber || !formData.address || !formData.city || !formData.zipCode || !formData.country) {
          setFormError(t("registerAddressRequired"));
          return false;
        }
        return true;
        
      case 3:
        if (!formData.agreedToTerms) {
          setFormError(t("termsRequired"));
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      nextStep();
    }
  };

  const handlePrevStep = () => {
    prevStep();
    setFormError(null); // Clear any errors when going back
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }
    
    try {
      await register(formData);
      // Redirect happens in the useAuth hook after successful registration
    } catch (err) {
      // Error handling is done in the useAuth hook
      console.error("Registration error:", err);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white text-dark-gray flex flex-col items-center justify-center py-12 px-4 mt-16">
        <div className="w-full max-w-md bg-white border-y border-dashed border-dark-gray p-6">
          <div className="mb-8 flex flex-col items-center">
            <h2 className="text-xs font-medium text-dark-gray mb-2">
              {t("registrationStep")} {currentStep}/3
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

          {formError && (
            <div className="text-red-500 text-sm mb-4">{formError}</div>
          )}
          {authError && (
            <div className="text-red-500 text-sm mb-4">{authError}</div>
          )}
          
          {currentStep === 1 && (
            <form onSubmit={handleNextStep} className="space-y-6">
              <input
                type="text"
                name="firstName"
                placeholder={t("firstName")}
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-dark-gray border-dashed rounded-xl text-sm placeholder-dark-gray italic font-medium tracking-wider focus:outline-none focus:border-primary"
              />
              
              <input
                type="text"
                name="lastName"
                placeholder={t("lastName")}
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-dark-gray border-dashed rounded-xl text-sm placeholder-dark-gray italic font-medium tracking-wider focus:outline-none focus:border-primary"
              />
              
              <input
                type="email"
                name="email"
                placeholder={t("email")}
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-dark-gray border-dashed rounded-xl text-sm placeholder-dark-gray italic font-medium tracking-wider focus:outline-none focus:border-primary"
              />
              
              <input
                type="password"
                name="password"
                placeholder={t("password")}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-dark-gray border-dashed rounded-xl text-sm placeholder-dark-gray italic font-medium tracking-wider focus:outline-none focus:border-primary"
              />
              
              <input
                type="password"
                name="confirmPassword"
                placeholder={t("confirmPassword")}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-dark-gray border-dashed rounded-xl text-sm placeholder-dark-gray italic font-medium tracking-wider focus:outline-none focus:border-primary"
              />

              <LoadingButton
                type="submit"
                text={t("next")}
                loadingText={t("loading")}
                isLoading={isLoading}
                disabled={isLoading}
                className="w-full"
                icon="➝"
                variant="primary"
              />

              <div className="text-center mt-4">
                <Link href="./login" className="text-sm underline text-dark-gray">
                  {t("alreadyHaveAccount")}
                </Link>
              </div>
            </form>
          )}

          {currentStep === 2 && (
            <form onSubmit={handleNextStep} className="space-y-6">
              <input
                type="tel"
                name="phoneNumber"
                placeholder={t("phoneNumber")}
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-dark-gray border-dashed rounded-xl text-sm placeholder-dark-gray italic font-medium tracking-wider focus:outline-none focus:border-primary"
              />
              
              <input
                type="text"
                name="address"
                placeholder={t("address")}
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-dark-gray border-dashed rounded-xl text-sm placeholder-dark-gray italic font-medium tracking-wider focus:outline-none focus:border-primary"
              />
              
              <input
                type="text"
                name="city"
                placeholder={t("city")}
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-dark-gray border-dashed rounded-xl text-sm placeholder-dark-gray italic font-medium tracking-wider focus:outline-none focus:border-primary"
              />
              
              <input
                type="text"
                name="zipCode"
                placeholder={t("zipCode")}
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-dark-gray border-dashed rounded-xl text-sm placeholder-dark-gray italic font-medium tracking-wider focus:outline-none focus:border-primary"
              />
              
              <input
                type="text"
                name="country"
                placeholder={t("country")}
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-dark-gray border-dashed rounded-xl text-sm placeholder-dark-gray italic font-medium tracking-wider focus:outline-none focus:border-primary"
              />

              <div className="flex justify-between space-x-4">
                <LoadingButton
                  type="button"
                  onClick={handlePrevStep}
                  text={t("back")}
                  className="w-1/2"
                  variant="gray"
                  icon="←"
                />
                
                <LoadingButton
                  type="submit"
                  text={t("next")}
                  loadingText={t("loading")}
                  isLoading={isLoading}
                  disabled={isLoading}
                  className="w-1/2"
                  variant="primary"
                  icon="➝"
                />
              </div>
            </form>
          )}

          {currentStep === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border border-dark-gray border-dashed rounded-xl p-4">
                <div className="flex items-start mb-4">
                  <input
                    type="checkbox"
                    id="terms"
                    name="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onChange={handleChange}
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
                <LoadingButton
                  type="button"
                  onClick={handlePrevStep}
                  text={t("back")}
                  className="w-1/2"
                  variant="gray"
                  icon="←"
                />
                
                <LoadingButton
                  type="submit"
                  text={t("register")}
                  loadingText={t("registering")}
                  isLoading={isLoading}
                  disabled={isLoading || !formData.agreedToTerms}
                  className="w-1/2"
                  variant={formData.agreedToTerms ? "primary" : "gray"}
                  icon="➝"
                />
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}