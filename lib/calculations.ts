import {
  MedicationPricing,
  MedicationLineItem,
  MedicationBreakdown,
  RefundCalculation,
} from "./types";
import { getMedicationById } from "./pricing";

/**
 * Base number of days for pricing calculations
 */
const BASE_DAYS = 28;

/**
 * Calculate the cost for a medication based on days supplied
 * Uses exact pricing when available, otherwise scales linearly from 28-day cost
 */
export function calculateMedicationCost(
  medication: MedicationPricing,
  daysSupplied: number
): { cost: number; method: string } {
  // Check for exact day match first
  if (daysSupplied === 28 && medication.cost28Day !== undefined) {
    return {
      cost: medication.cost28Day,
      method: "28-day pricing",
    };
  }

  if (daysSupplied === 56 && medication.cost56Day !== undefined) {
    return {
      cost: medication.cost56Day,
      method: "56-day pricing",
    };
  }

  if (daysSupplied === 84 && medication.cost84Day !== undefined) {
    return {
      cost: medication.cost84Day,
      method: "84-day pricing",
    };
  }

  // No exact match - calculate linear scaling from 28-day cost
  const dailyRate = medication.cost28Day / BASE_DAYS;
  const scaledCost = dailyRate * daysSupplied;

  return {
    cost: roundToTwoDecimals(scaledCost),
    method: `Linear scaling (${daysSupplied} days at $${dailyRate.toFixed(
      4
    )}/day)`,
  };
}

/**
 * Calculate the value for a single medication line item
 */
export function calculateLineItemValue(
  lineItem: MedicationLineItem
): MedicationBreakdown | null {
  const medication = getMedicationById(lineItem.medicationId);

  if (!medication) {
    return null;
  }

  // If override value is provided, use it
  if (
    lineItem.overrideValue !== undefined &&
    lineItem.overrideValue !== null &&
    lineItem.overrideValue >= 0
  ) {
    return {
      lineItem,
      medication,
      calculatedValue: lineItem.overrideValue,
      isOverridden: true,
      calculationMethod: "Manual override",
    };
  }

  // Calculate based on days supplied
  const { cost, method } = calculateMedicationCost(
    medication,
    lineItem.daysSupplied
  );

  return {
    lineItem,
    medication,
    calculatedValue: cost,
    isOverridden: false,
    calculationMethod: method,
  };
}

/**
 * Calculate the complete refund
 */
export function calculateRefund(
  subscriptionPrice: number,
  lineItems: MedicationLineItem[]
): RefundCalculation {
  // Calculate breakdown for each line item
  const breakdown: MedicationBreakdown[] = [];

  for (const lineItem of lineItems) {
    const itemBreakdown = calculateLineItemValue(lineItem);
    if (itemBreakdown) {
      breakdown.push(itemBreakdown);
    }
  }

  // Sum all medication values
  const totalMedicationValue = breakdown.reduce(
    (sum, item) => sum + item.calculatedValue,
    0
  );

  // Calculate refund (never negative)
  const refundDue = Math.max(0, subscriptionPrice - totalMedicationValue);

  return {
    subscriptionPrice,
    totalMedicationValue: roundToTwoDecimals(totalMedicationValue),
    refundDue: roundToTwoDecimals(refundDue),
    breakdown,
  };
}

/**
 * Round a number to two decimal places
 */
function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Format a number as USD currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Generate a copyable text summary of the refund calculation
 */
export function generateRefundSummary(calculation: RefundCalculation): string {
  const lines: string[] = [];

  lines.push("REFUND CALCULATION SUMMARY");
  lines.push("=".repeat(40));
  lines.push("");
  lines.push(`Subscription Price: ${formatCurrency(calculation.subscriptionPrice)}`);
  lines.push("");
  lines.push("MEDICATIONS:");
  lines.push("-".repeat(40));

  for (const item of calculation.breakdown) {
    lines.push(`${item.medication.name}`);
    lines.push(`  Days Supplied: ${item.lineItem.daysSupplied}`);
    lines.push(`  Value: ${formatCurrency(item.calculatedValue)}`);
    if (item.isOverridden) {
      lines.push(`  (Manual Override)`);
    }
    lines.push("");
  }

  lines.push("-".repeat(40));
  lines.push(
    `Total Medication Value: ${formatCurrency(calculation.totalMedicationValue)}`
  );
  lines.push(`REFUND DUE: ${formatCurrency(calculation.refundDue)}`);
  lines.push("=".repeat(40));

  return lines.join("\n");
}

