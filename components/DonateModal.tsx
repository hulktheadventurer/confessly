'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

const candleTiers = [
  { label: "Single Candle", count: 1, price: 0.99 },
  { label: "Small Bundle (3)", count: 3, price: 2.49 },
  { label: "Medium Bundle (5)", count: 5, price: 3.99 },
  { label: "Large Bundle (10)", count: 10, price: 6.99 },
  { label: "Custom", count: 0, price: 0 },
];

export default function DonateModal({
  isOpen,
  onClose,
  confessionId,
  allowCustom = true,
}: {
  isOpen: boolean;
  onClose: () => void;
  confessionId?: string;
  allowCustom?: boolean;
}) {
  const [selectedTier, setSelectedTier] = useState(candleTiers[0]);
  const [customCount, setCustomCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleDonate = async () => {
    const candles = selectedTier.label === 'Custom' ? customCount : selectedTier.count;
    const amount = Number(
      selectedTier.label === 'Custom'
        ? (customCount * 0.99).toFixed(2)
        : selectedTier.price
    );

    if (!candles || candles <= 0) {
      toast.error('Invalid candle amount');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, candles, confessionId }),
      });

      const data = await res.json();

      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error('Something went wrong with checkout');
      }
    } catch (err) {
      toast.error('Error creating Stripe session');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-30 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full relative shadow-lg max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-lg font-bold"
        >
          ✖
        </button>
        <h2 className="text-center text-lg font-semibold text-amber-700 mb-4">
          Donation
        </h2>

        <div className="space-y-2">
          {candleTiers.map((tier) =>
            tier.label === 'Custom' && !allowCustom ? null : (
              <button
                key={tier.label}
                className={`block w-full text-left px-4 py-2 rounded font-medium ${
                  selectedTier.label === tier.label
                    ? "bg-amber-700 text-white"
                    : "bg-amber-600 text-white hover:bg-amber-700"
                }`}
                onClick={() => setSelectedTier(tier)}
              >
                {tier.label}{" "}
                {tier.label === "Custom"
                  ? "- Set your amount"
                  : `- £${tier.price}`}
              </button>
            )
          )}

          {selectedTier.label === "Custom" && (
            <input
              type="number"
              min={1}
              value={customCount}
              onChange={(e) => setCustomCount(parseInt(e.target.value) || 1)}
              className="mt-2 w-full p-2 border rounded text-center"
              placeholder="Number of candles"
            />
          )}

          <button
            onClick={handleDonate}
            disabled={loading}
            className={`mt-4 w-full py-2 rounded font-semibold ${
              loading
                ? "bg-amber-300 text-white cursor-wait"
                : "bg-amber-600 text-white hover:bg-amber-700"
            }`}
          >
            {loading ? "Processing..." : "Donate"}
          </button>
        </div>
      </div>
    </div>
  );
}
