"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { useUserAuthContext } from "@/context/UserAuthContext";

const ClassHistory = () => {
  const t = useTranslations("account");
  const { getAuthToken } = useUserAuthContext();
  const [pastClasses, setPastClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPastClasses = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/classes/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch class history");
        }

        const data = await response.json();
        setPastClasses(data.classes || []);
      } catch (err) {
        console.error("Error fetching class history:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPastClasses();
  }, [getAuthToken]);

  return (
    <div className="space-y-4">
      <div className="py-6">
        <h3 className="font-semibold mb-3">{t("details.pastClasses")}</h3>

        {loading && (
          <p className="text-sm text-gray-500">
            {t("loading") || "Loading..."}
          </p>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && !error && pastClasses.length === 0 && (
          <p className="text-sm text-gray-500">
            {t("noPastClasses") || "No past classes found"}
          </p>
        )}

        {!loading && !error && pastClasses.length > 0 && (
          <div className="border-t border-b border-[#000000] divide-y divide-[#000000] overflow-hidden">
            {pastClasses.map((classItem, i) => {
              const statusKey = classItem.status;
              const badgeClass =
                statusKey === "missed"
                  ? " text-[#FABDCE] italic font-semibold"
                  : " text-dark-gray";

              return (
                <div
                  key={classItem.id || i}
                  className="py-3 px-4 grid grid-cols-2 text-black font-semibold md:grid-cols-6 gap-3 items-center hover:bg-gray-50 transition"
                >
                  <div className="text-xs md:text-sm">{classItem.date}</div>

                  <div className="text-xs md:text-sm">{classItem.time}</div>

                  <div className="text-xs md:text-sm">
                    {classItem.classType}
                  </div>

                  <div className="text-xs md:text-sm">
                    {classItem.instructor}
                  </div>

                  <div className="text-xs md:text-sm"></div>

                  <div className="flex justify-end">
                    <span className={`text-xs px-2 py-1 ${badgeClass}`}>
                      {t(`status.${statusKey}`) || statusKey}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassHistory;
