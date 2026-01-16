import React, { useState, useMemo } from 'react';
import { SalaryBreakdown, Deductions, SalaryExemptions, ChapterVIADeductions, HomeLoanInterest } from './types';
import { calculateNewRegimeTax, calculateOldRegimeTax, formatCurrency } from './taxUtils';
import { SalarySection } from './SalarySection';
import { ExemptionsSection } from './ExemptionsSection';
import { ChapterVIASection } from './ChapterVIASection';
import { HomeLoanSection } from './HomeLoanSection';
import { TaxComparison } from './TaxComparison';
import { Suggestions } from './Suggestions';
import { Compliances } from './Compliances';
import { Calculator, IndianRupee, Scale, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  section80CCD1B: 0,
  section80CCD2: 0,
  section80D_self: 0,
  section80D_parents: 0,
  section80E: 0,
  section80G: 0,
  section80GG: 0,
  section80TTA: 0,
  section80U: 0,
};

const initialDeductions: Deductions = {
  exemptions: initialExemptions,
  chapterVIA: initialChapterVIA,
  homeLoanInterest: initialHomeLoanInterest,
};

export const TaxCalculator: React.FC = () => {
  const [salary, setSalary] = useState<SalaryBreakdown>(initialSalary);
  const [deductions, setDeductions] = useState<Deductions>(initialDeductions);

  const newRegimeResult = useMemo(() => calculateNewRegimeTax(salary, deductions), [salary, deductions]);
  const oldRegimeResult = useMemo(() => calculateOldRegimeTax(salary, deductions), [salary, deductions]);

  const handleReset = () => {
    setSalary(initialSalary);
    setDeductions(initialDeductions);
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
      <header className="gradient-primary text-white py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur">
              <Calculator className="w-8 h-8" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold">Income Tax Calculator</h1>
          </div>
          <p className="text-white/80 max-w-2xl text-lg">
            Compare your tax liability under Old and New Tax Regimes for Assessment Year 2026-27 
            (Financial Year 2025-26) as per Finance Act 2025.
          </p>
          <div className="flex items-center gap-6 mt-6 flex-wrap">
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <Scale className="w-4 h-4" />
              <span>Based on Income Tax Act, 1961</span>
            </div>
          </div>
        </div>
      </header>

      {/* Introduction */}
      <section className="py-8 px-4 border-b border-border">
        <div className="container max-w-6xl mx-auto">
          <div className="card-elevated p-6">
            <h2 className="font-display font-semibold text-xl mb-3">About This Calculator</h2>
            <p className="text-muted-foreground leading-relaxed">
              This Income Tax Calculator helps you compare tax liability under both the 
              <strong className="text-foreground"> Old Tax Regime</strong> (with deductions and exemptions) and the 
              <strong className="text-foreground"> New Tax Regime</strong> (simplified slabs without most deductions) 
              for AY 2026-27. The New Regime under Finance Act 2025 offers revised tax slabs with a basic exemption 
              limit of ₹4 lakh and rebate under Section 87A for income up to ₹12 lakh, making it attractive for 
              taxpayers with fewer deductions. Enter your salary components and deductions below to find which 
              regime saves you more tax.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="container max-w-6xl mx-auto space-y-8">
          {/* Quick Summary */}
          {totalSalary > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
              <div className="card-elevated p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <IndianRupee className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gross Annual Income</p>
                  <p className="font-display font-bold text-xl">{formatCurrency(totalSalary)}</p>
                </div>
              </div>
              <div className="card-elevated p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-amber-100">
                  <Calculator className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tax (Old Regime)</p>
                  <p className="font-display font-bold text-xl text-amber-600">{formatCurrency(oldRegimeResult.totalTax)}</p>
                </div>
              </div>
              <div className="card-elevated p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-emerald-100">
                  <Calculator className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tax (New Regime)</p>
                  <p className="font-display font-bold text-xl text-emerald-600">{formatCurrency(newRegimeResult.totalTax)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Salary Section */}
          <SalarySection salary={salary} onChange={setSalary} />

          {/* Deductions - Exemptions first, then Chapter VI-A */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExemptionsSection 
              exemptions={deductions.exemptions} 
              salary={salary}
              onChange={updateExemptions} 
            />
            <ChapterVIASection 
              deductions={deductions.chapterVIA} 
              salary={salary}
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
              <Suggestions oldRegime={oldRegimeResult} newRegime={newRegimeResult} deductions={deductions} salary={salary} />
              <Compliances />
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border bg-muted/30">
        <div className="container max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Based on Income Tax Act, 1961 as amended by Finance Act 2025 | Assessment Year 2026-27
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            This calculator is for informational purposes only. Please consult a tax professional for accurate advice.
          </p>
        </div>
      </footer>
    </div>
  );
};
