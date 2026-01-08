"use client";

import { useState } from "react";
import { MEDICATION_PRICING, getMedicationCategories } from "@/lib/pricing";
import { formatCurrency } from "@/lib/calculations";

interface PricingReferenceProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PricingReference({ isOpen, onClose }: PricingReferenceProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = getMedicationCategories();

  // Filter medications
  const filteredMedications = MEDICATION_PRICING.filter((m) => {
    const matchesSearch =
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[80vh] bg-white rounded-xl shadow-xl overflow-hidden mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">
            Pricing Reference
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search medications..."
                className="w-full px-4 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={`
                  px-3 py-1.5 text-xs font-medium rounded-md transition-colors
                  ${
                    selectedCategory === null
                      ? "bg-neutral-900 text-white"
                      : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
                  }
                `}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-3 py-1.5 text-xs font-medium rounded-md transition-colors
                    ${
                      selectedCategory === category
                        ? "bg-neutral-900 text-white"
                        : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-y-auto max-h-[calc(80vh-160px)]">
          <table className="w-full">
            <thead className="sticky top-0 bg-white border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wide">
                  Medication
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wide">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wide">
                  28 Days
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wide">
                  56 Days
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wide">
                  84 Days
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredMedications.map((medication) => (
                <tr
                  key={medication.id}
                  className="hover:bg-neutral-50 transition-colors"
                >
                  <td className="px-6 py-3 text-sm text-neutral-900">
                    {medication.name}
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex px-2 py-0.5 text-xs font-medium text-neutral-600 bg-neutral-100 rounded">
                      {medication.category}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-neutral-900 text-right font-mono">
                    {formatCurrency(medication.cost28Day)}
                  </td>
                  <td className="px-6 py-3 text-sm text-neutral-900 text-right font-mono">
                    {medication.cost56Day
                      ? formatCurrency(medication.cost56Day)
                      : "-"}
                  </td>
                  <td className="px-6 py-3 text-sm text-neutral-900 text-right font-mono">
                    {medication.cost84Day
                      ? formatCurrency(medication.cost84Day)
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredMedications.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-neutral-500">
              No medications found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

