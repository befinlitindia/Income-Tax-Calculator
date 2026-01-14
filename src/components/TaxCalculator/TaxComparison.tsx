import React from 'react';
import { TaxResult } from './types';
import { formatCurrency } from './taxUtils';
import { TrendingDown, TrendingUp, Scale, CheckCircle } from 'lucide-react';

interface TaxComparisonProps {
  oldRegime: TaxResult;
  newRegime: TaxResult;
}

export const TaxComparison: React.FC<TaxComparisonProps> = ({ oldRegime, newRegime }) => {
  const savings = oldRegime.totalTax - newRegime.totalTax;
  const betterRegime = savings > 0 ? 'new' : savings < 0 ? 'old' : 'same';
  const absoluteSavings = Math.abs(savings);

  return (
    <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
      {/* Summary Banner */}
      <div className={`p-6 rounded-xl mb-6 ${
        betterRegime === 'new' 
          ? 'bg-emerald-500/10 border border-emerald-500/30' 
          : betterRegime === 'old'
          ? 'bg-amber-500/10 border border-amber-500/30'
          : 'bg-muted border border-border'
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${
              betterRegime === 'same' ? 'bg-muted' : 'bg-card'
            }`}>
              <Scale className={`w-6 h-6 ${
                betterRegime === 'new' ? 'text-emerald-600' : 
                betterRegime === 'old' ? 'text-amber-600' : 'text-muted-foreground'
              }`} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg">
                {betterRegime === 'same' 
                  ? 'Both regimes result in same tax'
                  : `${betterRegime === 'new' ? 'New' : 'Old'} Regime is better for you`}
              </h3>
              {betterRegime !== 'same' && (
                <p className="text-muted-foreground text-sm">
                  You save {formatCurrency(absoluteSavings)} annually
                </p>
              )}
            </div>
          </div>
          {betterRegime !== 'same' && (
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Old Regime Card */}
        <div className={`regime-card ${betterRegime === 'old' ? 'regime-old ring-2 ring-amber-400' : 'border-border bg-card'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-xl">Old Regime</h3>
              {betterRegime === 'old' && (
                <CheckCircle className="w-5 h-5 text-amber-600" />
              )}
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">
              With Deductions
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Gross Income</span>
              <span className="font-medium">{formatCurrency(oldRegime.grossIncome)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Total Deductions</span>
              <span className="font-medium text-accent">- {formatCurrency(oldRegime.totalDeductions)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Taxable Income</span>
              <span className="font-medium">{formatCurrency(oldRegime.taxableIncome)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Tax (Before Cess)</span>
              <span className="font-medium">{formatCurrency(oldRegime.taxBeforeCess)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Health & Education Cess (4%)</span>
              <span className="font-medium">{formatCurrency(oldRegime.cess)}</span>
            </div>
            <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-amber-300">
              <span className="font-display font-semibold text-lg">Total Tax</span>
              <span className="tax-highlight text-amber-600">{formatCurrency(oldRegime.totalTax)}</span>
            </div>
            <div className="flex justify-between items-center py-2 bg-muted/50 px-3 rounded-lg">
              <span className="text-muted-foreground">Effective Tax Rate</span>
              <span className="font-medium">{oldRegime.effectiveTaxRate.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-amber-50 px-3 rounded-lg">
              <span className="font-medium">Net In-Hand (Annual)</span>
              <span className="font-display font-bold text-lg">{formatCurrency(oldRegime.netIncome)}</span>
            </div>
          </div>
        </div>

        {/* New Regime Card */}
        <div className={`regime-card ${betterRegime === 'new' ? 'regime-new ring-2 ring-emerald-400' : 'border-border bg-card'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-xl">New Regime</h3>
              {betterRegime === 'new' && (
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              )}
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
              AY 2026-27
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Gross Income</span>
              <span className="font-medium">{formatCurrency(newRegime.grossIncome)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Standard Deduction</span>
              <span className="font-medium text-accent">- {formatCurrency(newRegime.totalDeductions)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Taxable Income</span>
              <span className="font-medium">{formatCurrency(newRegime.taxableIncome)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Tax (Before Cess)</span>
              <span className="font-medium">{formatCurrency(newRegime.taxBeforeCess)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Health & Education Cess (4%)</span>
              <span className="font-medium">{formatCurrency(newRegime.cess)}</span>
            </div>
            <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-emerald-300">
              <span className="font-display font-semibold text-lg">Total Tax</span>
              <span className="tax-highlight text-emerald-600">{formatCurrency(newRegime.totalTax)}</span>
            </div>
            <div className="flex justify-between items-center py-2 bg-muted/50 px-3 rounded-lg">
              <span className="text-muted-foreground">Effective Tax Rate</span>
              <span className="font-medium">{newRegime.effectiveTaxRate.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-emerald-50 px-3 rounded-lg">
              <span className="font-medium">Net In-Hand (Annual)</span>
              <span className="font-display font-bold text-lg">{formatCurrency(newRegime.netIncome)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
