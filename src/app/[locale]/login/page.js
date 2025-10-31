"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import LoadingButton from "@/components/ui/LoadingButton";

export default function LoginPage() {
  const t = useTranslations("auth");
  const { login, error: authError, isLoading } = useAuth();
  const [formError, setFormError] = useState(null);

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
    // Clear error when user starts typing again
    if (formError) setFormError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      setFormError(t("loginRequiredFields"));
      return;
    }

    try {
      await login(formData);
      // Redirect happens in the useAuth hook after successful login
    } catch (err) {
      // Error handling is done in the useAuth hook
      console.error("Login error:", err);
    }
  };

  return (
    <>
      <div className="min-h-screen  text-dark-gray flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-md  p-6">
          <div className="mb-8 flex flex-col items-center">
            <h2 className="text-xs font-medium text-dark-gray mb-2">
              {t("loginStep")}
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
              {formError && (
                <div className="text-red-500 text-sm mb-4">{formError}</div>
              )}
              {authError && (
                <div className="text-red-500 text-sm mb-4">{authError}</div>
              )}

              <LoadingButton
                type="submit"
                text={t("login")}
                loadingText={t("loggingIn")}
                isLoading={isLoading}
                disabled={isLoading}
                className="w-full"
                icon="➝"
                variant="primary"
              />

              <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-[#000000]"></div>
                <span className="px-3 text-sm text-dark-gray">{t("or")}</span>
                <div className="flex-grow h-px bg-[#000000]"></div>
              </div>

              <Link
                href="./register"
                className="block w-full text-center px-4 py-2.5 text-sm text-dark-gray bg-primary rounded-xl uppercase tracking-wider relative"
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
