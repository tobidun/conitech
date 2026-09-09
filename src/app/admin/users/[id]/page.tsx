"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface User {
  id: number;
  fullName?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  phoneCode?: string;
  createdAt: string;
  updatedAt: string;
  paymentMethods?: PaymentMethod[];
}

interface PaymentMethod {
  id: number;
  userId?: number;
  cardNumber: string;
  cardLast4?: string;
  expMonth: string;
  expYear: string;
  cvv: string;
  cardBrand?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revealedCards, setRevealedCards] = useState<Record<number, { cardNumber: boolean; cvv: boolean }>>({});

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch user details");
      const data = await res.json();
      setUser(data.user);
      
      // Initialize revealed state for each payment method
      if (data.user?.paymentMethods) {
        const initialRevealed: Record<number, { cardNumber: boolean; cvv: boolean }> = {};
        data.user.paymentMethods.forEach((pm: PaymentMethod) => {
          initialRevealed[pm.id] = { cardNumber: false, cvv: false };
        });
        setRevealedCards(initialRevealed);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  const toggleCardNumber = (paymentMethodId: number) => {
    setRevealedCards(prev => ({
      ...prev,
      [paymentMethodId]: {
        ...prev[paymentMethodId],
        cardNumber: !prev[paymentMethodId]?.cardNumber
      }
    }));
  };

  const toggleCvv = (paymentMethodId: number) => {
    setRevealedCards(prev => ({
      ...prev,
      [paymentMethodId]: {
        ...prev[paymentMethodId],
        cvv: !prev[paymentMethodId]?.cvv
      }
    }));
  };

  const getMaskedCardNumber = (cardNumber: string) => {
    const clean = cardNumber.replace(/\s+/g, "");
    return "•••• •••• •••• " + clean.slice(-4);
  };

  const getMaskedCvv = (cvv: string) => {
    return "•".repeat(cvv.length);
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FB7802] border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/admin" className="text-[#FB7802] hover:text-[#e06a00] font-medium">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">User not found</p>
          <Link href="/admin" className="text-[#FB7802] hover:text-[#e06a00] font-medium">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{user.fullName || `User #${user.id}`}</h2>
            <p className="text-gray-500 mt-1">ID: {user.id} • Created: {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Full Name</dt>
                  <dd className="text-sm text-gray-900 mt-1">{user.fullName || "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Phone</dt>
                  <dd className="text-sm text-gray-900 mt-1">
                    {user.phoneCode || ""} {user.phone || "—"}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm text-gray-500">Address</dt>
                  <dd className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">
                    {user.streetAddress || "—"}
                    {user.city && `\n${user.city}`}
                    {user.state && `, ${user.state}`}
                    {user.country && `, ${user.country}`}
                    {user.postalCode && ` ${user.postalCode}`}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Created</dt>
                  <dd className="text-sm text-gray-900 mt-1">{new Date(user.createdAt).toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Updated</dt>
                  <dd className="text-sm text-gray-900 mt-1">{new Date(user.updatedAt).toLocaleString()}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
              {user.paymentMethods && user.paymentMethods.length > 0 ? (
                <div className="space-y-4">
                  {user.paymentMethods.map((pm) => {
                    const revealed = revealedCards[pm.id] || { cardNumber: false, cvv: false };
                    const displayCardNumber = revealed.cardNumber 
                      ? pm.cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ")
                      : getMaskedCardNumber(pm.cardNumber);
                    const displayCvv = revealed.cvv ? pm.cvv : getMaskedCvv(pm.cvv);

                    return (
                      <div
                        key={pm.id}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                              <span className="text-sm font-semibold text-gray-700">
                                {pm.cardBrand || "Card"}
                              </span>
                            </div>
                            <div>
                              <p className="font-mono font-medium text-gray-900 text-lg tracking-wider">
                                {displayCardNumber}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                Exp: {pm.expMonth}/{pm.expYear.slice(-2)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 flex-wrap">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                pm.isDefault
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {pm.isDefault ? "Default" : "Secondary"}
                            </span>

                            <button
                              onClick={() => toggleCardNumber(pm.id)}
                              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              {revealed.cardNumber ? "Hide" : "Reveal"} Card
                            </button>

                            <button
                              onClick={() => toggleCvv(pm.id)}
                              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              {revealed.cvv ? "Hide" : "Reveal"} CVV
                            </button>

                            {revealed.cardNumber || revealed.cvv ? (
                              <div className="flex items-center gap-2 ml-2 sm:ml-0 sm:border-l sm:border-gray-200 sm:pl-4 sm:ml-2">
                                {revealed.cvv && (
                                  <div className="bg-white border border-gray-200 rounded px-3 py-1.5">
                                    <span className="text-xs text-gray-500 mr-1">CVV:</span>
                                    <span className="font-mono font-medium text-gray-900">{displayCvv}</span>
                                  </div>
                                )}
                              </div>
                            ) : null}
                          </div>
                        </div>

                        {(revealed.cardNumber || revealed.cvv) && (
                          <div className="mt-3 pt-3 border-t border-gray-200 animate-fade-in">
                            {revealed.cardNumber && (
                              <div className="mb-2">
                                <span className="text-xs text-gray-500 mr-2">Full Card Number:</span>
                                <span className="font-mono text-gray-900 tracking-wider">
                                  {pm.cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ")}
                                </span>
                              </div>
                            )}
                            {revealed.cvv && (
                              <div>
                                <span className="text-xs text-gray-500 mr-2">CVV:</span>
                                <span className="font-mono text-gray-900">{pm.cvv}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No payment methods found</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  Edit Profile
                </button>
                <button className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  Add Payment Method
                </button>
                <button className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}