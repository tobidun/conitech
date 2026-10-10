"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  sold: string;
  rating: number;
  badge?: string;
  originalPrice?: number;
}

const products: Product[] = [
  {
    id: "portable-monitor",
    name: "Portable 15.6-inch HD Monitor for Laptop",
    category: "Electronics",
    price: 16313,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=700&q=85",
    sold: "8.6K+ sold",
    rating: 4.8,
    badge: "Popular",
    originalPrice: 25120,
  },
  {
    id: "classic-watch",
    name: "Classic Stainless Steel Quartz Watch",
    category: "Accessories",
    price: 5775,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85",
    sold: "2.1K+ sold",
    rating: 4.7,
    badge: "Deal",
    originalPrice: 12990,
  },
  {
    id: "usb-c-hub",
    name: "5-in-1 USB C 3.0 Multiport Adapter",
    category: "Electronics",
    price: 7378,
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=700&q=85",
    sold: "3.6K+ sold",
    rating: 4.9,
    badge: "Deal",
    originalPrice: 14650,
  },
  {
    id: "sport-watch",
    name: "Men's Business Chronograph Stainless Watch",
    category: "Accessories",
    price: 17907,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=85",
    sold: "10K+ sold",
    rating: 4.8,
    originalPrice: 35900,
  },
  {
    id: "sunglasses",
    name: "Polarized Lightweight Sports Sunglasses",
    category: "Accessories",
    price: 3119,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=85",
    sold: "133 sold",
    rating: 4.6,
    originalPrice: 8190,
  },
  {
    id: "ergonomic-mouse",
    name: "Wireless Ergonomic Rechargeable Mouse",
    category: "Electronics",
    price: 4890,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=700&q=85",
    sold: "1.8K+ sold",
    rating: 4.7,
    badge: "Best seller",
  },
  {
    id: "black-watch",
    name: "Minimal Black Dial Everyday Watch",
    category: "Accessories",
    price: 6290,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=700&q=85",
    sold: "920 sold",
    rating: 4.5,
  },
  {
    id: "rose",
    name: "Elegant Preserved Rose Gift in Glass Dome",
    category: "Home",
    price: 5360,
    image: "https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&w=700&q=85",
    sold: "4.2K+ sold",
    rating: 4.8,
    badge: "Deal",
  },
  {
    id: "baseball-cap",
    name: "Classic Adjustable Cotton Baseball Cap",
    category: "Fashion",
    price: 2699,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=700&q=85",
    sold: "5.4K+ sold",
    rating: 4.7,
  },
  {
    id: "tool-kit",
    name: "Multi-Joint Precision Repair Tool Kit",
    category: "Home",
    price: 17907,
    image: "https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?auto=format&fit=crop&w=700&q=85",
    sold: "740 sold",
    rating: 4.6,
    badge: "New",
  },
];

const formatPrice = (price: number) => `₦${price.toLocaleString("en-NG")}`;

function CartIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L22 8H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="20" r="1.2" fill="currentColor" />
      <circle cx="18" cy="20" r="1.2" fill="currentColor" />
    </svg>
  );
}

