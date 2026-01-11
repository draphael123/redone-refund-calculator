"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { SelectedMedication, WEEK_OPTIONS } from "@/lib/types";
import {
  MEDICATION_PRICING,
  getMedicationCategories,
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
  const [darkMode, setDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const categories = ["All", ...getMedicationCategories()];

  // Close settings when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize dark mode from localStorage (default to dark)
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    // Only switch to light mode if explicitly set to false
    if (savedDarkMode === "false") {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark-bg");
    } else {
      // Default to dark mode
      setDarkMode(true);
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark-bg");
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark-bg");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark-bg");
    }
  };

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

  // Clear all selections
  const clearAll = () => {
    setAmountPaid("");
    setWeeksPaidFor(4);
    setSelectedMedications([]);
    setCategoryFilter("All");
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

  const hasData = amountPaid !== "" || selectedMedications.length > 0;

  return (
    <div className="min-h-screen py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            {/* Settings Button */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 sm:p-3 rounded-xl bg-white/20 backdrop-blur hover:bg-white/30 transition-all"
                aria-label="Settings"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              {/* Settings Dropdown */}
              {showSettings && (
                <div className={`absolute left-0 top-full mt-2 w-64 rounded-xl shadow-xl overflow-hidden z-50 ${darkMode ? "bg-slate-800" : "bg-white"}`}>
                  <div className={`px-4 py-3 border-b ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
                    <h3 className={`font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>Settings</h3>
                  </div>
                  <div className="p-3">
                    {/* Dark Mode Toggle */}
                    <div className={`flex items-center justify-between p-2 rounded-lg ${darkMode ? "bg-slate-700/50" : "bg-slate-50"}`}>
                      <div className="flex items-center gap-3">
                        {darkMode ? (
                          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                        )}
                        <span className={`text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                          Dark Mode
                        </span>
                      </div>
                      <button
                        onClick={toggleDarkMode}
                        className={`relative w-11 h-6 rounded-full transition-colors ${darkMode ? "bg-blue-500" : "bg-slate-300"}`}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${darkMode ? "left-6" : "left-1"}`} />
                      </button>
                    </div>
                  </div>

                  {/* Show Instructions Toggle - Bottom Section */}
                  <div className={`px-3 pb-3 pt-2 border-t ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
                    <div className={`flex items-center justify-between p-2 rounded-lg ${darkMode ? "bg-slate-700/50" : "bg-slate-50"}`}>
                      <div className="flex items-center gap-3">
                        <svg className={`w-5 h-5 ${darkMode ? "text-blue-400" : "text-blue-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className={`text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                          Show Instructions
                        </span>
                      </div>
                      <button
                        onClick={() => setShowInstructions(!showInstructions)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${showInstructions ? "bg-blue-500" : darkMode ? "bg-slate-600" : "bg-slate-300"}`}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${showInstructions ? "left-6" : "left-1"}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold text-white drop-shadow-lg">
              Refund Calculator
            </h1>

            {/* Clear All Button */}
            <button
              onClick={clearAll}
              disabled={!hasData}
              className={`p-2 sm:p-3 rounded-xl backdrop-blur transition-all flex items-center gap-1 sm:gap-2 text-sm sm:text-base ${
                hasData
                  ? "bg-red-500/20 hover:bg-red-500/30 text-white"
                  : "bg-white/10 text-white/50 cursor-not-allowed"
              }`}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="hidden sm:inline">Clear All</span>
            </button>
          </div>
          <p className="text-white/80 text-sm sm:text-lg">
            Calculate patient refunds based on medications received
          </p>
        </header>

        {/* Instructions Card */}
        {showInstructions && (
          <div className={`card backdrop-blur rounded-2xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6 card-glow ${darkMode ? "bg-slate-800/95" : "bg-white/95"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className={`text-base sm:text-lg font-semibold mb-3 flex items-center gap-2 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                  <svg
                    className="w-5 h-5 flex-shrink-0"
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
                <ol className={`space-y-2 text-xs sm:text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                  <li className="flex items-start gap-2">
                    <span className={`rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${darkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-600"}`}>
                      1
                    </span>
                    <span>
                      Enter the <strong>Amount Paid</strong> - the total subscription price
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className={`rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${darkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-600"}`}>
                      2
                    </span>
                    <span>
                      Select <strong>Weeks Paid For</strong> - the subscription duration
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className={`rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${darkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-600"}`}>
                      3
                    </span>
                    <span>
                      Filter by category and check medications received
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className={`rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${darkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-600"}`}>
                      4
                    </span>
                    <span>
                      Adjust <strong>Weeks Received</strong> per medication if needed
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className={`rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${darkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-600"}`}>
                      5
                    </span>
                    <span>
                      <strong>Refund Due</strong> = Amount Paid - Medication Value
                    </span>
                  </li>
                </ol>
              </div>
              <button
                onClick={() => setShowInstructions(false)}
                className={`p-1 ${darkMode ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Inputs */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Payment Details Card */}
            <div className={`card backdrop-blur rounded-2xl shadow-xl p-4 sm:p-6 card-glow ${darkMode ? "bg-slate-800/95" : "bg-white/95"}`}>
              <h2 className={`text-base sm:text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                <span className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Payment Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Amount Paid */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Amount Paid
                  </label>
                  <div className="relative">
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-medium ${darkMode ? "text-slate-400" : "text-slate-400"}`}>
                      $
                    </span>
                    <input
                      type="number"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base sm:text-lg ${
                        darkMode
                          ? "bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                          : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                      }`}
                    />
                  </div>
                </div>

                {/* Weeks Paid For */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Weeks Paid For
                  </label>
                  <select
                    value={weeksPaidFor}
                    onChange={(e) => setWeeksPaidFor(parseInt(e.target.value))}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base sm:text-lg appearance-none cursor-pointer ${
                      darkMode
                        ? "bg-slate-700 border-slate-600 text-white"
                        : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
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
            <div className={`card backdrop-blur rounded-2xl shadow-xl p-4 sm:p-6 card-glow ${darkMode ? "bg-slate-800/95" : "bg-white/95"}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h2 className={`text-base sm:text-lg font-semibold flex items-center gap-2 ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                  <span className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </span>
                  Select Medications
                </h2>

                {/* Category Filter - Horizontal scroll on mobile */}
                <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-0 -mx-1 px-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setCategoryFilter(category)}
                      className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap flex-shrink-0 ${
                        categoryFilter === category
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                          : darkMode
                            ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Medication Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
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
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? darkMode
                            ? "border-blue-500 bg-blue-900/30"
                            : "border-blue-500 bg-indigo-50"
                          : darkMode
                            ? "border-slate-600 bg-slate-700/50 hover:border-slate-500"
                            : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleMedication(medication.id)}
                          className="w-5 h-5 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 medication-checkbox cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className={`font-medium text-sm sm:text-base ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                              {medication.name}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                              darkMode ? "bg-slate-600 text-slate-300" : "bg-slate-100 text-slate-600"
                            }`}>
                              {medication.category}
                            </span>
                          </div>
                          <div className={`text-xs sm:text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                            {formatCurrency(medication.costPerWeek)}/week
                          </div>

                          {isSelected && (
                            <div className="mt-2 sm:mt-3 flex items-center gap-2">
                              <label className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                                Weeks:
                              </label>
                              <select
                                value={selectedMed?.weeksReceived || weeksPaidFor}
                                onChange={(e) =>
                                  updateWeeksReceived(
                                    medication.id,
                                    parseInt(e.target.value)
                                  )
                                }
                                className={`px-2 py-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                                  darkMode
                                    ? "bg-slate-600 border-blue-400 text-white"
                                    : "bg-white border-blue-300 text-slate-900"
                                }`}
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
            <div className="sticky top-4 space-y-4 sm:space-y-6">
              {/* Results Card */}
              <div className={`card backdrop-blur rounded-2xl shadow-xl overflow-hidden card-glow ${darkMode ? "bg-slate-800/95" : "bg-white/95"}`}>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 sm:px-6 py-3 sm:py-4">
                  <h2 className="text-base sm:text-lg font-semibold text-white">
                    Calculation Results
                  </h2>
                </div>

                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className={`flex justify-between items-center py-2 border-b ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
                    <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Amount Paid</span>
                    <span className={`font-semibold text-sm sm:text-base ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                      {formatCurrency(calculation.amountPaid)}
                    </span>
                  </div>

                  <div className={`flex justify-between items-center py-2 border-b ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
                    <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Weeks Paid For</span>
                    <span className={`font-semibold text-sm sm:text-base ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                      {calculation.weeksPaidFor} weeks
                    </span>
                  </div>

                  <div className={`flex justify-between items-center py-2 border-b ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
                    <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Medication Value</span>
                    <span className="font-semibold text-sm sm:text-base text-rose-500">
                      -{formatCurrency(calculation.totalMedicationValue)}
                    </span>
                  </div>

                  <div className={`flex justify-between items-center py-3 sm:py-4 rounded-xl px-3 sm:px-4 -mx-2 ${
                    darkMode ? "bg-emerald-900/30" : "bg-gradient-to-r from-emerald-50 to-teal-50"
                  }`}>
                    <span className={`text-sm sm:text-lg font-semibold ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                      Refund Due
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-emerald-500">
                      {formatCurrency(calculation.refundDue)}
                    </span>
                  </div>

                  {/* Refund Eligibility Note */}
                  <p className={`text-xs mt-4 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    <span className={`font-medium ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Note:</span> We may make exceptions for refunds due to CEs, but please go off the refund amount listed in this calculator in most cases.
                  </p>
                </div>
              </div>

              {/* Breakdown Card */}
              {calculation.breakdown.length > 0 && (
                <div className={`card backdrop-blur rounded-2xl shadow-xl p-4 sm:p-6 card-glow ${darkMode ? "bg-slate-800/95" : "bg-white/95"}`}>
                  <h3 className={`text-xs sm:text-sm font-semibold uppercase tracking-wide mb-3 sm:mb-4 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Medication Breakdown
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {calculation.breakdown.map((item) => (
                      <div
                        key={item.medication.id}
                        className={`flex justify-between items-center py-2 border-b last:border-0 ${darkMode ? "border-slate-700" : "border-slate-100"}`}
                      >
                        <div>
                          <div className={`font-medium text-xs sm:text-sm ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                            {item.medication.name}
                          </div>
                          <div className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
                            {item.weeksReceived}wk @ {formatCurrency(item.medication.costPerWeek)}/wk
                          </div>
                        </div>
                        <span className={`font-semibold text-sm ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
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
                className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
                  calculation.breakdown.length > 0
                    ? "btn-primary"
                    : darkMode
                      ? "bg-slate-700 cursor-not-allowed"
                      : "bg-slate-300 cursor-not-allowed"
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <footer className="mt-8 sm:mt-12 text-center text-white/60 text-xs sm:text-sm">
          <p>Medication costs based on COGS spreadsheet data</p>
        </footer>
      </div>
    </div>
  );
}
