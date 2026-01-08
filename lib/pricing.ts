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
    cost28Day: 40.50,
    cost56Day: 81.00,
    cost84Day: 121.50,
  },
  {
    id: "t-cream",
    name: "Testosterone Cream",
    category: "TRT",
    cost28Day: 49.56,
    cost56Day: 99.12,
    cost84Day: 148.68,
  },
  {
    id: "enclomiphene-25mg",
    name: "Enclomiphene (25mg)",
    category: "TRT",
    cost28Day: 68.00,
    cost56Day: 136.00,
    cost84Day: 204.00,
  },

  // Erectile Dysfunction (ED)
  {
    id: "tadalafil-5mg",
    name: "Tadalafil (5mg)",
    category: "ED",
    cost28Day: 7.51,
    cost56Day: 15.02,
    cost84Day: 22.52,
  },
  {
    id: "sildenafil-20mg",
    name: "Sildenafil (20mg)",
    category: "ED",
    cost28Day: 8.91,
    cost56Day: 17.82,
    cost84Day: 26.72,
  },

  // Hormone Replacement Therapy (HRT)
  {
    id: "t-est-cream",
    name: "T/Est Cream",
    category: "HRT",
    cost28Day: 33.30,
    cost56Day: 66.60,
    cost84Day: 99.90,
  },
  {
    id: "progesterone",
    name: "Progesterone",
    category: "HRT",
    cost28Day: 0,
    cost56Day: 0,
    cost84Day: 0,
  },

  // GLP-1 Agonists (Weight Loss)
  {
    id: "semaglutide",
    name: "Semaglutide",
    category: "GLP-1",
    cost28Day: 150.00,
    cost56Day: 300.00,
    cost84Day: 450.00,
  },
  {
    id: "tirzepatide",
    name: "Tirzepatide",
    category: "GLP-1",
    cost28Day: 375.00,
    cost56Day: 750.00,
    cost84Day: 1125.00,
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
