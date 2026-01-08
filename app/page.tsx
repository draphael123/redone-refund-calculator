"use client";

import { useState, useMemo } from "react";
import { SelectedMedication, WEEK_OPTIONS } from "@/lib/types";
import {
  MEDICATION_PRICING,
  getMedicationCategories,
  getMedicationById,
} from "@/lib/pricing";
import {
  calculateRefund,
  formatCurrency,
  generateRefundSummary,
} from "@/lib/calculations";

export default function RefundCalculator() {
  const [amountPaid, setAmountPaid] = useState<string>("");
  const [weeksPaidFor, setWeeksPaidFor] = useState<number>(4);
  const [selectedMedications, setSelectedMedications] = useState<
    SelectedMedication[]
  >([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [copied, setCopied] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const categories = ["All", ...getMedicationCategories()];

  const filteredMedications =
    categoryFilter === "All"
      ? MEDICATION_PRICING
      : MEDICATION_PRICING.filter((m) => m.category === categoryFilter);

  // Toggle medication selection
  const toggleMedication = (medicationId: string) => {
    setSelectedMedications((prev) => {
      const exists = prev.find((m) => m.id === medicationId);
      if (exists) {
        return prev.filter((m) => m.id !== medicationId);
      }
      return [...prev, { id: medicationId, weeksReceived: weeksPaidFor }];
    });
  };

  // Update weeks received for a medication
  const updateWeeksReceived = (medicationId: string, weeks: number) => {
    setSelectedMedications((prev) =>
      prev.map((m) =>
        m.id === medicationId ? { ...m, weeksReceived: weeks } : m
      )
    );
  };

  // Calculate refund
  const calculation = useMemo(() => {
    const paid = parseFloat(amountPaid) || 0;
    return calculateRefund(paid, weeksPaidFor, selectedMedications);
  }, [amountPaid, weeksPaidFor, selectedMedications]);

  // Copy summary to clipboard
  const handleCopy = async () => {
    const summary = generateRefundSummary(calculation);
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Refund Calculator
          </h1>
          <p className="text-white/80 text-lg">
            Calculate patient refunds based on medications received
          </p>
        </header>

        {/* Instructions Card */}
        {showInstructions && (
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 mb-6 card-glow">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-indigo-600 mb-3 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  How to Use This Calculator
                </h2>
                <ol className="text-slate-600 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-indigo-100 text-indigo-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      Enter the <strong>Amount Paid</strong> - the total subscription price the customer paid
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-indigo-100 text-indigo-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      Select <strong>Weeks Paid For</strong> - the subscription duration
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-indigo-100 text-indigo-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      Use the <strong>category filter</strong> to find medications, then check the boxes for medications the patient received
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-indigo-100 text-indigo-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      4
                    </span>
                    <span>
                      For each selected medication, adjust the <strong>Weeks Received</strong> if different from weeks paid for
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-indigo-100 text-indigo-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      5
                    </span>
                    <span>
                      The <strong>Refund Due</strong> is calculated automatically (Amount Paid - Medication Value)
                    </span>
                  </li>
                </ol>
              </div>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {!showInstructions && (
          <button
            onClick={() => setShowInstructions(true)}
            className="mb-4 text-white/80 hover:text-white text-sm flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Show Instructions
          </button>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Details Card */}
            <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 card-glow">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Payment Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Amount Paid */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Amount Paid
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                      $
                    </span>
                    <input
                      type="number"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-lg"
                    />
                  </div>
                </div>

                {/* Weeks Paid For */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Weeks Paid For
                  </label>
                  <select
                    value={weeksPaidFor}
                    onChange={(e) => setWeeksPaidFor(parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-lg appearance-none cursor-pointer"
                  >
                    {WEEK_OPTIONS.map((weeks) => (
                      <option key={weeks} value={weeks}>
                        {weeks} weeks
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Medications Card */}
            <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 card-glow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </span>
                  Select Medications Received
                </h2>

                {/* Category Filter */}
                <div className="flex gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setCategoryFilter(category)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                        categoryFilter === category
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Medication Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredMedications.map((medication) => {
                  const isSelected = selectedMedications.some(
                    (m) => m.id === medication.id
                  );
                  const selectedMed = selectedMedications.find(
                    (m) => m.id === medication.id
                  );

                  return (
                    <div
                      key={medication.id}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleMedication(medication.id)}
                          className="w-5 h-5 mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 medication-checkbox cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-slate-800 truncate">
                              {medication.name}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 ml-2">
                              {medication.category}
                            </span>
                          </div>
                          <div className="text-sm text-slate-500">
                            {formatCurrency(medication.costPerWeek)}/week
                          </div>

                          {isSelected && (
                            <div className="mt-3 flex items-center gap-2">
                              <label className="text-xs text-slate-600">
                                Weeks Received:
                              </label>
                              <select
                                value={selectedMed?.weeksReceived || weeksPaidFor}
                                onChange={(e) =>
                                  updateWeeksReceived(
                                    medication.id,
                                    parseInt(e.target.value)
                                  )
                                }
                                className="px-2 py-1 text-sm bg-white border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                              >
                                {Array.from({ length: 48 }, (_, i) => i + 1).map(
                                  (w) => (
                                    <option key={w} value={w}>
                                      {w}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Results Card */}
              <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl overflow-hidden card-glow">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
                  <h2 className="text-lg font-semibold text-white">
                    Calculation Results
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Amount Paid</span>
                    <span className="font-semibold text-slate-800">
                      {formatCurrency(calculation.amountPaid)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Weeks Paid For</span>
                    <span className="font-semibold text-slate-800">
                      {calculation.weeksPaidFor} weeks
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Medication Value</span>
                    <span className="font-semibold text-rose-600">
                      -{formatCurrency(calculation.totalMedicationValue)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl px-4 -mx-2">
                    <span className="text-lg font-semibold text-slate-800">
                      Refund Due
                    </span>
                    <span className="text-2xl font-bold text-emerald-600">
                      {formatCurrency(calculation.refundDue)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Breakdown Card */}
              {calculation.breakdown.length > 0 && (
                <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 card-glow">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                    Medication Breakdown
                  </h3>
                  <div className="space-y-3">
                    {calculation.breakdown.map((item) => (
                      <div
                        key={item.medication.id}
                        className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0"
                      >
                        <div>
                          <div className="font-medium text-slate-800 text-sm">
                            {item.medication.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {item.weeksReceived} weeks @ {formatCurrency(item.medication.costPerWeek)}/wk
                          </div>
                        </div>
                        <span className="font-semibold text-slate-800">
                          {formatCurrency(item.calculatedValue)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                disabled={calculation.breakdown.length === 0}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                  calculation.breakdown.length > 0
                    ? "btn-primary"
                    : "bg-slate-300 cursor-not-allowed"
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied to Clipboard
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Summary
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-white/60 text-sm">
          <p>Medication costs based on COGS spreadsheet data</p>
        </footer>
      </div>
    </div>
  );
}
