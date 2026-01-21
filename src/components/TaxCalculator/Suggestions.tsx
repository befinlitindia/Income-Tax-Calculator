import React from 'react';
import { TaxResult, Deductions, SalaryBreakdown, UserProfile } from './types';
import { formatCurrency, calculate80CCD1B } from './taxUtils';
import { Lightbulb, TrendingUp, Shield, Coins, Building, Heart, Home, GraduationCap, Wallet, PiggyBank, CalendarCheck } from 'lucide-react';

interface SuggestionsProps {
  oldRegime: TaxResult;
  newRegime: TaxResult;
  deductions: Deductions;
  salary: SalaryBreakdown;
  userProfile: UserProfile;
}

export const Suggestions: React.FC<SuggestionsProps> = ({ oldRegime, newRegime, deductions, salary, userProfile }) => {
  const suggestions: Array<{ icon: React.ReactNode; title: string; description: string; impact?: string; priority: 'high' | 'medium' | 'low' }> = [];

  const basicPlusDA = salary.section17_1.basicSalary + salary.section17_1.dearnessAllowance;
  const totalGross = oldRegime.grossIncome;
  const betterRegime = oldRegime.totalTax < newRegime.totalTax ? 'old' : 'new';
  const taxSavingsDiff = Math.abs(oldRegime.totalTax - newRegime.totalTax);

  // 1. HRA vs 80GG Analysis - High Priority
  const hasHRA = salary.specialAllowances.hra > 0;
  const hasHRAExemption = deductions.exemptions.hraExemption > 0;
  const rentPaid = deductions.exemptions.rentPaid;
  const section80GG_monthlyRent = deductions.chapterVIA.section80GG_monthlyRent;
  
  if (!hasHRA && rentPaid === 0 && section80GG_monthlyRent === 0) {
    suggestions.push({
      icon: <Home className="w-5 h-5" />,
      title: "Claim Rent Deduction u/s 80GG",
      description: "If you pay rent but don't receive HRA from your employer, you can claim deduction under Section 80GG. The limit is minimum of: ₹5,000/month, 25% of total income, or Rent paid minus 10% of income.",
      impact: "Maximum deduction: ₹60,000/year",
      priority: 'high',
    });
  }

  if (hasHRA && rentPaid > 0 && !hasHRAExemption) {
    suggestions.push({
      icon: <Home className="w-5 h-5" />,
      title: "Claim Your HRA Exemption",
      description: "You receive HRA and pay rent, but haven't filled in the HRA calculation details. Enter your rent details in the Salary Exemptions section to claim HRA exemption under Old Regime.",
      impact: "Could save significant tax under Old Regime",
      priority: 'high',
    });
  }

  // 2. Health Insurance Analysis - High Priority
  const section80D_self = deductions.chapterVIA.section80D_self;
  const section80D_parents = deductions.chapterVIA.section80D_parents;
  const selfLimit = userProfile.age >= 60 ? 50000 : 25000;
  const parentsLimit = userProfile.isParentSeniorCitizen ? 50000 : 25000;
  
  if (section80D_self === 0) {
    suggestions.push({
      icon: <Heart className="w-5 h-5" />,
      title: "Get Health Insurance for Yourself & Family",
      description: `Health insurance premium is deductible u/s 80D. Self & family can claim up to ₹${selfLimit.toLocaleString('en-IN')} (₹25,000 normal, ₹50,000 if senior citizen). This provides both tax benefits and financial protection.`,
      impact: `Potential savings: ${formatCurrency(selfLimit * 0.30)}`,
      priority: 'high',
    });
  }
  
  if (section80D_parents === 0 && section80D_self > 0) {
    suggestions.push({
      icon: <Heart className="w-5 h-5" />,
      title: "Cover Your Parents Under 80D",
      description: `You can claim additional deduction for parents' health insurance - up to ₹${parentsLimit.toLocaleString('en-IN')} (₹25,000 normal, ₹50,000 if senior citizen). Even if you don't have a health insurance policy for them, you can claim up to ₹5,000 for preventive health check-up expenses.`,
      impact: `Additional deduction possible: up to ${formatCurrency(parentsLimit)}`,
      priority: 'high',
    });
  }

  if (section80D_self > 0 && section80D_self < selfLimit) {
    suggestions.push({
      icon: <Heart className="w-5 h-5" />,
      title: "Claim Preventive Health Check-up",
      description: "Under Section 80D, you can claim up to ₹5,000 for preventive health check-up for self, spouse, dependent children, or parents. This is within the overall 80D limit.",
      impact: "Additional ₹5,000 deduction each for self and parents",
      priority: 'medium',
    });
  }

  // 3. Section 80C Optimization - High Priority
  const section80C = deductions.chapterVIA.section80C;
  if (section80C < 150000) {
    const remaining = 150000 - section80C;
    suggestions.push({
      icon: <Coins className="w-5 h-5" />,
      title: "Maximize Section 80C Investments",
      description: `You can invest ₹${remaining.toLocaleString('en-IN')} more in ELSS mutual funds (3-year lock-in, good returns), PPF (safe, 15-year), life insurance premium, 5-year tax saver FD, children's tuition fees, or home loan principal repayment.`,
      impact: `Potential savings: ${formatCurrency(Math.min(remaining * 0.30, 45000))}`,
      priority: 'high',
    });
  }

  // 4. NPS Contribution Analysis - Medium Priority
  const section80CCD1 = deductions.chapterVIA.section80CCD1;
  const section80CCD2 = deductions.chapterVIA.section80CCD2;
  const maxEmployeeNPS = Math.round(basicPlusDA * 0.10);
  const auto80CCD1B = calculate80CCD1B(section80C, section80CCD1, maxEmployeeNPS);
  
  if (auto80CCD1B < 50000 && section80CCD1 < maxEmployeeNPS + 50000) {
    const remainingCCD1B = 50000 - auto80CCD1B;
    suggestions.push({
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Invest in NPS for Additional ₹50,000 Deduction",
      description: "Section 80CCD(1B) allows additional ₹50,000 deduction for NPS contributions, over and above the 80C limit. If your NPS contribution exceeds 80C limit, excess automatically qualifies for 80CCD(1B). NPS offers market-linked returns with partial withdrawal facility after 3 years.",
      impact: `Potential savings: ${formatCurrency(remainingCCD1B * 0.30)}`,
      priority: 'medium',
    });
  }

  if (section80CCD2 === 0 && totalGross > 1000000) {
    suggestions.push({
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Request Employer NPS Contribution",
      description: "Ask your employer to contribute to NPS (up to 10% of Basic+DA for private employees, 14% for govt employees). Section 80CCD(2) deduction is available in BOTH Old and New regimes - a rare benefit!",
      impact: `Potential deduction: up to ${formatCurrency(Math.round(basicPlusDA * 0.10))} (Private) / ${formatCurrency(Math.round(basicPlusDA * 0.14))} (Govt)`,
      priority: 'high',
    });
  }

  // 5. Education Loan Interest - Medium Priority
  const section80E = deductions.chapterVIA.section80E;
  if (section80E === 0 && totalGross > 500000) {
    suggestions.push({
      icon: <GraduationCap className="w-5 h-5" />,
      title: "Education Loan Interest Deduction",
      description: "If you or your spouse/children have taken an education loan from specified institutions for higher studies, the entire interest (no max limit) is deductible u/s 80E for up to 8 years from the year of starting repayment.",
      priority: 'low',
    });
  }

  // 6. Professional Tax - Low Priority
  const professionalTax = deductions.exemptions.professionalTax;
  if (professionalTax === 0) {
    suggestions.push({
      icon: <Wallet className="w-5 h-5" />,
      title: "Claim Professional Tax Deduction",
      description: "Professional tax paid to the state government (usually ₹2,400-₹2,500/year, deducted by employer) is fully deductible. Check your salary slip and ensure you're claiming this.",
      impact: "Deduction: up to ₹2,500",
      priority: 'low',
    });
  }

  // 7. Advance Tax Reminder - Based on tax liability
  if (oldRegime.totalTax > 10000 || newRegime.totalTax > 10000) {
    suggestions.push({
      icon: <CalendarCheck className="w-5 h-5" />,
      title: "Pay Advance Tax to Avoid Interest",
      description: "If your tax liability (after TDS) exceeds ₹10,000, you must pay advance tax. Due dates: 15% by June 15, 45% by Sep 15, 75% by Dec 15, 100% by March 15. Failure attracts interest u/s 234B & 234C.",
      priority: 'medium',
    });
  }

  // 8. LTA Exemption
  if (salary.specialAllowances.lta > 0 && deductions.exemptions.ltaExemption === 0) {
    suggestions.push({
      icon: <Building className="w-5 h-5" />,
      title: "Claim LTA Exemption",
      description: "You receive LTA in your salary. If you've traveled within India with family, you can claim exemption for travel costs (shortest route fare). LTA can be claimed twice in a block of 4 years.",
      impact: `Potential exemption: up to ${formatCurrency(salary.specialAllowances.lta)}`,
      priority: 'medium',
    });
  }

  // 9. Charitable Donations
  const section80G_donations = deductions.chapterVIA.section80G_donations;
  if ((!section80G_donations || section80G_donations.length === 0) && totalGross > 1000000) {
    suggestions.push({
      icon: <Shield className="w-5 h-5" />,
      title: "Donate to Charity for Tax Benefits",
      description: "Donations to approved charities qualify for 50% or 100% deduction u/s 80G. Donations to PM Relief Fund, PM CARES Fund, etc. get 100% unlimited deduction. For other institutions, ensure you have 80G certificate. Keep receipts with 80G registration number.",
      priority: 'low',
    });
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Limit to top 6 suggestions
  const displaySuggestions = suggestions.slice(0, 6);

  if (displaySuggestions.length === 0) {
    displaySuggestions.push({
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Great Tax Planning!",
      description: "You seem to be utilizing most available deductions effectively. Review your investments annually and ensure all proof documents are submitted to your employer on time.",
      priority: 'low',
    });
  }

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">High Priority</span>;
      case 'medium':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Medium</span>;
      case 'low':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Tip</span>;
    }
  };

  return (
    <div className="card-elevated p-4 sm:p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        <div>
          <h2 className="section-title mb-0 text-base sm:text-lg">Tax Saving Suggestions</h2>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Personalized recommendations from a tax professional's perspective</p>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {displaySuggestions.map((suggestion, index) => (
          <div
            key={index}
            className="p-3 sm:p-4 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <div className="flex gap-2 sm:gap-4">
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 h-fit">
                <span className="text-primary [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5">{suggestion.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                  <h4 className="font-medium text-foreground text-sm sm:text-base">{suggestion.title}</h4>
                  {getPriorityBadge(suggestion.priority)}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">{suggestion.description}</p>
                {suggestion.impact && (
                  <p className="text-xs sm:text-sm font-medium text-accent mt-2">{suggestion.impact}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg bg-muted/50 border border-border">
        <p className="text-[10px] sm:text-xs text-muted-foreground">
          <strong>Disclaimer:</strong> This calculator provides estimates based on the provisions of the Income Tax Act, 1961 as amended by Finance Act 2025 for AY 2026-27. 
          The calculations are for illustrative purposes only. Tax laws are subject to change. Please consult a qualified Chartered Accountant or Tax Professional for personalized advice before making investment or filing decisions.
        </p>
      </div>
    </div>
  );
};