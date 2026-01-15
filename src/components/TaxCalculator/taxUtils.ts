import { SalaryBreakdown, Deductions, TaxResult, SalaryExemptions, ChapterVIADeductions } from './types';

// New Tax Regime Slabs for AY 2026-27 (FY 2025-26) as per Finance Act 2025
const NEW_REGIME_SLABS = [
  { min: 0, max: 400000, rate: 0 },
  { min: 400000, max: 800000, rate: 5 },
  { min: 800000, max: 1200000, rate: 10 },
  { min: 1200000, max: 1600000, rate: 15 },
  { min: 1600000, max: 2000000, rate: 20 },
  { min: 2000000, max: 2400000, rate: 25 },
  { min: 2400000, max: Infinity, rate: 30 },
];

// Old Tax Regime Slabs
const OLD_REGIME_SLABS = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 5 },
  { min: 500000, max: 1000000, rate: 20 },
  { min: 1000000, max: Infinity, rate: 30 },
];

const CESS_RATE = 0.04; // 4% Health and Education Cess
const NEW_REGIME_STANDARD_DEDUCTION = 75000;
const OLD_REGIME_STANDARD_DEDUCTION = 50000;
const NEW_REGIME_REBATE_LIMIT = 1200000; // Rebate u/s 87A for income up to 12L
const OLD_REGIME_REBATE_LIMIT = 500000; // Rebate u/s 87A for income up to 5L

// Surcharge thresholds
const SURCHARGE_50L = 5000000;
const SURCHARGE_1CR = 10000000;
const SURCHARGE_2CR = 20000000;
const SURCHARGE_5CR = 50000000;

// Surcharge rates for Old Regime
const OLD_REGIME_SURCHARGE_RATES = [
  { threshold: SURCHARGE_5CR, rate: 0.37 },
  { threshold: SURCHARGE_2CR, rate: 0.25 },
  { threshold: SURCHARGE_1CR, rate: 0.15 },
  { threshold: SURCHARGE_50L, rate: 0.10 },
];

// Surcharge rates for New Regime (capped at 25%)
const NEW_REGIME_SURCHARGE_RATES = [
  { threshold: SURCHARGE_2CR, rate: 0.25 },
  { threshold: SURCHARGE_1CR, rate: 0.15 },
  { threshold: SURCHARGE_50L, rate: 0.10 },
];

// Calculate surcharge with marginal relief
function calculateSurcharge(
  taxableIncome: number,
  taxBeforeSurcharge: number,
  slabs: typeof NEW_REGIME_SLABS,
  surchargeRates: typeof OLD_REGIME_SURCHARGE_RATES
): number {
  if (taxableIncome <= SURCHARGE_50L) {
    return 0;
  }

  // Find applicable surcharge rate
  let applicableRate = 0;
  let applicableThreshold = 0;
  
  for (const { threshold, rate } of surchargeRates) {
    if (taxableIncome > threshold) {
      applicableRate = rate;
      applicableThreshold = threshold;
      break;
    }
  }

  if (applicableRate === 0) {
    return 0;
  }

  // Calculate surcharge
  const surcharge = taxBeforeSurcharge * applicableRate;

  // Apply marginal relief
  // Tax + Surcharge should not exceed Tax at threshold + Excess income above threshold
  const taxAtThreshold = calculateTaxFromSlabs(applicableThreshold, slabs);
  const excessIncome = taxableIncome - applicableThreshold;
  const maxTaxWithSurcharge = taxAtThreshold + excessIncome;
  
  const taxWithSurcharge = taxBeforeSurcharge + surcharge;
  
  if (taxWithSurcharge > maxTaxWithSurcharge) {
    // Marginal relief applies
    return Math.max(0, maxTaxWithSurcharge - taxBeforeSurcharge);
  }

  return surcharge;
}

export function calculateGrossIncome(salary: SalaryBreakdown): number {
  // Section 17(1)
  const section17_1_total = 
    salary.section17_1.basicSalary +
    salary.section17_1.dearnessAllowance +
    salary.section17_1.conveyanceAllowance +
    salary.section17_1.medicalAllowance +
    salary.section17_1.otherAllowances;

  // Special Allowances
  const specialAllowances_total =
    salary.specialAllowances.hra +
    salary.specialAllowances.lta +
    salary.specialAllowances.leaveEncashment +
    salary.specialAllowances.mealAllowance +
    salary.specialAllowances.uniformAllowance +
    salary.specialAllowances.otherSpecialAllowances;

  // Section 17(2)
  const section17_2_total =
    salary.section17_2.rentFreeAccommodation +
    salary.section17_2.motorCarProvided +
    salary.section17_2.freeEducation +
    salary.section17_2.interestFreeLoans +
    salary.section17_2.otherPerquisites;

  // Section 17(3)
  const section17_3_total =
    salary.section17_3.bonus +
    salary.section17_3.commission +
    salary.section17_3.retirementBenefits +
    salary.section17_3.exGratia +
    salary.section17_3.otherProfits;

  return section17_1_total + specialAllowances_total + section17_2_total + section17_3_total;
}

function calculateTaxFromSlabs(taxableIncome: number, slabs: typeof NEW_REGIME_SLABS): number {
  let tax = 0;
  let remainingIncome = taxableIncome;

  for (const slab of slabs) {
    if (remainingIncome <= 0) break;

    const taxableInSlab = Math.min(remainingIncome, slab.max - slab.min);
    tax += (taxableInSlab * slab.rate) / 100;
    remainingIncome -= taxableInSlab;
  }

  return tax;
}

