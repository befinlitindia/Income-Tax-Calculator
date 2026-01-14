import React, { useState, useMemo } from 'react';
import { SalaryBreakdown, Deductions } from './types';
import { calculateNewRegimeTax, calculateOldRegimeTax, formatCurrency } from './taxUtils';
import { SalarySection } from './SalarySection';
import { DeductionsSection } from './DeductionsSection';
import { TaxComparison } from './TaxComparison';
import { Suggestions } from './Suggestions';
import { Calculator, IndianRupee, Scale, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const initialSalary: SalaryBreakdown = {
  basicSalary: 0,
  hra: 0,
  specialAllowance: 0,
  lta: 0,
  otherAllowances: 0,
  bonus: 0,
};

const initialDeductions: Deductions = {
  section80C: 0,
  section80D: 0,
  section80CCD1B: 0,
  section80E: 0,
  section80G: 0,
  hraExemption: 0,
  professionalTax: 0,
  standardDeduction: 50000,
};

export const TaxCalculator: React.FC = () => {
  const [salary, setSalary] = useState<SalaryBreakdown>(initialSalary);
  const [deductions, setDeductions] = useState<Deductions>(initialDeductions);

  const newRegimeResult = useMemo(() => calculateNewRegimeTax(salary), [salary]);
  const oldRegimeResult = useMemo(() => calculateOldRegimeTax(salary, deductions), [salary, deductions]);

  const handleReset = () => {
    setSalary(initialSalary);
    setDeductions(initialDeductions);
  };

  const totalSalary = Object.values(salary).reduce((sum, val) => sum + val, 0);

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
              <IndianRupee className="w-4 h-4" />
              <span>For Salaried Individuals</span>
            </div>
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
              This Income Tax Calculator helps salaried individuals compare their tax liability under both the 
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

          {/* Input Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SalarySection salary={salary} onChange={setSalary} />
            <DeductionsSection deductions={deductions} onChange={setDeductions} />
          </div>

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
              <Suggestions oldRegime={oldRegimeResult} newRegime={newRegimeResult} deductions={deductions} />
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
