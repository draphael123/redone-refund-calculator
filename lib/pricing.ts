import { MedicationPricing } from "./types";

/**
 * Medication pricing data derived from COGS spreadsheet
 * (Membership Payment Breakdowns Itemized Receipts)
 * All costs are in USD and include shipping/dispensing
 */
export const MEDICATION_PRICING: MedicationPricing[] = [
  // Testosterone Replacement Therapy (TRT)
  {
    id: "t-cypionate",
    name: "Testosterone Cypionate",
    category: "TRT",
    costPerWeek: 10.125,
    cost4Week: 40.50,
    cost8Week: 81.00,
    cost12Week: 121.50,
  },
  {
    id: "t-cream",
    name: "Testosterone Cream",
    category: "TRT",
    costPerWeek: 12.39,
    cost4Week: 49.56,
    cost8Week: 99.12,
    cost12Week: 148.68,
  },
  {
    id: "enclomiphene-25mg",
    name: "Enclomiphene (25mg)",
    category: "TRT",
    costPerWeek: 17.00,
    cost4Week: 68.00,
    cost8Week: 136.00,
    cost12Week: 204.00,
  },

  // Erectile Dysfunction (ED)
  {
    id: "tadalafil-5mg",
    name: "Tadalafil (5mg)",
    category: "ED",
    costPerWeek: 1.88,
    cost4Week: 7.51,
    cost8Week: 15.02,
    cost12Week: 22.52,
  },
  {
    id: "sildenafil-20mg",
    name: "Sildenafil (20mg)",
    category: "ED",
    costPerWeek: 2.23,
    cost4Week: 8.91,
    cost8Week: 17.82,
    cost12Week: 26.72,
  },

  // Hormone Replacement Therapy (HRT)
  {
    id: "t-est-cream",
    name: "T/Est Cream",
    category: "HRT",
    costPerWeek: 8.325,
    cost4Week: 33.30,
    cost8Week: 66.60,
    cost12Week: 99.90,
  },
  {
    id: "progesterone",
    name: "Progesterone",
    category: "HRT",
    costPerWeek: 0,
    cost4Week: 0,
    cost8Week: 0,
    cost12Week: 0,
  },

  // GLP-1 Agonists (Weight Loss)
  {
    id: "semaglutide",
    name: "Semaglutide",
    category: "GLP-1",
    costPerWeek: 37.50,
    cost4Week: 150.00,
    cost8Week: 300.00,
    cost12Week: 450.00,
  },
  {
    id: "tirzepatide",
    name: "Tirzepatide",
    category: "GLP-1",
    costPerWeek: 93.75,
    cost4Week: 375.00,
    cost8Week: 750.00,
    cost12Week: 1125.00,
  },
];

/**
 * Get all unique medication categories
 */
export function getMedicationCategories(): string[] {
  const categories = new Set(MEDICATION_PRICING.map((m) => m.category));
  return Array.from(categories);
}

/**
 * Get medications filtered by category
 */
export function getMedicationsByCategory(
  category: string
): MedicationPricing[] {
  return MEDICATION_PRICING.filter((m) => m.category === category);
}

/**
 * Find a medication by its ID
 */
export function getMedicationById(id: string): MedicationPricing | undefined {
  return MEDICATION_PRICING.find((m) => m.id === id);
}

/**
 * Search medications by name (case-insensitive)
 */
export function searchMedications(query: string): MedicationPricing[] {
  const lowerQuery = query.toLowerCase();
  return MEDICATION_PRICING.filter(
    (m) =>
      m.name.toLowerCase().includes(lowerQuery) ||
      m.category.toLowerCase().includes(lowerQuery)
  );
}
