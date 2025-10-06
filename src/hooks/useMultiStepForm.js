"use client";

import { useState } from "react";

export function useMultiStepForm(steps, initialData = {}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialData);

  // Go to next step
  const nextStep = () => {
    if (currentStep < steps) {
      setCurrentStep(currentStep + 1);
      return true;
    }
    return false;
  };

  // Go to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      return true;
    }
    return false;
  };

  // Reset form to first step
  const resetForm = (newData = initialData) => {
    setCurrentStep(1);
    setFormData(newData);
  };

  // Update form data
  const updateFormData = (newData) => {
    setFormData((prev) => ({
      ...prev,
      ...newData
    }));
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  return {
    currentStep,
    formData,
    nextStep,
    prevStep,
    resetForm,
    updateFormData,
    handleChange,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === steps
  };
}