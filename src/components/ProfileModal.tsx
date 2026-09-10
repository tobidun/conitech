"use client";

import React, { useState, useRef } from "react";
import { CustomDropdown, DropdownOption } from "./CustomDropdown";

export interface UserProfile {
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  phoneCode: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProfile: UserProfile;
  onSave: (updatedProfile: UserProfile, savedToDatabase: boolean) => void;
}

const countryOptions: DropdownOption[] = [
  { value: "Nigeria", label: "Nigeria" },
  { value: "United States", label: "United States" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Canada", label: "Canada" },
  { value: "Ghana", label: "Ghana" },
  { value: "Kenya", label: "Kenya" },
  { value: "South Africa", label: "South Africa" },
  { value: "Egypt", label: "Egypt" },
  { value: "Ethiopia", label: "Ethiopia" },
  { value: "Tanzania", label: "Tanzania" },
  { value: "Uganda", label: "Uganda" },
  { value: "Senegal", label: "Senegal" },
  { value: "Cameroon", label: "Cameroon" },
  { value: "Australia", label: "Australia" },
  { value: "India", label: "India" },
  { value: "Germany", label: "Germany" },
  { value: "France", label: "France" },
];

interface PhoneCountry {
  code: string;
  flag: string;
  dial: string;
}

const phoneCountries: PhoneCountry[] = [
  { code: "NG", flag: "🇳🇬", dial: "+234" },
  { code: "US", flag: "🇺🇸", dial: "+1" },
  { code: "GB", flag: "🇬🇧", dial: "+44" },
  { code: "CA", flag: "🇨🇦", dial: "+1" },
  { code: "GH", flag: "🇬🇭", dial: "+233" },
  { code: "KE", flag: "🇰🇪", dial: "+254" },
  { code: "ZA", flag: "🇿🇦", dial: "+27" },
  { code: "EG", flag: "🇪🇬", dial: "+20" },
  { code: "ET", flag: "🇪🇹", dial: "+251" },
  { code: "TZ", flag: "🇹🇿", dial: "+255" },
  { code: "UG", flag: "🇺🇬", dial: "+256" },
  { code: "SN", flag: "🇸🇳", dial: "+221" },
  { code: "CM", flag: "🇨🇲", dial: "+237" },
  { code: "AU", flag: "🇦🇺", dial: "+61" },
  { code: "IN", flag: "🇮🇳", dial: "+91" },
  { code: "DE", flag: "🇩🇪", dial: "+49" },
  { code: "FR", flag: "🇫🇷", dial: "+33" },
];

// Custom Phone Input
const PhoneInput: React.FC<{
  value: string;
  dialCode: string;
  onValueChange: (v: string) => void;
  onDialChange: (d: string) => void;
  hasError?: boolean;
}> = ({ value, dialCode, onValueChange, onDialChange, hasError }) => {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = phoneCountries.find((c) => c.dial === dialCode) ?? phoneCountries[0];

  React.useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleToggle = () => {
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      if (spaceBelow < 220 && spaceAbove > spaceBelow) {
        setOpenUp(true);
      } else {
        setOpenUp(false);
      }
    }
    setOpen(!open);
  };

  return (
    <div
      ref={ref}
      className={`relative flex items-center h-[42px] rounded-sm border bg-white transition ${hasError ? "border-red-500" : "border-gray-300 focus-within:border-[#FB7802]"
        }`}
    >
      {/* Country code picker */}
      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-1 px-3 border-r border-gray-200 h-full text-sm text-gray-700 hover:bg-gray-50 transition flex-shrink-0"
      >
        <span className="text-base leading-none">{selected.flag}</span>
        <span className="text-xs font-medium text-gray-600">{selected.dial}</span>
        <svg
          className={`h-3 w-3 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Phone number text input */}
      <input
        type="tel"
        value={value}
        onChange={(e) => onValueChange(e.target.value.replace(/[^\d\s\-()]/g, ""))}
        placeholder="800 000 0000"
        className="flex-1 h-full px-3 bg-transparent text-sm font-normal text-gray-900 outline-none placeholder:text-gray-400"
      />

      {/* Dropdown */}
      {open && (
        <div
          className={`absolute left-0 z-50 w-48 max-h-52 overflow-y-auto rounded-sm border border-gray-200 bg-white shadow-lg ${openUp ? "bottom-full mb-1" : "top-full mt-1"
            }`}
        >
          {phoneCountries.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => { onDialChange(c.dial); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 transition ${c.dial === dialCode ? "bg-gray-50 font-medium" : "font-normal text-gray-800"
                }`}
            >
              <span className="text-base">{c.flag}</span>
              <span className="text-gray-500 text-xs">{c.dial}</span>
              <span className="flex-1 truncate">{c.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  initialProfile,
  onSave,
}) => {
  const [formData, setFormData] = useState<UserProfile>({
    fullName: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
    phoneCode: "+234",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: "",
        streetAddress: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        phone: "",
        phoneCode: "+234",
      });
      setErrors({});
      setApiError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e.target.name, e.target.value);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.streetAddress.trim()) newErrors.streetAddress = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State/Province is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setApiError(null);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success && data.savedToDatabase) {
        onSave(formData, true);
      } else {
        setApiError(data.error || "Failed to save profile to database");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setApiError("Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full h-[42px] rounded-sm border px-3 text-sm font-normal outline-none transition ${errors[field]
      ? "border-red-500"
      : "border-gray-300 focus:border-[#FB7802]"
    }`;

  const ErrorMsg = ({ field }: { field: string }) =>
    errors[field] ? (
      <div className="mt-1 flex items-center gap-1 text-xs font-normal text-red-500">
        <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] text-white flex-shrink-0">!</span>
        <span>{errors[field]}</span>
      </div>
    ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in">
      <div className="relative w-full max-w-[640px] max-h-[85vh] bg-white shadow-2xl rounded-sm text-gray-900 font-sans my-auto overflow-y-auto p-6 sm:p-8">

        {/* Header */}
        <div className="text-center pb-4">
          <h2 className="text-[20px] font-semibold text-gray-900 tracking-tight">Update Profile</h2>
          <p className="mt-1 text-[13px] text-gray-500 font-medium">Billing &amp; contact information</p>
        </div>

        {/* Notice Banner */}
        <div className="mb-4 flex items-center gap-2 rounded-sm bg-orange-50 p-3 text-xs text-orange-800 border border-orange-200">
          <svg className="h-4 w-4 flex-shrink-0 text-[#FB7802]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">Please complete your billing information before setting up your payment method.</span>
        </div>

        {apiError && (
          <div className="mb-4 flex items-center gap-2 rounded-sm bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            <span className="font-semibold">{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">* Full Name</label>
            <input
              type="text" name="fullName" value={formData.fullName}
              onChange={handleInputChange} placeholder="e.g. John Smith"
              className={inputClass("fullName")}
            />
            <ErrorMsg field="fullName" />
          </div>

          {/* Street Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">* Street Address</label>
            <input
              type="text" name="streetAddress" value={formData.streetAddress}
              onChange={handleInputChange} placeholder="e.g. 3 Greenwich Ave, New York, NY"
              className={inputClass("streetAddress")}
            />
            <ErrorMsg field="streetAddress" />
          </div>

          {/* City & State */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">* City</label>
              <input
                type="text" name="city" value={formData.city}
                onChange={handleInputChange} placeholder="e.g. New York"
                className={inputClass("city")}
              />
              <ErrorMsg field="city" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">* State / Province</label>
              <input
                type="text" name="state" value={formData.state}
                onChange={handleInputChange} placeholder="e.g. New York"
                className={inputClass("state")}
              />
              <ErrorMsg field="state" />
            </div>
          </div>

          {/* Country & Postal Code */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">* Country</label>
              <CustomDropdown
                options={countryOptions}
                value={formData.country}
                onChange={(val) => handleChange("country", val)}
                placeholder="Select country"
                hasError={!!errors.country}
              />
              <ErrorMsg field="country" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Postal Code</label>
              <input
                type="text" name="postalCode" value={formData.postalCode}
                onChange={handleInputChange} placeholder="e.g. 920001"
                className={inputClass("postalCode")}
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Phone Number</label>
            <PhoneInput
              value={formData.phone}
              dialCode={formData.phoneCode || "+234"}
              onValueChange={(v) => handleChange("phone", v)}
              onDialChange={(d) => handleChange("phoneCode", d)}
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-center">
            <button
              type="submit" disabled={isSubmitting}
              className="w-full rounded-full bg-[#FB7802] py-3 px-6 text-sm font-semibold text-white hover:bg-[#e06a00] transition shadow-md flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : "Save & Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
