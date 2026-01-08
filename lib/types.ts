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
  /** Cost per week */
  costPerWeek: number;
  /** Cost for 4 weeks (28 days) */
  cost4Week: number;
  /** Cost for 8 weeks (56 days) */
  cost8Week: number;
  /** Cost for 12 weeks (84 days) */
  cost12Week: number;
}

/**
 * Represents a selected medication for refund calculation
 */
export interface SelectedMedication {
  id: string;
  weeksReceived: number;
}

/**
 * Represents the complete refund calculation result
 */
export interface RefundCalculation {
  /** The amount the customer paid */
  amountPaid: number;
  /** Number of weeks paid for */
  weeksPaidFor: number;
  /** Total value of medications received */
  totalMedicationValue: number;
  /** The refund amount due (never negative) */
  refundDue: number;
  /** Breakdown of each medication's value */
  breakdown: MedicationBreakdownItem[];
}

/**
 * Breakdown item for a single medication
 */
export interface MedicationBreakdownItem {
  medication: MedicationPricing;
  weeksReceived: number;
  calculatedValue: number;
}

/**
 * Standard week options for dropdowns
 */
export const WEEK_OPTIONS = [4, 8, 12, 16, 20, 24, 48] as const;
export type WeekOption = (typeof WEEK_OPTIONS)[number];
