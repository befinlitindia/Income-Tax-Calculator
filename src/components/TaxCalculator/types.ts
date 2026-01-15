// Salary under Section 17(1) - Basic Salary and Allowances
export interface SalarySection17_1 {
  basicSalary: number;
  dearnessAllowance: number;
  conveyanceAllowance: number;
  medicalAllowance: number;
  otherAllowances: number;
}

// Special Allowances
export interface SpecialAllowances {
  leaveEncashment: number;
  lta: number;
  hra: number;
  mealAllowance: number;
  uniformAllowance: number;
  otherSpecialAllowances: number;
}

// Perquisites under Section 17(2)
export interface SalarySection17_2 {
  rentFreeAccommodation: number;
  motorCarProvided: number;
  freeEducation: number;
  interestFreeLoans: number;
  otherPerquisites: number;
}

// Profits in lieu of Salary under Section 17(3)
export interface SalarySection17_3 {
  bonus: number;
  commission: number;
  retirementBenefits: number;
  exGratia: number;
  otherProfits: number;
}

// Complete Salary Structure
export interface SalaryBreakdown {
  section17_1: SalarySection17_1;
  specialAllowances: SpecialAllowances;
  section17_2: SalarySection17_2;
  section17_3: SalarySection17_3;
}

// Home Loan Interest under Section 24(b)
export interface HomeLoanInterest {
  interestPaid: number;
  isSelfOccupied: boolean; // true = Self Occupied, false = Let Out
}

// Salary Exemptions
export interface SalaryExemptions {
  // HRA Exemption - calculated
  hraExemption: number;
  rentPaid: number;
  isMetroCity: boolean;
  // Other exemptions
  ltaExemption: number;
  gratuityExemption: number;
  leaveEncashmentExemption: number;
  standardDeduction: number;
  professionalTax: number;
  entertainmentAllowance: number;
  // Home Loan Interest
  homeLoanInterest: HomeLoanInterest;
}

// Chapter VI-A Deductions
export interface ChapterVIADeductions {
  // 80C - Investments
  section80C: number;
  // 80CCD(1) - NPS Employee contribution
  section80CCD1: number;
  // 80CCD(1B) - Additional NPS
  section80CCD1B: number;
  // 80CCD(2) - Employer NPS contribution (available in both regimes)
  section80CCD2: number;
  // 80D - Medical Insurance
  section80D_self: number;
  section80D_parents: number;
  // 80E - Education Loan Interest
  section80E: number;
  // 80G - Donations
  section80G: number;
  // 80GG - Rent paid (if no HRA)
  section80GG: number;
  // 80TTA/80TTB - Savings Interest
  section80TTA: number;
  // 80U - Disability
  section80U: number;
}

// Combined Deductions structure
export interface Deductions {
  exemptions: SalaryExemptions;
  chapterVIA: ChapterVIADeductions;
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
  // Breakdown for old regime
  deductionBreakdown?: {
    salaryExemptions: number;
    chapterVIA: number;
    standardDeduction: number;
  };
}
