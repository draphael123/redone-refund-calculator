"use client";

import { useState, useRef, useEffect } from "react";
import { MedicationPricing } from "@/lib/types";
import { MEDICATION_PRICING, getMedicationCategories } from "@/lib/pricing";

interface MedicationSelectorProps {
  value: string;
  onChange: (medicationId: string) => void;
  disabled?: boolean;
}

export function MedicationSelector({
  value,
  onChange,
  disabled = false,
}: MedicationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = getMedicationCategories();

  const selectedMedication = MEDICATION_PRICING.find((m) => m.id === value);

  // Filter medications based on search
  const filteredMedications = search
    ? MEDICATION_PRICING.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.category.toLowerCase().includes(search.toLowerCase())
      )
    : MEDICATION_PRICING;

  // Group by category
  const groupedMedications = categories.reduce(
    (acc, category) => {
      const meds = filteredMedications.filter((m) => m.category === category);
      if (meds.length > 0) {
        acc[category] = meds;
      }
      return acc;
    },
    {} as Record<string, MedicationPricing[]>
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (medication: MedicationPricing) => {
    onChange(medication.id);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setTimeout(() => inputRef.current?.focus(), 0);
          }
        }}
        disabled={disabled}
        className={`
          w-full px-3 py-2 text-left text-sm
          bg-white border border-neutral-200 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
          disabled:bg-neutral-50 disabled:cursor-not-allowed
          ${isOpen ? "ring-2 ring-neutral-900 border-transparent" : ""}
        `}
      >
        {selectedMedication ? (
          <span className="text-neutral-900">{selectedMedication.name}</span>
        ) : (
          <span className="text-neutral-400">Select medication...</span>
        )}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 border-b border-neutral-100">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medications..."
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-400"
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {Object.keys(groupedMedications).length === 0 ? (
              <div className="px-3 py-4 text-sm text-neutral-500 text-center">
                No medications found
              </div>
            ) : (
              Object.entries(groupedMedications).map(([category, meds]) => (
                <div key={category}>
                  <div className="px-3 py-2 text-xs font-medium text-neutral-500 uppercase tracking-wide bg-neutral-50">
                    {category}
                  </div>
                  {meds.map((medication) => (
                    <button
                      key={medication.id}
                      type="button"
                      onClick={() => handleSelect(medication)}
                      className={`
                        w-full px-3 py-2 text-left text-sm
                        hover:bg-neutral-50 transition-colors
                        ${value === medication.id ? "bg-neutral-100" : ""}
                      `}
                    >
                      {medication.name}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

