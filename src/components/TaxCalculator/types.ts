// Salary under Section 17(1) - Basic Salary and Allowances (only Basic and DA)
export interface SalarySection17_1 {
  basicSalary: number;
  dearnessAllowance: number;
}

// Special Allowances (includes HRA, LTA, and other allowances)
export interface SpecialAllowances {
  hra: number;
  lta: number;
  leaveEncashment: number;
  conveyanceAllowance: number;
  medicalAllowance: number;
  mealAllowance: number;
  uniformAllowance: number;
  otherAllowances: number;
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
}

// User Profile for age-based calculations
export interface UserProfile {
  age: number;
  isParentSeniorCitizen: boolean;
}

// 80G Donation Types
export interface Section80GDonation {
  type: '100_unlimited' | '50_unlimited' | '100_limited' | '50_limited';
  institutionName?: string;
  amount: number;
}

// 80GG Calculation Details
export interface Section80GGDetails {
  monthlyRent: number;
  totalIncome: number; // For calculation reference
}

// Chapter VI-A Deductions
export interface ChapterVIADeductions {
  // 80C - Investments
  section80C: number;
  // 80CCD(1) - NPS Employee contribution
  section80CCD1: number;
  // 80CCD(2) - Employer NPS contribution (available in both regimes)
  section80CCD2: number;
  // 80D - Medical Insurance
  section80D_self: number;
  section80D_parents: number;
  // 80E - Education Loan Interest
  section80E: number;
  // 80G - Charitable Donations (detailed)
  section80G_donations: Section80GDonation[];
  // 80GG - Rent paid (if no HRA)
  section80GG: number;
  section80GG_monthlyRent: number;
  // 80U - Disability
  section80U: number;
}

// Combined Deductions structure
export interface Deductions {
  exemptions: SalaryExemptions;
  chapterVIA: ChapterVIADeductions;
  homeLoanInterest: HomeLoanInterest;
}

export interface TaxResult {
  grossIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  taxBeforeSurcharge: number;
  surcharge: number;
  taxAfterSurcharge: number;
  cess: number;
  totalTax: number;
  effectiveTaxRate: number;
  netIncome: number;
  marginalRelief?: number;
  // Breakdown for old regime
  deductionBreakdown?: {
    salaryExemptions: number;
    chapterVIA: number;
    standardDeduction: number;
  };
}
