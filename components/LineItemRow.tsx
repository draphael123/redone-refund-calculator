"use client";

import { MedicationLineItem, DAY_SUPPLY_PRESETS } from "@/lib/types";
import { MedicationSelector } from "./MedicationSelector";

interface LineItemRowProps {
  lineItem: MedicationLineItem;
  onUpdate: (updates: Partial<MedicationLineItem>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function LineItemRow({
  lineItem,
  onUpdate,
  onRemove,
  canRemove,
}: LineItemRowProps) {
  return (
    <div className="p-4 bg-white border border-neutral-200 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-3">
          {/* Medication Selector */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1.5">
              Medication
            </label>
            <MedicationSelector
              value={lineItem.medicationId}
              onChange={(medicationId) => onUpdate({ medicationId })}
            />
          </div>

          {/* Days Supplied */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1.5">
              Days Supplied
            </label>
            <div className="flex items-center gap-2">
              {/* Preset buttons */}
              <div className="flex gap-1">
                {DAY_SUPPLY_PRESETS.map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => onUpdate({ daysSupplied: days })}
                    className={`
                      px-3 py-1.5 text-xs font-medium rounded-md transition-colors
                      ${
                        lineItem.daysSupplied === days
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }
                    `}
                  >
                    {days}
                  </button>
                ))}
              </div>
              {/* Custom input */}
              <input
                type="number"
                value={lineItem.daysSupplied}
                onChange={(e) =>
                  onUpdate({
                    daysSupplied: Math.max(1, parseInt(e.target.value) || 1),
                  })
                }
                min="1"
                className="w-20 px-3 py-1.5 text-sm bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
              <span className="text-xs text-neutral-500">days</span>
            </div>
          </div>

          {/* Override Value */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1.5">
              Override Value (optional)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500">$</span>
              <input
                type="number"
                value={lineItem.overrideValue ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  onUpdate({
                    overrideValue:
                      val === "" ? undefined : Math.max(0, parseFloat(val) || 0),
                  });
                }}
                placeholder="Auto-calculated"
                min="0"
                step="0.01"
                className="w-32 px-3 py-1.5 text-sm bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder:text-neutral-400"
              />
              {lineItem.overrideValue !== undefined && (
                <button
                  type="button"
                  onClick={() => onUpdate({ overrideValue: undefined })}
                  className="text-xs text-neutral-500 hover:text-neutral-700 underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Remove button */}
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors"
            title="Remove medication"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

