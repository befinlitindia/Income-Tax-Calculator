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
  
  let taxBeforeCess = calculateTaxFromSlabs(taxableIncome, NEW_REGIME_SLABS);
  
  // Apply rebate u/s 87A for income up to 12 lakh
  if (taxableIncome <= NEW_REGIME_REBATE_LIMIT) {
    taxBeforeCess = 0;
  }
  
  const cess = taxBeforeCess * CESS_RATE;
  const totalTax = taxBeforeCess + cess;
  const effectiveTaxRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;
  const netIncome = grossIncome - totalTax;

  return {
    grossIncome,
    totalDeductions,
    taxableIncome,
    taxBeforeCess,
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

export function calculateSalaryExemptionsTotal(exemptions: SalaryExemptions): number {
  return (
    exemptions.hraExemption +
    exemptions.ltaExemption +
    exemptions.gratuityExemption +
    exemptions.leaveEncashmentExemption +
    exemptions.professionalTax +
    exemptions.entertainmentAllowance
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
  
  // Calculate salary exemptions
  const salaryExemptionsTotal = calculateSalaryExemptionsTotal(deductions.exemptions);
  
  // Calculate Chapter VI-A deductions
  const chapterVIATotal = calculateChapterVIATotal(deductions.chapterVIA);
  
  // Standard deduction
  const standardDeduction = OLD_REGIME_STANDARD_DEDUCTION;

  const totalDeductions = salaryExemptionsTotal + chapterVIATotal + standardDeduction;
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);
  
  let taxBeforeCess = calculateTaxFromSlabs(taxableIncome, OLD_REGIME_SLABS);
  
  // Apply rebate u/s 87A for income up to 5 lakh
  if (taxableIncome <= OLD_REGIME_REBATE_LIMIT) {
    taxBeforeCess = 0;
  }
  
  const cess = taxBeforeCess * CESS_RATE;
  const totalTax = taxBeforeCess + cess;
  const effectiveTaxRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;
  const netIncome = grossIncome - totalTax;

  return {
    grossIncome,
    totalDeductions,
    taxableIncome,
    taxBeforeCess,
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
