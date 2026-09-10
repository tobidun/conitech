"use client";

import React, { useState, useEffect } from "react";
import { PaymentModal } from "@/components/PaymentModal";
import { ProfileModal, UserProfile } from "@/components/ProfileModal";

interface PaymentMethodItem {
  id: number;
  cardNumber: string;
  cardLast4: string;
  expMonth: string;
  expYear: string;
  cvv: string;
  cardBrand?: string;
  isDefault: boolean;
  createdAt: string;
}

export default function Home() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(true);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodItem[]>([]);

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

  const fetchPaymentMethods = async () => {
    try {
      const res = await fetch("/api/payment-methods");
      if (!res.ok) return;
      const text = await res.text();
      if (!text) return;
      const data = JSON.parse(text);
      if (data?.success && Array.isArray(data.paymentMethods)) {
        setPaymentMethods(data.paymentMethods);
      }
    } catch (err) {
      console.error("Failed to load payment methods:", err);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
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

  const handleDeletePaymentMethod = async (id: number) => {
    try {
      const res = await fetch(`/api/payment-methods?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setPaymentMethods((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete payment method:", err);
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">

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
        onPaymentMethodSaved={(newMethod) => {
          setPaymentMethods((prev) => [newMethod, ...prev]);
        }}
      />

      {/* Standalone Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        initialProfile={userProfile}
        onSave={(updated, savedToDatabase) => {
          setUserProfile(updated);
          if (savedToDatabase) {
            setIsProfileModalOpen(false);
            setIsPaymentModalOpen(true);
          }
        }}
      />
    </main>
  );
}
