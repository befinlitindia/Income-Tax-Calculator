export interface SalaryBreakdown {
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  lta: number;
  otherAllowances: number;
  bonus: number;
}

export interface Deductions {
  section80C: number;
  section80D: number;
  section80CCD1B: number;
  section80E: number;
  section80G: number;
  hraExemption: number;
  professionalTax: number;
  standardDeduction: number;
}

export interface TaxResult {
  grossIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  taxBeforeCess: number;
  cess: number;
  totalTax: number;
  effectiveTaxRate: number;
  netIncome: number;
}
