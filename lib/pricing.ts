import { MedicationPricing } from "./types";

/**
 * Medication pricing data derived from COGS spreadsheet
 * All costs are in USD
 */
export const MEDICATION_PRICING: MedicationPricing[] = [
  // Testosterone Replacement Therapy (TRT)
  {
    id: "testosterone-cypionate-200",
    name: "Testosterone Cypionate 200mg/mL",
    category: "TRT",
    cost28Day: 25.0,
    cost56Day: 48.0,
    cost84Day: 70.0,
  },
  {
    id: "testosterone-cypionate-100",
    name: "Testosterone Cypionate 100mg/mL",
    category: "TRT",
    cost28Day: 22.0,
    cost56Day: 42.0,
    cost84Day: 62.0,
  },
  {
    id: "testosterone-enanthate-200",
    name: "Testosterone Enanthate 200mg/mL",
    category: "TRT",
    cost28Day: 28.0,
    cost56Day: 54.0,
    cost84Day: 78.0,
  },
  {
    id: "hcg-5000",
    name: "HCG 5000 IU",
    category: "TRT",
    cost28Day: 35.0,
    cost56Day: 68.0,
    cost84Day: 100.0,
  },
  {
    id: "anastrozole-1mg",
    name: "Anastrozole 1mg",
    category: "TRT",
    cost28Day: 12.0,
    cost56Day: 22.0,
    cost84Day: 32.0,
  },
  {
    id: "gonadorelin-2mg",
    name: "Gonadorelin 2mg",
    category: "TRT",
    cost28Day: 45.0,
    cost56Day: 88.0,
    cost84Day: 130.0,
  },

  // Hormone Replacement Therapy (HRT)
  {
    id: "estradiol-valerate",
    name: "Estradiol Valerate 20mg/mL",
    category: "HRT",
    cost28Day: 30.0,
    cost56Day: 58.0,
    cost84Day: 85.0,
  },
  {
    id: "progesterone-100mg",
    name: "Progesterone 100mg",
    category: "HRT",
    cost28Day: 18.0,
    cost56Day: 34.0,
    cost84Day: 50.0,
  },
  {
    id: "progesterone-200mg",
    name: "Progesterone 200mg",
    category: "HRT",
    cost28Day: 24.0,
    cost56Day: 46.0,
    cost84Day: 68.0,
  },
  {
    id: "dhea-25mg",
    name: "DHEA 25mg",
    category: "HRT",
    cost28Day: 15.0,
    cost56Day: 28.0,
    cost84Day: 40.0,
  },

  // GLP-1 Agonists
  {
    id: "semaglutide-0.25",
    name: "Semaglutide 0.25mg",
    category: "GLP-1",
    cost28Day: 150.0,
    cost56Day: 295.0,
    cost84Day: 440.0,
  },
  {
    id: "semaglutide-0.5",
    name: "Semaglutide 0.5mg",
    category: "GLP-1",
    cost28Day: 175.0,
    cost56Day: 345.0,
    cost84Day: 510.0,
  },
  {
    id: "semaglutide-1.0",
    name: "Semaglutide 1.0mg",
    category: "GLP-1",
    cost28Day: 200.0,
    cost56Day: 395.0,
    cost84Day: 585.0,
  },
  {
    id: "semaglutide-2.5",
    name: "Semaglutide 2.5mg",
    category: "GLP-1",
    cost28Day: 250.0,
    cost56Day: 495.0,
    cost84Day: 735.0,
  },
  {
    id: "tirzepatide-2.5",
    name: "Tirzepatide 2.5mg",
    category: "GLP-1",
    cost28Day: 225.0,
    cost56Day: 445.0,
    cost84Day: 660.0,
  },
  {
    id: "tirzepatide-5.0",
    name: "Tirzepatide 5.0mg",
    category: "GLP-1",
    cost28Day: 275.0,
    cost56Day: 545.0,
    cost84Day: 810.0,
  },
  {
    id: "tirzepatide-7.5",
    name: "Tirzepatide 7.5mg",
    category: "GLP-1",
    cost28Day: 325.0,
    cost56Day: 645.0,
    cost84Day: 960.0,
  },
  {
    id: "tirzepatide-10",
    name: "Tirzepatide 10mg",
    category: "GLP-1",
    cost28Day: 375.0,
    cost56Day: 745.0,
    cost84Day: 1110.0,
  },

  // Ancillary / Support Medications
  {
    id: "b12-injection",
    name: "Vitamin B12 Injection",
    category: "Ancillary",
    cost28Day: 8.0,
    cost56Day: 15.0,
    cost84Day: 22.0,
  },
  {
    id: "glutathione-200",
    name: "Glutathione 200mg/mL",
    category: "Ancillary",
    cost28Day: 40.0,
    cost56Day: 78.0,
    cost84Day: 115.0,
  },
  {
    id: "nad-100",
    name: "NAD+ 100mg",
    category: "Ancillary",
    cost28Day: 85.0,
    cost56Day: 168.0,
    cost84Day: 250.0,
  },
  {
    id: "lipo-c-injection",
    name: "Lipo-C Injection",
    category: "Ancillary",
    cost28Day: 35.0,
    cost56Day: 68.0,
    cost84Day: 100.0,
  },
  {
    id: "syringes-kit",
    name: "Syringes/Supplies Kit",
    category: "Supplies",
    cost28Day: 10.0,
    cost56Day: 18.0,
    cost84Day: 25.0,
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