export function calculateNewRegimeTax(salary: SalaryBreakdown, deductions: Deductions): TaxResult {
  const grossIncome = calculateGrossIncome(salary);
  
  // New regime allows: Standard Deduction + 80CCD(2) employer NPS contribution
  const standardDeduction = NEW_REGIME_STANDARD_DEDUCTION;
  const employerNPS = deductions.chapterVIA.section80CCD2;
  const totalDeductions = standardDeduction + employerNPS;
  
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);
  
  let taxBeforeSurcharge = calculateTaxFromSlabs(taxableIncome, NEW_REGIME_SLABS);
  
  // Apply rebate u/s 87A for income up to 12 lakh
  if (taxableIncome <= NEW_REGIME_REBATE_LIMIT) {
    taxBeforeSurcharge = 0;
  }

  // Calculate surcharge (New Regime - max 25%)
  const surcharge = calculateSurcharge(taxableIncome, taxBeforeSurcharge, NEW_REGIME_SLABS, NEW_REGIME_SURCHARGE_RATES);
  const taxAfterSurcharge = taxBeforeSurcharge + surcharge;
  
  const cess = taxAfterSurcharge * CESS_RATE;
  const totalTax = taxAfterSurcharge + cess;
  const effectiveTaxRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;
  const netIncome = grossIncome - totalTax;

  return {
    grossIncome,
    totalDeductions,
    taxableIncome,
    taxBeforeSurcharge,
    surcharge,
    taxAfterSurcharge,
    cess,
    totalTax,
    effectiveTaxRate,
    netIncome,
    deductionBreakdown: {
      salaryExemptions: 0,
      chapterVIA: employerNPS,
      standardDeduction,
    }
  };
}

export function calculateHomeLoanDeduction(exemptions: SalaryExemptions, isNewRegime: boolean): number {
  const { interestPaid, isSelfOccupied } = exemptions.homeLoanInterest;
  
  if (isNewRegime) {
    // New Regime: Only for Let Out property (set off against rental income, not from salary)
    // For simplicity, we're not deducting in new regime for salaried individuals
    return 0;
  }
  
  // Old Regime
  if (isSelfOccupied) {
    // Self Occupied: Max ₹2,00,000
    return Math.min(interestPaid, 200000);
  } else {
    // Let Out: No limit (actual interest paid)
    return interestPaid;
  }
}

export function calculateSalaryExemptionsTotal(exemptions: SalaryExemptions, isNewRegime: boolean = false): number {
  const homeLoanDeduction = calculateHomeLoanDeduction(exemptions, isNewRegime);
  
  return (
    exemptions.hraExemption +
    exemptions.ltaExemption +
    exemptions.gratuityExemption +
    exemptions.leaveEncashmentExemption +
    exemptions.professionalTax +
    exemptions.entertainmentAllowance +
    homeLoanDeduction
  );
}

export function calculateChapterVIATotal(deductions: ChapterVIADeductions): number {
  const section80C = Math.min(deductions.section80C + deductions.section80CCD1, 150000);
  const section80CCD1B = Math.min(deductions.section80CCD1B, 50000);
  const section80CCD2 = deductions.section80CCD2; // No limit, based on salary
  const section80D = Math.min(deductions.section80D_self, 50000) + Math.min(deductions.section80D_parents, 50000);
  const section80E = deductions.section80E; // No limit
  const section80G = deductions.section80G;
  const section80GG = Math.min(deductions.section80GG, 60000);
  const section80TTA = Math.min(deductions.section80TTA, 10000); // 80TTB for seniors is 50K
  const section80U = Math.min(deductions.section80U, 125000);

  return (
    section80C +
    section80CCD1B +
    section80CCD2 +
    section80D +
    section80E +
    section80G +
    section80GG +
    section80TTA +
    section80U
  );
}

export function calculateOldRegimeTax(salary: SalaryBreakdown, deductions: Deductions): TaxResult {
  const grossIncome = calculateGrossIncome(salary);
  
  // Calculate salary exemptions (for old regime)
  const salaryExemptionsTotal = calculateSalaryExemptionsTotal(deductions.exemptions, false);
  
  // Calculate Chapter VI-A deductions
  const chapterVIATotal = calculateChapterVIATotal(deductions.chapterVIA);
  
  // Standard deduction
  const standardDeduction = OLD_REGIME_STANDARD_DEDUCTION;

  const totalDeductions = salaryExemptionsTotal + chapterVIATotal + standardDeduction;
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);
  
  let taxBeforeSurcharge = calculateTaxFromSlabs(taxableIncome, OLD_REGIME_SLABS);
  
  // Apply rebate u/s 87A for income up to 5 lakh
  if (taxableIncome <= OLD_REGIME_REBATE_LIMIT) {
    taxBeforeSurcharge = 0;
  }

  // Calculate surcharge (Old Regime - up to 37%)
  const surcharge = calculateSurcharge(taxableIncome, taxBeforeSurcharge, OLD_REGIME_SLABS, OLD_REGIME_SURCHARGE_RATES);
  const taxAfterSurcharge = taxBeforeSurcharge + surcharge;
  
  const cess = taxAfterSurcharge * CESS_RATE;
  const totalTax = taxAfterSurcharge + cess;
  const effectiveTaxRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;
  const netIncome = grossIncome - totalTax;

  return {
    grossIncome,
    totalDeductions,
    taxableIncome,
    taxBeforeSurcharge,
    surcharge,
    taxAfterSurcharge,
    cess,
    totalTax,
    effectiveTaxRate,
    netIncome,
    deductionBreakdown: {
      salaryExemptions: salaryExemptionsTotal,
      chapterVIA: chapterVIATotal,
      standardDeduction,
    }
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
}
