import React, { useState, useMemo } from 'react';
import { SalaryBreakdown, Deductions, SalaryExemptions, ChapterVIADeductions, HomeLoanInterest, UserProfile } from './types';
import { calculateNewRegimeTax, calculateOldRegimeTax, formatCurrency, calculateGrossIncome } from './taxUtils';
import { SalarySection } from './SalarySection';
import { ExemptionsSection } from './ExemptionsSection';
import { ChapterVIASection } from './ChapterVIASection';
import { HomeLoanSection } from './HomeLoanSection';
import { TaxComparison } from './TaxComparison';
import { Suggestions } from './Suggestions';
import { Compliances } from './Compliances';
import { SuggestionsToggle } from './SuggestionsToggle';
import { ContactForm } from './ContactForm';
import { ReachUs } from './ReachUs';
import { Calculator, IndianRupee, Scale, RefreshCw, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputField } from './InputField';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const initialUserProfile: UserProfile = {
  age: 30,
  isParentSeniorCitizen: false,
};

const initialSalary: SalaryBreakdown = {
  section17_1: {
    basicSalary: 0,
    dearnessAllowance: 0,
  },
  specialAllowances: {
    hra: 0,
    lta: 0,
    leaveEncashment: 0,
    conveyanceAllowance: 0,
    medicalAllowance: 0,
    mealAllowance: 0,
    uniformAllowance: 0,
    otherAllowances: 0,
  },
  section17_2: {
    rentFreeAccommodation: 0,
    motorCarProvided: 0,
    freeEducation: 0,
    interestFreeLoans: 0,
    otherPerquisites: 0,
  },
  section17_3: {
    bonus: 0,
    commission: 0,
    retirementBenefits: 0,
    exGratia: 0,
    otherProfits: 0,
  },
};

const initialExemptions: SalaryExemptions = {
  hraExemption: 0,
  rentPaid: 0,
  isMetroCity: false,
  ltaExemption: 0,
  gratuityExemption: 0,
  leaveEncashmentExemption: 0,
  standardDeduction: 50000,
  professionalTax: 0,
  entertainmentAllowance: 0,
};

const initialHomeLoanInterest: HomeLoanInterest = {
  interestPaid: 0,
  isSelfOccupied: true,
};

const initialChapterVIA: ChapterVIADeductions = {
  section80C: 0,
  section80CCD1: 0,
  section80CCD2: 0,
  section80D_self: 0,
  section80D_parents: 0,
  section80E: 0,
  section80G_donations: [],
  section80GG: 0,
  section80GG_monthlyRent: 0,
  section80U: 0,
};

const initialDeductions: Deductions = {
  exemptions: initialExemptions,
  chapterVIA: initialChapterVIA,
  homeLoanInterest: initialHomeLoanInterest,
};

