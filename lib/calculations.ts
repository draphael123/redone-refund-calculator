import {
  MedicationPricing,
  SelectedMedication,
  MedicationBreakdownItem,
  RefundCalculation,
} from "./types";
import { getMedicationById } from "./pricing";

/**
 * Calculate the value of a medication based on weeks received
 */
export function calculateMedicationValue(
  medication: MedicationPricing,
  weeksReceived: number
): number {
  return roundToTwoDecimals(medication.costPerWeek * weeksReceived);
}

/**
 * Calculate the complete refund
 */
export function calculateRefund(
  amountPaid: number,
  weeksPaidFor: number,
  selectedMedications: SelectedMedication[]
): RefundCalculation {
  const breakdown: MedicationBreakdownItem[] = [];

  // Calculate value for each selected medication
  for (const selected of selectedMedications) {
    const medication = getMedicationById(selected.id);
    if (medication) {
      const value = calculateMedicationValue(medication, selected.weeksReceived);
      breakdown.push({
        medication,
        weeksReceived: selected.weeksReceived,
        calculatedValue: value,
      });
    }
  }

  // Sum all medication values
  const totalMedicationValue = breakdown.reduce(
    (sum, item) => sum + item.calculatedValue,
    0
  );

  // Calculate refund (amount paid minus value of medications received)
  // Refund can never be negative
  const refundDue = Math.max(0, amountPaid - totalMedicationValue);

  return {
    amountPaid,
    weeksPaidFor,
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
  lines.push(`Amount Paid: ${formatCurrency(calculation.amountPaid)}`);
  lines.push(`Weeks Paid For: ${calculation.weeksPaidFor}`);
  lines.push("");
  lines.push("MEDICATIONS RECEIVED:");
  lines.push("-".repeat(40));

  for (const item of calculation.breakdown) {
    lines.push(`${item.medication.name}`);
    lines.push(`  Weeks Received: ${item.weeksReceived}`);
    lines.push(`  Value: ${formatCurrency(item.calculatedValue)}`);
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
