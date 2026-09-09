"use client";

import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { UserProfile, ProfileModal } from "./ProfileModal";
import { CustomDropdown, DropdownOption } from "./CustomDropdown";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
}) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [showCardError, setShowCardError] = useState(true);
  const [showExpError, setShowExpError] = useState(false);
  const [showCvvError, setShowCvvError] = useState(false);
  const [cardErrorMessage, setCardErrorMessage] = useState("Please enter card number.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showCvvTooltip, setShowCvvTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ bottom: 0, left: 0 });
  const cvvIconRef = useRef<HTMLSpanElement>(null);

  const handleCvvIconEnter = () => {
    if (cvvIconRef.current) {
      const rect = cvvIconRef.current.getBoundingClientRect();
      const iconCenterX = rect.left + rect.width / 2;
      setTooltipPos({
        bottom: window.innerHeight - rect.top + 8,
        left: Math.max(iconCenterX - 230, 8),
      });
    }
    setShowCvvTooltip(true);
  };

  const handleCvvIconLeave = () => {
    setShowCvvTooltip(false);
  };

  if (!isOpen) return null;

  const handleCloseClick = () => {
    setShowExitConfirm(true);
  };

  const handleLeaveFlow = () => {
    setShowExitConfirm(false);
    onClose();
  };

  const handleContinueToProfile = () => {
    setShowExitConfirm(false);
    setIsProfileModalOpen(true);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = value.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formatted);
    if (value.length > 0) {
      setShowCardError(false);
    } else {
      setShowCardError(true);
      setCardErrorMessage("Please enter card number.");
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCvv(value);
    if (value.length >= 3) setShowCvvError(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCard = cardNumber.replace(/\s/g, "");
    let hasError = false;

    if (!rawCard || rawCard.length < 13) {
      setShowCardError(true);
      setCardErrorMessage("Please enter card number.");
      hasError = true;
    } else {
      setShowCardError(false);
    }

    if (!expMonth || !expYear) {
      setShowExpError(true);
      hasError = true;
    } else {
      setShowExpError(false);
    }

    if (!cvv || cvv.length < 3) {
      setShowCvvError(true);
      hasError = true;
    } else {
      setShowCvvError(false);
    }

    if (hasError) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  const formattedAddress = [
    userProfile.fullName,
    userProfile.streetAddress,
    userProfile.city,
    userProfile.state,
    userProfile.country,
  ]
    .filter(Boolean)
    .join(", ");

  const isCardValid = cardNumber.replace(/\s/g, "").length >= 13;

  const monthOptions: DropdownOption[] = Array.from({ length: 12 }, (_, i) => {
    const m = String(i + 1).padStart(2, "0");
    return { value: m, label: m };
  });

  const yearOptions: DropdownOption[] = Array.from({ length: 12 }, (_, i) => {
    const y = String(2026 + i);
    return { value: y, label: y };
  });

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 transition-opacity">
        <div className="relative w-full max-w-[640px] max-h-[82vh] bg-white shadow-2xl rounded-sm text-gray-900 font-sans my-auto flex flex-col">

          {/* X Close Button — absolute, always visible at top-right */}
          <button
            onClick={handleCloseClick}
            className="absolute top-2.5 right-3.5 text-gray-700 hover:text-black transition z-10"
            aria-label="Close modal"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Fixed top white spacer — always visible above scrollable content */}
          <div className="flex-shrink-0 h-8 sm:h-9"></div>

          {/* Scrollable Body — everything scrolls */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-8">

            {/* Modal Header */}
            <div className="text-center pt-1 pb-2">
              <h2 className="text-[20px] font-semibold text-gray-900 tracking-tight">Add a new card</h2>
              <div className="mt-1 flex items-center justify-center gap-1 text-[13px] font-medium text-[#0a8c2a] cursor-pointer hover:underline">
                <svg className="h-4 w-4 fill-current text-[#0a8c2a]" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>All data is safeguarded</span>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Top Card Brand Logos Row */}
            <div className="flex flex-wrap items-center justify-start gap-2.5 my-2.5">
              <div className="flex items-center justify-center">
                <Image src="/verve.avif" alt="Verve" width={44} height={26} className="h-6.5 w-auto object-contain" />
              </div>
              <div className="flex items-center justify-center">
                <Image src="/visa.avif" alt="Visa" width={44} height={26} className="h-6.5 w-auto object-contain" />
              </div>
              <div className="flex items-center justify-center">
                <Image src="/mastercard.avif" alt="Mastercard" width={44} height={26} className="h-6.5 w-auto object-contain" />
              </div>
              <div className="flex items-center justify-center">
                <Image src="/american-express.avif" alt="American Express" width={44} height={26} className="h-6.5 w-auto object-contain" />
              </div>
              <div className="flex items-center justify-center">
                <Image src="/discover.avif" alt="Discover" width={44} height={26} className="h-6.5 w-auto object-contain" />
              </div>
              <div className="flex items-center justify-center">
                <Image src="/maestro.avif" alt="Maestro" width={44} height={26} className="h-6.5 w-auto object-contain" />
              </div>
              <div className="flex items-center justify-center">
                <Image src="/diners.avif" alt="Diners Club" width={44} height={26} className="h-6.5 w-auto object-contain" />
              </div>
              <div className="flex items-center justify-center">
                <Image src="/jcb-top.avif" alt="JCB" width={44} height={26} className="h-6.5 w-auto object-contain" />
              </div>
            </div>

            {isSuccess ? (
              <div className="py-8 text-center animate-fade-in">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Card Saved Successfully</h3>
                <p className="mt-1 text-sm text-gray-600">Your payment method has been added securely.</p>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    onClose();
                  }}
                  className="mt-6 rounded-full bg-[#FB7802] px-8 py-3 text-sm font-bold text-white hover:bg-[#e06a00] transition"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="mt-1 space-y-3">

                {/* Card Number Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">
                    * Card number
                  </label>
                  <div
                    className={`relative flex items-center h-[42px] rounded-sm border bg-white px-3 transition ${showCardError
                        ? "border-red-500"
                        : "border-gray-400 focus-within:border-gray-600"
                      }`}
                  >
                    {/* Card Icon */}
                    <div className="mr-3 flex items-center">
                      <Image src="/card.avif" alt="Card" width={28} height={18} className="h-4.5 w-auto object-contain" />
                    </div>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="Card number"
                      className="w-full bg-transparent text-base font-normal text-gray-900 outline-none placeholder:text-gray-400"
                      maxLength={19}
                    />
                    {/* Green shield badge */}
                    <div className="ml-2 text-[#0a8c2a] flex items-center flex-shrink-0">
                      <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012 4.944v5c0 4.001 2.667 7.556 8 9.056 5.333-1.5 8-5.055 8-9.056v-5A11.954 11.954 0 0110 1.944zm3.707 6.353a1 1 0 00-1.414-1.414L9 10.086 7.707 8.793a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  {/* Card Error Message */}
                  {showCardError && (
                    <div className="mt-1 flex items-center gap-1 text-xs font-normal text-red-500">
                      <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-normal text-white flex-shrink-0">!</span>
                      <span className="font-normal">{cardErrorMessage}</span>
                    </div>
                  )}
                </div>

                {/* Expiration Date & CVV Grid */}
                <div className="grid grid-cols-12 gap-3">
                  {/* Expiration Date */}
                  <div className="col-span-7">
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      * Expiration date
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <CustomDropdown
                        options={monthOptions}
                        value={expMonth}
                        onChange={(val) => { setExpMonth(val); if (val) setShowExpError(false); }}
                        placeholder="Month"
                        hasError={showExpError}
                      />

                      <CustomDropdown
                        options={yearOptions}
                        value={expYear}
                        onChange={(val) => { setExpYear(val); if (val) setShowExpError(false); }}
                        placeholder="Year"
                        hasError={showExpError}
                      />
                    </div>
                    {showExpError && (
                      <div className="mt-1 flex items-center gap-1 text-xs font-normal text-red-500">
                        <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-normal text-white flex-shrink-0">!</span>
                        <span>Please select expiration date.</span>
                      </div>
                    )}
                  </div>

                  {/* CVV Input */}
                  <div className="col-span-5">
                    <div className="flex items-center gap-1 mb-1">
                      <label className="block text-sm font-semibold text-gray-900">* CVV</label>
                      <span
                        ref={cvvIconRef}
                        onMouseEnter={handleCvvIconEnter}
                        onMouseLeave={handleCvvIconLeave}
                        className="inline-flex h-4 w-4 self-start mt-0.5 items-center justify-center rounded-full bg-gray-400 text-[10px] font-bold text-white cursor-pointer"
                      >
                        ?
                      </span>
                    </div>

                    <div className={`relative flex items-center h-[42px] rounded-sm border bg-white px-3 transition ${showCvvError ? "border-red-500" : "border-gray-400 focus-within:border-gray-600"
                      }`}>
                      <input
                        type="password"
                        value={cvv}
                        onChange={handleCvvChange}
                        placeholder="3-4 digits code"
                        className="w-full bg-transparent text-sm font-normal text-gray-900 outline-none placeholder:text-gray-400"
                        maxLength={4}
                      />
                      <svg className="h-4 w-4 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    {showCvvError && (
                      <div className="mt-1 flex items-center gap-1 text-xs font-normal text-red-500">
                        <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-normal text-white flex-shrink-0">!</span>
                        <span>Please input CVV.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Billing Address Section */}
                <div className="py-4 my-2 border-t border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <label className="text-sm font-semibold text-gray-900">* Billing address</label>
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-400 text-[10px] font-bold text-white cursor-pointer" title="Address associated with card statement">
                        ?
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsProfileModalOpen(true)}
                      className="flex items-center gap-1 text-sm font-semibold text-gray-900 hover:text-[#FB7802] transition"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit</span>
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 leading-snug font-normal">
                    {formattedAddress || "Oluwatobi Abiodun, bosso minna Niger state, Nigeria, Bosso, Niger Nigeria"}
                  </p>
                </div>

                {/* Primary Action Button (#FB7802) */}
                <div className="pt-2 pb-1 flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full max-w-[300px] rounded-full bg-[#FB7802] py-3 px-6 text-base font-bold text-white hover:bg-[#e06a00] active:scale-[0.99] transition shadow-md flex items-center justify-center gap-2 disabled:opacity-80"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <span>Processing...</span>
                      </>
                    ) : (
                      "Add your card"
                    )}
                  </button>
                </div>

                {/* Security Safeguards Checklist & Badges Footer */}
                <div className="pt-4 space-y-1.5 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-[#0a8c2a] fill-current flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012 4.944v5c0 4.001 2.667 7.556 8 9.056 5.333-1.5 8-5.055 8-9.056v-5A11.954 11.954 0 0110 1.944zm3.707 6.353a1 1 0 00-1.414-1.414L9 10.086 7.707 8.793a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium leading-[21px] text-[#0a8c2a]">Conitech protects your card information</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <svg className="h-4 w-4 text-[#0a8c2a] flex-shrink-0 mt-[3px] fill-current" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium leading-[21px] text-[#757575]">
                      Conitech follows the Payment Card Industry Data Security Standard (PCI DSS) when handling card data
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <svg className="h-4 w-4 text-[#0a8c2a] flex-shrink-0 mt-[3px] fill-current" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium leading-[21px] text-[#757575]">
                      Card information is secure and uncompromised
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <svg className="h-4 w-4 text-[#0a8c2a] flex-shrink-0 mt-[3px] fill-current" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium leading-[21px] text-[#757575]">
                      All data is safeguarded
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <svg className="h-4 w-4 text-[#0a8c2a] flex-shrink-0 mt-[3px] fill-current" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium leading-[21px] text-[#757575]">
                      Conitech never sells your card information
                    </span>
                  </div>


                  {/* Security Certification Badges Row */}
                  <div className="flex flex-wrap items-center justify-start gap-2.5 pt-3">
                    <div className="flex items-center justify-center">
                      <Image src="/pci.avif" alt="PCI DSS" width={56} height={28} className="h-6.5 w-auto object-contain" />
                    </div>
                    <div className="flex items-center justify-center">
                      <Image src="/visa-secure.avif" alt="Visa Secure" width={56} height={28} className="h-6.5 w-auto object-contain" />
                    </div>
                    <div className="flex items-center justify-center">
                      <Image src="/id-check.avif" alt="Mastercard ID Check" width={64} height={28} className="h-6.5 w-auto object-contain" />
                    </div>
                    <div className="flex items-center justify-center">
                      <Image src="/safekey.avif" alt="SafeKey" width={64} height={28} className="h-6.5 w-auto object-contain" />
                    </div>
                    <div className="flex items-center justify-center">
                      <Image src="/protect-buy.avif" alt="ProtectBuy" width={56} height={28} className="h-6.5 w-auto object-contain" />
                    </div>
                    <div className="flex items-center justify-center">
                      <Image src="/jcb.avif" alt="JCB J/Secure" width={50} height={28} className="h-6.5 w-auto object-contain" />
                    </div>
                    <div className="flex items-center justify-center">
                      <Image src="/apwg.avif" alt="APWG" width={56} height={28} className="h-6.5 w-auto object-contain" />
                    </div>
                  </div>

                </div>
              </form>
            )}
          </div>{/* end scrollable body */}

          {/* Fixed bottom white spacer — always visible */}
          <div className="flex-shrink-0 h-8 sm:h-10"></div>
        </div>
      </div>

      {/* Exit Confirmation Overlay Modal matching attachment */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity animate-fade-in">
          <div className="relative w-full max-w-[640px] bg-white rounded-sm p-6 sm:p-8 shadow-2xl text-center">

            {/* Close Button */}
            <button
              onClick={() => setShowExitConfirm(false)}
              className="absolute top-4 right-4 text-gray-700 hover:text-black transition"
              aria-label="Close dialog"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">
              You’re almost there!
            </h3>
            <p className="mt-2 text-sm font-normal text-gray-600 leading-relaxed px-2">
              All Form Details will need to be filled to update profile.
            </p>

            {/* Security Badges Row */}
            <div className="my-6 grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EDFAEC] text-[#0F8604] mb-2">
                  <svg className="h-8 w-8 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-900">Security privacy</span>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EDFAEC] text-[#0F8604] mb-2">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-900">Safe payment</span>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center justify-center gap-4 w-full pt-2">
              <button
                onClick={handleLeaveFlow}
                className="w-full rounded-full border border-gray-400 py-3.5 px-6 text-base font-bold text-gray-800 hover:bg-gray-50 transition"
              >
                Leave
              </button>
              <button
                onClick={handleContinueToProfile}
                className="w-full rounded-full bg-[#FB7802] py-3.5 px-6 text-base font-bold text-white hover:bg-[#e06a00] transition shadow-md"
              >
                Continue
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Embedded Profile Update Modal triggered via 'Edit' or Continue on Exit dialog */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        initialProfile={userProfile}
        onSave={(updated) => {
          onUpdateProfile(updated);
          setIsProfileModalOpen(false);
        }}
      />

      {/* CVV Tooltip Portal — appears above CVV field, right-aligned, overlaps modal */}
      {showCvvTooltip && typeof document !== "undefined" && createPortal(
        <div
          style={{ bottom: tooltipPos.bottom, left: tooltipPos.left }}
          className="fixed z-[9999] w-[460px] bg-white rounded-lg p-5 shadow-2xl border border-gray-200 text-xs text-gray-800"
          onMouseEnter={() => setShowCvvTooltip(true)}
          onMouseLeave={() => setShowCvvTooltip(false)}
        >
          <div className="grid grid-cols-2 gap-4">
            {/* Visa, MasterCard & Discover */}
            <div className="flex flex-col items-center text-center">
              <p className="text-[11px] font-normal text-gray-700 leading-tight mb-3 min-h-[36px]">
                Visa, MasterCard &amp; Discover: The 3 digits on the back of the card next to signature panel.
              </p>
              <div className="w-full rounded overflow-hidden mb-1.5">
                <Image
                  src="/card-cvv.avif"
                  alt="Visa, MasterCard & Discover CVV"
                  width={200}
                  height={130}
                  className="w-full h-auto object-contain"
                />
              </div>
              <span className="text-[10px] font-normal text-gray-400">
                Visa, MasterCard &amp; Discover CVV
              </span>
            </div>

            {/* American Express */}
            <div className="flex flex-col items-center text-center">
              <p className="text-[11px] font-normal text-gray-700 leading-tight mb-3 min-h-[36px]">
                American Express: The 4 digits on the front of the card above the credit card number.
              </p>
              <div className="w-full rounded overflow-hidden mb-1.5">
                <Image
                  src="/american-cvv.avif"
                  alt="American Express CVV"
                  width={200}
                  height={130}
                  className="w-full h-auto object-contain"
                />
              </div>
              <span className="text-[10px] font-normal text-gray-400">
                American Express CVV
              </span>
            </div>
          </div>

          {/* Downward-pointing arrow — centered on popup, which is centered above the ? icon */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[8px] border-x-transparent border-t-[8px] border-t-gray-200"></div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[7px] border-x-transparent border-t-[7px] border-t-white" style={{ marginTop: 1 }}></div>
        </div>,
        document.body
      )}
    </>
  );
};
