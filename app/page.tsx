"use client";

import { useState, useCallback, useMemo } from "react";
import { MedicationLineItem } from "@/lib/types";
import { calculateRefund } from "@/lib/calculations";
import { LineItemRow, ResultsPanel, PricingReference } from "@/components";

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function createEmptyLineItem(): MedicationLineItem {
  return {
    id: generateId(),
    medicationId: "",
    daysSupplied: 28,
    overrideValue: undefined,
  };
}

export default function RefundCalculator() {
  const [subscriptionPrice, setSubscriptionPrice] = useState<string>("");
  const [lineItems, setLineItems] = useState<MedicationLineItem[]>([
    createEmptyLineItem(),
  ]);
  const [isPricingRefOpen, setIsPricingRefOpen] = useState(false);

  // Add a new line item
  const addLineItem = useCallback(() => {
    setLineItems((prev) => [...prev, createEmptyLineItem()]);
  }, []);

  // Update a line item
  const updateLineItem = useCallback(
    (id: string, updates: Partial<MedicationLineItem>) => {
      setLineItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
    },
    []
  );

  // Remove a line item
  const removeLineItem = useCallback((id: string) => {
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Calculate refund
  const calculation = useMemo(() => {
    const price = parseFloat(subscriptionPrice) || 0;
    const validItems = lineItems.filter((item) => item.medicationId !== "");
    return calculateRefund(price, validItems);
  }, [subscriptionPrice, lineItems]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-neutral-900">
              Refund Calculator
            </h1>
            <button
              type="button"
              onClick={() => setIsPricingRefOpen(true)}
              className="px-4 py-2 text-sm font-medium text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              View Pricing
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Panel - Inputs */}
          <div className="lg:col-span-3 space-y-6">
            {/* Subscription Price */}
            <section className="p-6 bg-white border border-neutral-200 rounded-lg">
              <h2 className="text-sm font-medium text-neutral-900 mb-4">
                Subscription Price
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-lg text-neutral-500">$</span>
                <input
                  type="number"
                  value={subscriptionPrice}
                  onChange={(e) => setSubscriptionPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="flex-1 px-4 py-3 text-lg bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder:text-neutral-300"
                />
              </div>
            </section>

            {/* Medication Line Items */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-neutral-900">
                  Medications Received
                </h2>
                <button
                  type="button"
                  onClick={addLineItem}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 3V13M3 8H13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Add Medication
                </button>
              </div>

              <div className="space-y-3">
                {lineItems.map((item) => (
                  <LineItemRow
                    key={item.id}
                    lineItem={item}
                    onUpdate={(updates) => updateLineItem(item.id, updates)}
                    onRemove={() => removeLineItem(item.id)}
                    canRemove={lineItems.length > 1}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <ResultsPanel calculation={calculation} />
            </div>
          </div>
        </div>
      </main>

      {/* Pricing Reference Modal */}
      <PricingReference
        isOpen={isPricingRefOpen}
        onClose={() => setIsPricingRefOpen(false)}
      />
    </div>
  );
}

