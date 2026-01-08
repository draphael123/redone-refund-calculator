/**
 * Represents pricing data for a single medication
 */
export interface MedicationPricing {
  /** Unique identifier for the medication */
  id: string;
  /** Display name of the medication */
  name: string;
  /** Category/treatment type (e.g., "TRT", "HRT", "GLP-1") */
  category: string;
  /** Cost for 28-day supply (base pricing unit) */
  cost28Day: number;
  /** Cost for 56-day supply (optional, will be calculated if not provided) */
  cost56Day?: number;
  /** Cost for 84-day supply (optional, will be calculated if not provided) */
  cost84Day?: number;
}

/**
 * Represents a single medication line item in the refund calculation
 */
export interface MedicationLineItem {
  /** Unique identifier for this line item */
  id: string;
  /** Reference to the medication ID from pricing data */
  medicationId: string;
  /** Number of days supplied */
  daysSupplied: number;
  /** Optional manual override value (USD) */
  overrideValue?: number;
}

/**
 * Represents the breakdown of a single medication's calculated value
 */
export interface MedicationBreakdown {
  /** The line item this breakdown is for */
  lineItem: MedicationLineItem;
  /** The medication pricing data */
  medication: MedicationPricing;
  /** The calculated or overridden value */
  calculatedValue: number;
  /** Whether an override was used */
  isOverridden: boolean;
  /** Description of how the value was calculated */
  calculationMethod: string;
}

/**
 * Represents the complete refund calculation result
 */
export interface RefundCalculation {
  /** The subscription price entered */
  subscriptionPrice: number;
  /** Total value of all medications */
  totalMedicationValue: number;
  /** The refund amount due (never negative) */
  refundDue: number;
  /** Breakdown of each medication's value */
  breakdown: MedicationBreakdown[];
}

/**
 * Standard day supply options
 */
export const DAY_SUPPLY_PRESETS = [28, 56, 84] as const;
export type DaySupplyPreset = (typeof DAY_SUPPLY_PRESETS)[number];