export const TaxCalculator: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [salary, setSalary] = useState<SalaryBreakdown>(initialSalary);
  const [deductions, setDeductions] = useState<Deductions>(initialDeductions);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const grossIncome = useMemo(() => calculateGrossIncome(salary), [salary]);
  const newRegimeResult = useMemo(() => calculateNewRegimeTax(salary, deductions), [salary, deductions]);
  const oldRegimeResult = useMemo(() => calculateOldRegimeTax(salary, deductions, userProfile), [salary, deductions, userProfile]);

  const handleReset = () => {
    setUserProfile(initialUserProfile);
    setSalary(initialSalary);
    setDeductions(initialDeductions);
    setShowSuggestions(false);
  };

  const updateExemptions = (exemptions: SalaryExemptions) => {
    setDeductions(prev => ({ ...prev, exemptions }));
  };

  const updateChapterVIA = (chapterVIA: ChapterVIADeductions) => {
    setDeductions(prev => ({ ...prev, chapterVIA }));
  };

  const updateHomeLoanInterest = (homeLoanInterest: HomeLoanInterest) => {
    setDeductions(prev => ({ ...prev, homeLoanInterest }));
  };

  // Calculate total salary from all sections
  const totalSalary = 
    Object.values(salary.section17_1).reduce((sum, val) => sum + val, 0) +
    Object.values(salary.specialAllowances).reduce((sum, val) => sum + val, 0) +
    Object.values(salary.section17_2).reduce((sum, val) => sum + val, 0) +
    Object.values(salary.section17_3).reduce((sum, val) => sum + val, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-primary text-white py-8 sm:py-12 px-3 sm:px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 rounded-xl bg-white/10 backdrop-blur">
              <Calculator className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h1 className="font-display text-xl sm:text-3xl md:text-4xl font-bold leading-tight">Income Tax Calculator</h1>
          </div>
          <p className="text-white/80 max-w-2xl text-sm sm:text-base md:text-lg">
            Compare your tax liability under Old and New Tax Regimes for Assessment Year 2026-27 
            (Financial Year 2025-26) as per Finance Act 2025.
          </p>
          <div className="flex items-center gap-4 sm:gap-6 mt-4 sm:mt-6 flex-wrap">
            <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
              <Scale className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Based on Income Tax Act, 1961</span>
            </div>
          </div>
        </div>
      </header>

      {/* Introduction */}
      <section className="py-4 sm:py-8 px-3 sm:px-4 border-b border-border">
        <div className="container max-w-6xl mx-auto">
          <div className="card-elevated p-4 sm:p-6">
            <h2 className="font-display font-semibold text-base sm:text-xl mb-2 sm:mb-3">About This Calculator</h2>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              This Income Tax Calculator helps you compare tax liability under both the 
              <strong className="text-foreground"> Old Tax Regime</strong> (with deductions and exemptions) and the 
              <strong className="text-foreground"> New Tax Regime</strong> (simplified slabs without most deductions) 
              for AY 2026-27. The New Regime under Finance Act 2025 offers revised tax slabs with a basic exemption 
              limit of ₹4 lakh and rebate under Section 87A for income up to ₹12 lakh (with marginal relief for income slightly above ₹12 lakh), 
              making it attractive for taxpayers with fewer deductions. Enter your salary components and deductions below to find which 
              regime saves you more tax.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-4 sm:py-8 px-3 sm:px-4">
        <div className="container max-w-6xl mx-auto space-y-4 sm:space-y-8">
          {/* User Profile - Age Section */}
          <div className="card-elevated p-4 sm:p-6 animate-slide-up">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="section-title mb-0 text-base sm:text-lg">Taxpayer Profile</h2>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Age determines tax slabs and deduction limits</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <InputField
                  label="Your Age (as on 31st March 2026)"
                  value={userProfile.age}
                  onChange={(v) => setUserProfile(prev => ({ ...prev, age: v }))}
                  tooltip="Your age determines the applicable tax slabs under Old Regime and 80D limits"
                />
                <div className="mt-2">
                  {userProfile.age >= 80 && (
                    <span className="text-[10px] sm:text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">Super Senior Citizen (80+)</span>
                  )}
                  {userProfile.age >= 60 && userProfile.age < 80 && (
                    <span className="text-[10px] sm:text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">Senior Citizen (60-80)</span>
                  )}
                  {userProfile.age < 60 && (
                    <span className="text-[10px] sm:text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">Below 60 years</span>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm font-medium">Is your parent a Senior Citizen?</Label>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-muted/30 rounded-lg">
                  <span className={`text-xs sm:text-sm ${!userProfile.isParentSeniorCitizen ? 'font-medium' : 'text-muted-foreground'}`}>
                    No (Below 60)
                  </span>
                  <Switch
                    checked={userProfile.isParentSeniorCitizen}
                    onCheckedChange={(checked) => setUserProfile(prev => ({ ...prev, isParentSeniorCitizen: checked }))}
                  />
                  <span className={`text-xs sm:text-sm ${userProfile.isParentSeniorCitizen ? 'font-medium' : 'text-muted-foreground'}`}>
                    Yes (60+ years)
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Affects 80D deduction limit for parents: ₹{userProfile.isParentSeniorCitizen ? '50,000' : '25,000'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Summary */}
          {totalSalary > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 animate-fade-in">
              <div className="card-elevated p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 rounded-lg bg-primary/10">
                  <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Gross Annual Income</p>
                  <p className="font-display font-bold text-lg sm:text-xl truncate">{formatCurrency(totalSalary)}</p>
                </div>
              </div>
              <div className="card-elevated p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 rounded-lg bg-amber-100">
                  <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Tax (Old Regime)</p>
                  <p className="font-display font-bold text-lg sm:text-xl text-amber-600 truncate">{formatCurrency(oldRegimeResult.totalTax)}</p>
                </div>
              </div>
              <div className="card-elevated p-3 sm:p-4 flex items-center gap-3 sm:gap-4 sm:col-span-2 md:col-span-1">
                <div className="p-2 sm:p-3 rounded-lg bg-emerald-100">
                  <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Tax (New Regime)</p>
                  <p className="font-display font-bold text-lg sm:text-xl text-emerald-600 truncate">{formatCurrency(newRegimeResult.totalTax)}</p>
                  {newRegimeResult.marginalRelief && newRegimeResult.marginalRelief > 0 && (
                    <p className="text-[10px] sm:text-xs text-emerald-600">(Incl. marginal relief: {formatCurrency(newRegimeResult.marginalRelief)})</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Salary Section */}
          <SalarySection salary={salary} onChange={setSalary} />

          {/* Deductions - Exemptions first, then Chapter VI-A */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <ExemptionsSection 
              exemptions={deductions.exemptions} 
              salary={salary}
              onChange={updateExemptions} 
            />
            <ChapterVIASection 
              deductions={deductions.chapterVIA} 
              salary={salary}
              userProfile={userProfile}
              grossIncome={grossIncome}
              onChange={updateChapterVIA} 
            />
          </div>

          {/* Home Loan Section - Separate */}
          <HomeLoanSection 
            homeLoanInterest={deductions.homeLoanInterest}
            onChange={updateHomeLoanInterest}
          />

          {/* Reset Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleReset}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Calculator
            </Button>
          </div>

          {/* Tax Comparison */}
          {totalSalary > 0 && (
            <>
              <TaxComparison oldRegime={oldRegimeResult} newRegime={newRegimeResult} />
              
              {/* Suggestions Toggle */}
              <SuggestionsToggle 
                showSuggestions={showSuggestions} 
                onToggle={() => setShowSuggestions(!showSuggestions)} 
              />
              
              {/* Suggestions - Only shown if user clicks Yes */}
              {showSuggestions && (
                <Suggestions oldRegime={oldRegimeResult} newRegime={newRegimeResult} deductions={deductions} salary={salary} userProfile={userProfile} />
              )}
              
              <Compliances />
              
              {/* Contact Form for personalized tax planning */}
              <ContactForm />
              
              {/* Reach Us Section */}
              <ReachUs />
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 sm:py-8 px-3 sm:px-4 border-t border-border bg-muted/30">
        <div className="container max-w-6xl mx-auto text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Based on Income Tax Act, 1961 as amended by Finance Act 2025 | Assessment Year 2026-27
          </p>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
            This calculator is for informational purposes only. Please consult a tax professional for accurate advice.
          </p>
        </div>
      </footer>
    </div>
  );
};