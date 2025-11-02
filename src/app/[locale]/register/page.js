"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "@/app/phoneInput.css";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import LoadingButton from "@/components/ui/LoadingButton";
import TermsOfUseDialog from "@/components/TermsOfUseDialog";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const { register, error: authError, isLoading } = useAuth();
  const [formError, setFormError] = useState(null);
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [showDobPicker, setShowDobPicker] = useState(false);

  const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneCountryCode: "+1",
    phoneNumber: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    dob: "",
    language: "",
    gender: "",
    agreedToTerms: false,
  };

  const {
    currentStep,
    formData,
    nextStep,
    prevStep,
    handleChange,
    isLastStep,
  } = useMultiStepForm(2, initialFormData);

  // Form validation for each step
  const validateStep = (stepNumber) => {
    setFormError(null);

    switch (stepNumber) {
      case 1:
        if (
          !formData.firstName ||
          !formData.lastName ||
          !formData.email ||
          !formData.password
        ) {
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
        if (
          !formData.phoneNumber ||
          !formData.address ||
          !formData.city ||
          !formData.zipCode ||
          !formData.country
        ) {
          setFormError(t("registerAddressRequired"));
          return false;
        }
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
      <TermsOfUseDialog
        open={termsDialogOpen}
        onOpenChange={setTermsDialogOpen}
      />

      <div className="min-h-screen bg-background text-dark-gray flex flex-col items-center justify-center py-12 px-4 mt-16">
        <div className="w-full max-w-md bg-background border-y border-dashed border-dark-gray p-6">
          <div className="mb-8 flex flex-col items-center">
            <h2 className="text-xs font-medium text-dark-gray mb-2">
              {t("registrationStep")} {currentStep}/2
            </h2>
            <div className="flex items-center justify-center my-2">
              <Image
                src="/starlette-logo.png"
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
                className="w-full px-4 py-2.5 border border-dark-gray border-dashed  rounded-xl text-sm placeholder-dark-gray italic font-medium tracking-wider focus:outline-none focus:border-primary"
              />

              {/* Date of birth (Shadecn Calendar) */}
              <div>
                <Popover open={showDobPicker} onOpenChange={setShowDobPicker}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={`w-full text-left px-4 py-2.5 bg-white border border-dark-gray border-dashed rounded-xl text-sm font-medium tracking-wider focus:outline-none ${
                        formData.dob ? "text-black" : "text-dark-gray italic"
                      }`}
                    >
                      {formData.dob
                        ? new Date(formData.dob).toLocaleDateString()
                        : t("dob")}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarUI
                      mode="single"
                      selected={
                        formData.dob ? new Date(formData.dob) : undefined
                      }
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        if (!date) return;
                        const yyyy = date.getFullYear();
                        const mm = String(date.getMonth() + 1).padStart(2, "0");
                        const dd = String(date.getDate()).padStart(2, "0");
                        const dateStr = `${yyyy}-${mm}-${dd}`;
                        handleChange({
                          target: { name: "dob", value: dateStr },
                        });
                        setShowDobPicker(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Language and Gender selectors using Shadecn-style DropdownMenu */}
              <div className="flex space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={`w-1/2 text-left px-4 py-2.5 border border-dark-gray bg-white border-dashed rounded-xl text-sm font-medium tracking-wider focus:outline-none ${
                        formData.language
                          ? "text-black"
                          : "text-dark-gray italic"
                      }`}
                    >
                      {formData.language
                        ? formData.language === "en"
                          ? "English"
                          : formData.language === "fr"
                          ? "Français"
                          : formData.language === "he"
                          ? "עברית"
                          : formData.language
                        : t("selectLanguage") || "Select language"}
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        handleChange({
                          target: { name: "language", value: "en" },
                        })
                      }
                    >
                      English
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleChange({
                          target: { name: "language", value: "fr" },
                        })
                      }
                    >
                      Français
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleChange({
                          target: { name: "language", value: "he" },
                        })
                      }
                    >
                      עברית
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={`w-1/2 text-left px-4 py-2.5 border border-dark-gray bg-white border-dashed rounded-xl text-sm font-medium tracking-wider focus:outline-none ${
                        formData.gender ? "text-black" : "text-dark-gray italic"
                      }`}
                    >
                      {formData.gender
                        ? formData.gender === "male"
                          ? t("male") || "Male"
                          : formData.gender === "female"
                          ? t("female") || "Female"
                          : t("other") || "Other"
                        : t("selectGender") || "Select gender"}
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        handleChange({
                          target: { name: "gender", value: "male" },
                        })
                      }
                    >
                      {t("male") || "Male"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleChange({
                          target: { name: "gender", value: "female" },
                        })
                      }
                    >
                      {t("female") || "Female"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleChange({
                          target: { name: "gender", value: "other" },
                        })
                      }
                    >
                      {t("other") || "Other"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

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
                <Link
                  href="./login"
                  className="text-sm underline text-dark-gray"
                >
                  {t("alreadyHaveAccount")}
                </Link>
              </div>
            </form>
          )}

          {currentStep === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <PhoneInput
                country={"us"}
                value={formData.phoneNumber}
                onChange={(phone, data) => {
                  handleChange({
                    target: {
                      name: "phoneNumber",
                      value: phone,
                    },
                  });
                  handleChange({
                    target: {
                      name: "phoneCountryCode",
                      value: `+${data.dialCode}`,
                    },
                  });
                }}
                containerClass="w-full"
                inputClass="w-full px-4 py-2.5 border border-dark-gray border-dashed rounded-xl text-sm placeholder-dark-gray italic font-medium tracking-wider focus:outline-none focus:border-primary"
                buttonClass="border border-dark-gray border-dashed rounded-l-xl"
                placeholder={t("phoneNumber")}
                enableSearch
                searchPlaceholder={t("searchCountry")}
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

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="terms"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="terms" className="text-sm text-dark-gray">
                  {t("iHaveRead")}{" "}
                  <button
                    type="button"
                    onClick={() => setTermsDialogOpen(true)}
                    className="text-primary hover:underline"
                  >
                    {t("termsOfUse")}
                  </button>
                </label>
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
