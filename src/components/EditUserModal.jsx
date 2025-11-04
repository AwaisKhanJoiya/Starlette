import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import LoadingButton from "@/components/ui/LoadingButton";
import { toast } from "react-toastify";

// shadecn UI components (adjust the import paths if your project places them differently)
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";

export default function EditUserModal({
  user,
  fieldToEdit,
  onClose,
  onUpdate,
}) {
  const t = useTranslations("auth");
  const [formData, setFormData] = useState({
    [fieldToEdit]:
      fieldToEdit === "dateOfBirth" && user[fieldToEdit]
        ? new Date(user[fieldToEdit]).toISOString().split("T")[0]
        : user[fieldToEdit] || "",
  });

  const [loading, setLoading] = useState(false);

  // state to control the shadecn Popover for date picker
  const [showDobPicker, setShowDobPicker] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onUpdate(formData);
      onClose();
      toast.success("Profile updated successfully!");
    } catch (err) {
      const errorMessage =
        err.message && err.message !== "Failed to fetch"
          ? err.message
          : "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {fieldToEdit === "dateOfBirth" ? t("dob") : t(fieldToEdit)}
            </label>

            {fieldToEdit === "dateOfBirth" ? (
              <div>
                <Popover open={showDobPicker} onOpenChange={setShowDobPicker}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2 border border-[#000000] border-dashed rounded-none text-sm placeholder-dark-gray italic font-medium tracking-wider focus:outline-none"
                    >
                      {formData[fieldToEdit]
                        ? new Date(formData[fieldToEdit]).toLocaleDateString()
                        : t("dob")}
                    </button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0">
                    <CalendarUI
                      mode="single"
                      selected={
                        formData[fieldToEdit]
                          ? new Date(formData[fieldToEdit])
                          : undefined
                      }
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        if (!date) return;
                        const yyyy = date.getFullYear();
                        const mm = String(date.getMonth() + 1).padStart(2, "0");
                        const dd = String(date.getDate()).padStart(2, "0");
                        const dateStr = `${yyyy}-${mm}-${dd}`;
                        // reuse your existing handleChange shape
                        handleChange({
                          target: { name: fieldToEdit, value: dateStr },
                        });
                        setShowDobPicker(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <input
                type={
                  fieldToEdit === "email"
                    ? "email"
                    : fieldToEdit === "phoneNumber"
                    ? "tel"
                    : "text"
                }
                name={fieldToEdit}
                value={formData[fieldToEdit]}
                onChange={handleChange}
                // className="w-full border border-[#000000] border-dashed rounded-none px-3 py-2 focus:outline-none focus:border-solid"
                className="w-full px-4 py-2.5 border border-dark-gray border-dashed rounded-xl text-sm placeholder-dark-gray italic font-medium tracking-wider focus:outline-none focus:border-primary"
                required
              />
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              {t("cancelBtn")}
            </button>
            <LoadingButton
              type="submit"
              text={t("saveChanges")}
              loadingText={t("saving")}
              loading={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
