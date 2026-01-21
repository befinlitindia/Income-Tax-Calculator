import React from 'react';
import { TaxResult } from './types';
import { formatCurrency } from './taxUtils';
import { Scale, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';

interface TaxComparisonProps {
  oldRegime: TaxResult;
  newRegime: TaxResult;
}

export const TaxComparison: React.FC<TaxComparisonProps> = ({ oldRegime, newRegime }) => {
  const [oldDeductionsOpen, setOldDeductionsOpen] = useState(false);
  const savings = oldRegime.totalTax - newRegime.totalTax;
  const betterRegime = savings > 0 ? 'new' : savings < 0 ? 'old' : 'same';
  const absoluteSavings = Math.abs(savings);

  // Calculate monthly in-hand
  const oldMonthlyInHand = Math.round(oldRegime.netIncome / 12);
  const newMonthlyInHand = Math.round(newRegime.netIncome / 12);

  return (
    <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
      {/* Summary Banner */}
      <div className={`p-4 sm:p-6 rounded-xl mb-4 sm:mb-6 ${
        betterRegime === 'new' 
          ? 'bg-emerald-500/10 border border-emerald-500/30' 
          : betterRegime === 'old'
          ? 'bg-amber-500/10 border border-amber-500/30'
          : 'bg-muted border border-border'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`p-2 sm:p-3 rounded-full ${
              betterRegime === 'same' ? 'bg-muted' : 'bg-card'
            }`}>
              <Scale className={`w-5 h-5 sm:w-6 sm:h-6 ${
                betterRegime === 'new' ? 'text-emerald-600' : 
                betterRegime === 'old' ? 'text-amber-600' : 'text-muted-foreground'
              }`} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-base sm:text-lg">
                {betterRegime === 'same' 
                  ? 'Both regimes result in same tax'
                  : `${betterRegime === 'new' ? 'New' : 'Old'} Regime is better for you`}
              </h3>
              {betterRegime !== 'same' && (
                <p className="text-muted-foreground text-xs sm:text-sm">
                  You save {formatCurrency(absoluteSavings)} annually ({formatCurrency(Math.round(absoluteSavings / 12))}/month)
                </p>
              )}
            </div>
          </div>
          {betterRegime !== 'same' && (
            <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${
              betterRegime === 'new' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-amber-500 text-white'
            }`}>
              {formatCurrency(absoluteSavings)} Savings
            </div>
          )}
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Old Regime Card */}
        <div className={`regime-card p-4 sm:p-6 ${betterRegime === 'old' ? 'regime-old ring-2 ring-amber-400' : 'border-border bg-card'}`}>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-lg sm:text-xl">Old Regime</h3>
              {betterRegime === 'old' && (
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
              )}
            </div>
            <span className="text-[10px] sm:text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">
              With Deductions
            </span>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-xs sm:text-sm text-muted-foreground">Gross Income</span>
              <span className="font-medium text-sm sm:text-base">{formatCurrency(oldRegime.grossIncome)}</span>
            </div>
            
            {/* Deduction Breakdown */}
            <Collapsible open={oldDeductionsOpen} onOpenChange={setOldDeductionsOpen}>
              <CollapsibleTrigger className="flex justify-between items-center py-2 border-b border-border w-full hover:bg-muted/30 -mx-1 px-1 rounded transition-colors">
                <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                  Total Deductions
                  {oldDeductionsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </span>
                <span className="font-medium text-sm sm:text-base text-accent">- {formatCurrency(oldRegime.totalDeductions)}</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2 pb-2">
                <div className="bg-muted/30 rounded-lg p-2 sm:p-3 space-y-2 text-xs sm:text-sm">
                  {oldRegime.deductionBreakdown && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Standard Deduction</span>
                        <span>{formatCurrency(oldRegime.deductionBreakdown.standardDeduction)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Salary Exemptions</span>
                        <span>{formatCurrency(oldRegime.deductionBreakdown.salaryExemptions)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Chapter VI-A</span>
                        <span>{formatCurrency(oldRegime.deductionBreakdown.chapterVIA)}</span>
                      </div>
                    </>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-xs sm:text-sm text-muted-foreground">Taxable Income</span>
              <span className="font-medium text-sm sm:text-base">{formatCurrency(oldRegime.taxableIncome)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-xs sm:text-sm text-muted-foreground">Tax on Income</span>
              <span className="font-medium text-sm sm:text-base">{formatCurrency(oldRegime.taxBeforeSurcharge)}</span>
            </div>
            {oldRegime.surcharge > 0 && (
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-xs sm:text-sm text-muted-foreground">Surcharge</span>
                <span className="font-medium text-sm sm:text-base">{formatCurrency(oldRegime.surcharge)}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-xs sm:text-sm text-muted-foreground">Health & Education Cess (4%)</span>
              <span className="font-medium text-sm sm:text-base">{formatCurrency(oldRegime.cess)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 sm:pt-4 mt-3 sm:mt-4 border-t-2 border-amber-300">
              <span className="font-display font-semibold text-base sm:text-lg">Total Tax</span>
              <span className="tax-highlight text-xl sm:text-2xl text-amber-600">{formatCurrency(oldRegime.totalTax)}</span>
            </div>
            <div className="flex justify-between items-center py-2 bg-muted/50 px-2 sm:px-3 rounded-lg">
              <span className="text-xs sm:text-sm text-muted-foreground">Effective Tax Rate</span>
              <span className="font-medium text-sm sm:text-base">{oldRegime.effectiveTaxRate.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center py-2 sm:py-3 bg-amber-50 px-2 sm:px-3 rounded-lg">
              <span className="font-medium text-xs sm:text-sm">Monthly In-Hand</span>
              <span className="font-display font-bold text-base sm:text-lg">{formatCurrency(oldMonthlyInHand)}</span>
            </div>
          </div>
        </div>

        {/* New Regime Card */}
        <div className={`regime-card p-4 sm:p-6 ${betterRegime === 'new' ? 'regime-new ring-2 ring-emerald-400' : 'border-border bg-card'}`}>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-lg sm:text-xl">New Regime</h3>
              {betterRegime === 'new' && (
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
              )}
            </div>
            <span className="text-[10px] sm:text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
              AY 2026-27
            </span>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-xs sm:text-sm text-muted-foreground">Gross Income</span>
              <span className="font-medium text-sm sm:text-base">{formatCurrency(newRegime.grossIncome)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-xs sm:text-sm text-muted-foreground">Total Deductions</span>
              <span className="font-medium text-sm sm:text-base text-accent">- {formatCurrency(newRegime.totalDeductions)}</span>
            </div>
            {newRegime.deductionBreakdown && newRegime.totalDeductions > 0 && (
              <div className="bg-muted/30 rounded-lg p-2 sm:p-3 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Standard Deduction</span>
                  <span>{formatCurrency(newRegime.deductionBreakdown.standardDeduction)}</span>
                </div>
                {newRegime.deductionBreakdown.chapterVIA > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">80CCD(2) - Employer NPS</span>
                    <span>{formatCurrency(newRegime.deductionBreakdown.chapterVIA)}</span>
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-xs sm:text-sm text-muted-foreground">Taxable Income</span>
              <span className="font-medium text-sm sm:text-base">{formatCurrency(newRegime.taxableIncome)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-xs sm:text-sm text-muted-foreground">Tax on Income</span>
              <span className="font-medium text-sm sm:text-base">{formatCurrency(newRegime.taxBeforeSurcharge)}</span>
            </div>
            {newRegime.surcharge > 0 && (
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-xs sm:text-sm text-muted-foreground">Surcharge</span>
                <span className="font-medium text-sm sm:text-base">{formatCurrency(newRegime.surcharge)}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-xs sm:text-sm text-muted-foreground">Health & Education Cess (4%)</span>
              <span className="font-medium text-sm sm:text-base">{formatCurrency(newRegime.cess)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 sm:pt-4 mt-3 sm:mt-4 border-t-2 border-emerald-300">
              <span className="font-display font-semibold text-base sm:text-lg">Total Tax</span>
              <span className="tax-highlight text-xl sm:text-2xl text-emerald-600">{formatCurrency(newRegime.totalTax)}</span>
            </div>
            <div className="flex justify-between items-center py-2 bg-muted/50 px-2 sm:px-3 rounded-lg">
              <span className="text-xs sm:text-sm text-muted-foreground">Effective Tax Rate</span>
              <span className="font-medium text-sm sm:text-base">{newRegime.effectiveTaxRate.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center py-2 sm:py-3 bg-emerald-50 px-2 sm:px-3 rounded-lg">
              <span className="font-medium text-xs sm:text-sm">Monthly In-Hand</span>
              <span className="font-display font-bold text-base sm:text-lg">{formatCurrency(newMonthlyInHand)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