export default function Home() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(true);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("For you");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemIds, setCartItemIds] = useState<string[]>([
    "usb-c-hub",
    "tool-kit",
    "sunglasses",
  ]);
  const [selectedCartItems, setSelectedCartItems] = useState<string[]>([
    "usb-c-hub",
    "tool-kit",
    "sunglasses",
  ]);
  const [quantities, setQuantities] = useState<Record<string, number>>({
    "usb-c-hub": 1,
    "tool-kit": 1,
    sunglasses: 1,
  });
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

  useEffect(() => {
    const loadPaymentMethods = async () => {
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
    void loadPaymentMethods();
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "For you" || product.category === activeCategory;
      const matchesSearch =
        !normalizedSearch ||
        `${product.name} ${product.category}`.toLowerCase().includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  const cartProducts = products.filter((product) => cartItemIds.includes(product.id));
  const selectedProducts = cartProducts.filter((product) =>
    selectedCartItems.includes(product.id),
  );
  const cartCount = cartItemIds.reduce(
    (total, id) => total + (quantities[id] ?? 1),
    0,
  );
  const selectedItemCount = selectedProducts.reduce(
    (total, product) => total + (quantities[product.id] ?? 1),
    0,
  );
  const cartSubtotal = selectedProducts.reduce(
    (total, product) => total + product.price * (quantities[product.id] ?? 1),
    0,
  );

  const addToCart = (productId: string) => {
    setCartItemIds((items) => items.includes(productId) ? items : [...items, productId]);
    setSelectedCartItems((items) => items.includes(productId) ? items : [...items, productId]);
    setQuantities((current) => ({
      ...current,
      [productId]: current[productId] ?? 1,
    }));
    setIsCartOpen(true);
  };

  const setQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setQuantities((current) => ({ ...current, [productId]: quantity }));
  };

  const handleOpenPaymentFlow = () => {
    setIsCartOpen(false);
    if (selectedItemCount === 0) return;
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
    <main className="storefront min-h-screen bg-[#f7f7f7] text-[#222]">
      <div className="storefront-main">
        <div className="shipping-strip">
          <div className="shipping-message">
            <span aria-hidden="true">🚚</span>
            <span>Free shipping on all orders</span>
            <span className="strip-chevron">›</span>
          </div>
          <span className="strip-divider" />
          <div className="shipping-message shipping-adjustment">
            <span className="adjustment-icon" aria-hidden="true">◉</span>
            <span>Price adjustment within 30 days</span>
          </div>
        </div>

        <header className="store-header">
          <Link href="/" className="store-logo" aria-label="Temu home">
            <Image src="/temu-og.png" alt="Temu" width={58} height={58} priority />
          </Link>
          <nav className="primary-links" aria-label="Main navigation">
            <button type="button" onClick={() => setActiveCategory("For you")}>
              <span aria-hidden="true">♟</span> Best-Selling Items
            </button>
            <button type="button" onClick={() => setActiveCategory("For you")}>
              More <span className="nav-chevron">⌄</span>
            </button>
            <button type="button" onClick={() => setActiveCategory("Electronics")}>
              Categories <span className="nav-chevron">⌄</span>
            </button>
          </nav>
          <label className="search-box">
            <span className="sr-only">Search products</span>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search deals and finds"
            />
            <button type="button" aria-label="Search products">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="2" />
                <path d="m16 16 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </label>
          <div className="header-actions">
            <button
              className="header-action account-action"
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              title={`${paymentMethods.length} saved payment methods`}
            >
              <span className="round-flag" aria-hidden="true">🇳🇬</span>
              <span>Orders &amp;<br />Account</span>
            </button>
            <span className="header-action support-action">
              <span className="support-icon" aria-hidden="true">◉</span>
              <span>Support</span>
            </span>
            <span className="header-action language-action">
              <span className="round-flag" aria-hidden="true">🇳🇬</span>
              <span>English</span>
            </span>
            <button className="header-cart" type="button" onClick={() => setIsCartOpen(true)} aria-label={`Open cart, ${cartCount} items`}>
              <CartIcon />
              <span>{cartCount}</span>
            </button>
          </div>
        </header>

        <section className="catalog" aria-label="Products">
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image-wrap">
                    <div
                      className="product-image"
                      role="img"
                      aria-label={product.name}
                      style={{ backgroundImage: `url("${product.image}")` }}
                    />
                    {product.badge && <span className="product-badge">{product.badge}</span>}
                    <button
                      className="quick-add"
                      type="button"
                      onClick={() => addToCart(product.id)}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <CartIcon className="h-4.5 w-4.5" />
                    </button>
                  </div>
                  <div className="product-info">
                    <h2 title={product.name}>{product.name}</h2>
                    <div className="price-row">
                      <span className="price">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="original-price">{formatPrice(product.originalPrice)}</span>
                      )}
                      <button
                        className="inline-add"
                        type="button"
                        onClick={() => addToCart(product.id)}
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <CartIcon className="h-4.25 w-4.25" />
                      </button>
                    </div>
                    <div className="product-meta">
                      <span className="stars" aria-label={`${product.rating} out of 5 stars`}>
                        {"★".repeat(Math.floor(product.rating))}
                        <span className="half-star">★</span>
                      </span>
                      <span className="sold-count">{product.sold}</span>
                    </div>
                    {product.badge === "Best seller" && <span className="seller-label">✦ Best seller</span>}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-products">
              <span aria-hidden="true">⌕</span>
              <p>No products found. Try another search or category.</p>
            </div>
          )}
        </section>
      </div>

      <aside className={`cart-sidebar ${isCartOpen ? "cart-sidebar-open" : ""}`} aria-label="Shopping cart">
        <div className="cart-top">
          <button className="cart-subtotal-button" type="button" onClick={() => setIsCartOpen((open) => !open)}>
            <span>🛒 Subtotal</span>
            <strong>{formatPrice(cartSubtotal)}</strong>
          </button>
          <div className="shipping-promise"><span aria-hidden="true">✓</span> Free shipping on all orders</div>
          <button className="checkout-button" type="button" onClick={handleOpenPaymentFlow} disabled={selectedItemCount === 0}>
            <strong>{selectedItemCount} {selectedItemCount === 1 ? "item" : "items"} almost sold out</strong>
            <span>Checkout ({selectedItemCount})</span>
          </button>
          <button className="go-to-cart" type="button" onClick={() => setIsCartOpen(true)}>Go to cart</button>
          <div className="cart-select-all">
            <label>
              <input
                type="checkbox"
                checked={cartProducts.length > 0 && selectedProducts.length === cartProducts.length}
                onChange={(event) => {
                  setSelectedCartItems(event.target.checked ? cartItemIds : []);
                }}
              />
              <span>Select all ({cartCount})</span>
            </label>
          </div>
          <div className="cart-items">
            {cartProducts.length ? cartProducts.map((product) => (
              <div className="cart-item" key={product.id}>
                <label className="cart-item-check">
                  <input
                    type="checkbox"
                    checked={selectedCartItems.includes(product.id)}
                    onChange={(event) => setSelectedCartItems((items) =>
                      event.target.checked
                        ? (items.includes(product.id) ? items : [...items, product.id])
                        : items.filter((id) => id !== product.id),
                    )}
                    aria-label={`Select ${product.name}`}
                  />
                </label>
                <div className="cart-item-image" role="img" aria-label={product.name} style={{ backgroundImage: `url("${product.image}")` }} />
                <div className="cart-item-details">
                  <p>{product.name}</p>
                  <strong>{formatPrice(product.price)}</strong>
                  <select
                    value={quantities[product.id] ?? 1}
                    onChange={(event) => setQuantity(product.id, Number(event.target.value))}
                    aria-label={`Quantity for ${product.name}`}
                  >
                    {[1, 2, 3, 4, 5].map((quantity) => <option key={quantity} value={quantity}>{quantity}</option>)}
                  </select>
                </div>
              </div>
            )) : <p className="empty-cart">Your cart is waiting for something great.</p>}
          </div>
        </div>
        <button className="close-cart" type="button" aria-label="Close cart" onClick={() => setIsCartOpen(false)}>×</button>
      </aside>
      {isCartOpen && <button className="cart-backdrop" aria-label="Close cart" onClick={() => setIsCartOpen(false)} />}

      {showProfilePrompt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="profile-prompt-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-[#FB7802]">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 id="profile-prompt-title" className="text-lg font-bold text-gray-900">Profile update required</h2>
            <p className="mt-2 text-sm text-gray-600">Please complete your profile and billing address before adding a payment card.</p>
            <div className="mt-6 flex justify-center gap-3">
              <button onClick={() => setShowProfilePrompt(false)} className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleProceedToProfile} className="rounded-full bg-[#FB7802] px-5 py-2 text-sm font-bold text-white hover:bg-[#e06a00]">Update profile</button>
            </div>
          </div>
        </div>
      )}

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={setUserProfile}
        onPaymentMethodSaved={(newMethod) => setPaymentMethods((prev) => [newMethod, ...prev])}
      />

      {isProfileModalOpen && (
        <ProfileModal
          isOpen={true}
          onClose={() => setIsProfileModalOpen(false)}
          initialProfile={userProfile}
          canClose={false}
          onSave={(updated, savedToDatabase) => {
            setUserProfile(updated);
            if (savedToDatabase) {
              setIsProfileModalOpen(false);
              setIsPaymentModalOpen(true);
            }
          }}
        />
      )}
    </main>
  );
}
