import { SalaryBreakdown, Deductions, TaxResult } from './types';

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
  return (
    salary.basicSalary +
    salary.hra +
    salary.specialAllowance +
    salary.lta +
    salary.otherAllowances +
    salary.bonus
  );
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

export function calculateNewRegimeTax(salary: SalaryBreakdown): TaxResult {
  const grossIncome = calculateGrossIncome(salary);
  
  // New regime only allows standard deduction
  const totalDeductions = NEW_REGIME_STANDARD_DEDUCTION;
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
  };
}

export function calculateOldRegimeTax(salary: SalaryBreakdown, deductions: Deductions): TaxResult {
  const grossIncome = calculateGrossIncome(salary);
  
  // Calculate total deductions under old regime
  const totalDeductions =
    Math.min(deductions.section80C, 150000) +
    Math.min(deductions.section80D, 75000) + // Max for self + parents (senior)
    Math.min(deductions.section80CCD1B, 50000) +
    deductions.section80E + // No limit on 80E
    deductions.section80G +
    deductions.hraExemption +
    deductions.professionalTax +
    OLD_REGIME_STANDARD_DEDUCTION;

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
