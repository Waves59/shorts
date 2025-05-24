"use client";

import { useEffect, useState } from "react";

interface PaywallProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  isLoading?: boolean;
}

export default function Paywall({
  isOpen,
  onClose,
  onSubscribe,
  isLoading = false,
}: PaywallProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  const handleSubscribe = () => {
    onSubscribe();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center md:items-center items-end justify-center transition-all duration-300 ${
        isAnimating ? "bg-black/60 backdrop-blur-sm" : "bg-transparent"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`w-full max-w-md mx-4 md:mx-0 bg-neutral-tint-70 
          rounded-t-3xl md:rounded-3xl 
          border-t md:border border-neutral-tint-50/20 
          transition-all duration-300 transform 
          ${
            isAnimating
              ? "translate-y-0 md:scale-100 md:opacity-100"
              : "translate-y-full md:translate-y-0 md:scale-95 md:opacity-0"
          }`}
      >
        {/* Handle bar - only on mobile */}
        <div className="flex justify-center pt-3 pb-2 md:hidden"></div>

        {/* Content */}
        <div className="px-6 pb-8 md:pt-4">
          {/* Premium badge */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-brand-tint-40 to-brand-tint-30 px-4 py-2 rounded-full">
              <span className="text-white text-sm font-semibold tracking-wide">
                ✨ PREMIUM
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-white text-2xl font-bold mb-2">
              Unlock All Series for 1 Week
            </h2>
            <p className="text-brand-tint-40-opacity-10 text-lg">
              Access every episode instantly
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-brand-tint-40 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-white text-base">
                Unlimited access to all episodes
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-brand-tint-40 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-white text-base">
                Ad-free viewing experience
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-brand-tint-40 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-white text-base">
                Exclusive access to new episodes
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-neutral-tint-50/20 rounded-2xl p-4 mb-6">
            <div className="text-center">
              <div className="text-brand-tint-40 text-sm font-medium mb-1">
                🔥 50% OFF - Limited Time
              </div>
              <div className="text-white text-3xl font-bold mb-1">
                €7.99
                <span className="text-brand-tint-40-opacity-10 text-lg font-normal ml-2 line-through">
                  €14.99
                </span>
              </div>
              <div className="text-brand-tint-40-opacity-10 text-sm">
                Cancel anytime
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSubscribe}
              disabled={isLoading}
              className={`w-full font-semibold py-4 rounded-2xl transition-all duration-200 active:scale-95 ${
                isLoading
                  ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-brand-tint-40 to-brand-tint-30 text-white hover:from-brand-tint-50 hover:to-brand-tint-40"
              }`}
            >
              {isLoading ? "Processing..." : "Claim Now - 50% Off"}
            </button>

            <button
              onClick={onClose}
              className="w-full bg-transparent border-2 border-neutral-tint-50/30 text-brand-tint-40-opacity-10 font-medium py-3 rounded-2xl transition-all duration-200 hover:border-brand-tint-40/50 hover:text-white"
            >
              Maybe Later
            </button>
          </div>

          {/* Terms */}
          <div className="text-center mt-4">
            <p className="text-brand-tint-40-opacity-10/60 text-xs">
              By subscribing, you agree to our{" "}
              <span className="text-brand-tint-40 underline">
                terms of service
              </span>{" "}
              and{" "}
              <span className="text-brand-tint-40 underline">
                privacy policy
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
