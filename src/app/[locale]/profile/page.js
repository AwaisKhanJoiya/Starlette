"use client";

import React from "react";
import { useTranslations } from "next-intl";
import EnrolledClassesList from "@/components/EnrolledClassesList";
import ProtectedPage from "@/components/ProtectedPage";

export default function ProfilePage() {
  const t = useTranslations("profile");

  return (
    <ProtectedPage>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center sm:text-left">
            {t("my_classes")}
          </h1>

          <EnrolledClassesList />
        </div>
      </div>
    </ProtectedPage>
  );
}
