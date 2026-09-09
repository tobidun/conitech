"use client";

import React, { useState } from "react";
import { PaymentModal } from "@/components/PaymentModal";
import { ProfileModal, UserProfile } from "@/components/ProfileModal";

export default function Home() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
    phoneCode: "+234",
  });

  React.useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.profile) {
          setUserProfile((prev) => ({ ...prev, ...data.profile }));
        }
      })
      .catch((err) => console.error("Failed to load profile from backend:", err));
  }, []);

  const handleOpenPaymentFlow = () => {
    // Check if profile details are populated
    if (!userProfile.fullName || !userProfile.streetAddress) {
      setShowProfilePrompt(true);
    } else {
      setIsPaymentModalOpen(true);
    }
  };

  const handleProceedToProfile = () => {
    setShowProfilePrompt(false);
    setIsProfileModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-6">
          <div>
            <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-[#FB7802] mb-2">
              Payment & Profile Checkout
            </span>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Account & Payment Settings</h1>
          </div>
        </div>

        {/* Profile Card Summary */}
        <div className="mt-6 rounded-2xl bg-neutral-50 p-5 border border-neutral-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <svg className="h-4 w-4 text-[#FB7802]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              User Profile & Billing Address
            </h3>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="text-xs font-bold text-[#FB7802] hover:underline"
            >
              Edit Profile
            </button>
          </div>

          <div className="space-y-1 text-xs text-gray-600">
            <p><span className="font-semibold text-gray-800">Name:</span> {userProfile.fullName || "Not set"}</p>
            <p><span className="font-semibold text-gray-800">Address:</span> {userProfile.streetAddress}, {userProfile.city}, {userProfile.state}, {userProfile.country}</p>
            <p><span className="font-semibold text-gray-800">Phone:</span> {userProfile.phone || "Not set"}</p>
          </div>
        </div>

        {/* Action Trigger */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={handleOpenPaymentFlow}
            className="w-full rounded-full bg-[#FB7802] py-4 px-6 text-base font-bold text-white hover:bg-[#e06a00] active:scale-[0.98] transition shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Add New Payment Method</span>
          </button>
        </div>
      </div>

      {/* Required Profile Update Prompt */}
      {showProfilePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-[#FB7802] mb-3">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Profile Update Required</h3>
            <p className="mt-2 text-xs text-gray-600">
              Please complete your profile and billing address before adding a payment card.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setShowProfilePrompt(false)}
                className="rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleProceedToProfile}
                className="rounded-full bg-[#FB7802] px-5 py-2 text-xs font-bold text-white hover:bg-[#e06a00]"
              >
                Update Profile Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={(updated) => setUserProfile(updated)}
      />

      {/* Standalone Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        initialProfile={userProfile}
        onSave={(updated) => {
          setUserProfile(updated);
          setIsProfileModalOpen(false);
          // Return to payment modal after updating profile
          setIsPaymentModalOpen(true);
        }}
      />
    </main>
  );
}
