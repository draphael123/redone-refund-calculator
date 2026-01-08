"use client";

import { useState } from "react";
import { RefundCalculation } from "@/lib/types";
import { formatCurrency, generateRefundSummary } from "@/lib/calculations";

interface ResultsPanelProps {
  calculation: RefundCalculation | null;
}

export function ResultsPanel({ calculation }: ResultsPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!calculation) return;

    const summary = generateRefundSummary(calculation);
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!calculation) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-neutral-400 text-sm">
          Add medications to see calculation
        </p>
      </div>
    );
  }

  const hasValidItems = calculation.breakdown.length > 0;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="p-6 bg-white border border-neutral-200 rounded-lg">
        <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-4">
          Calculation Summary
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-neutral-600">Subscription Price</span>
            <span className="text-sm font-medium text-neutral-900">
              {formatCurrency(calculation.subscriptionPrice)}
            </span>
          </div>

          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-neutral-600">
              Total Medication Value
            </span>
            <span className="text-sm font-medium text-neutral-900">
              {formatCurrency(calculation.totalMedicationValue)}
            </span>
          </div>

          <div className="border-t border-neutral-200 pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-base font-medium text-neutral-900">
                Refund Due
              </span>
              <span className="text-2xl font-semibold text-neutral-900">
                {formatCurrency(calculation.refundDue)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      {hasValidItems && (
        <div className="p-6 bg-white border border-neutral-200 rounded-lg">
          <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-4">
            Medication Breakdown
          </h3>

          <div className="space-y-4">
            {calculation.breakdown.map((item, index) => (
              <div
                key={item.lineItem.id}
                className="pb-4 border-b border-neutral-100 last:border-0 last:pb-0"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-neutral-900">
                    {item.medication.name}
                  </span>
                  <span className="text-sm font-medium text-neutral-900">
                    {formatCurrency(item.calculatedValue)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-500">
                    {item.lineItem.daysSupplied} days
                    {item.isOverridden && " (override)"}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {item.calculationMethod}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Copy Button */}
      <button
        type="button"
        onClick={handleCopy}
        disabled={!hasValidItems}
        className={`
          w-full py-3 px-4 text-sm font-medium rounded-lg transition-colors
          flex items-center justify-center gap-2
          ${
            hasValidItems
              ? "bg-neutral-900 text-white hover:bg-neutral-800"
              : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
          }
        `}
      >
        {copied ? (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.5 4.5L6 12L2.5 8.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Copied to Clipboard
          </>
        ) : (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="5"
                y="5"
                width="8"
                height="8"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M3 10.5V3.5C3 2.94772 3.44772 2.5 4 2.5H11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Copy Summary
          </>
        )}
      </button>
    </div>
  );
}

