import React from 'react';
import { TaxResult, Deductions } from './types';
import { formatCurrency } from './taxUtils';
import { Lightbulb, TrendingUp, Shield, Coins, Building } from 'lucide-react';

interface SuggestionsProps {
  oldRegime: TaxResult;
  newRegime: TaxResult;
  deductions: Deductions;
}

export const Suggestions: React.FC<SuggestionsProps> = ({ oldRegime, newRegime, deductions }) => {
  const suggestions: Array<{ icon: React.ReactNode; title: string; description: string; impact?: string }> = [];

  // Check 80C utilization
  if (deductions.chapterVIA.section80C < 150000) {
    const remaining = 150000 - deductions.chapterVIA.section80C;
    suggestions.push({
      icon: <Coins className="w-5 h-5" />,
      title: "Maximize Section 80C Investments",
      description: `You can invest ₹${new Intl.NumberFormat('en-IN').format(remaining)} more in PPF, ELSS, or life insurance to claim full 80C benefits under Old Regime.`,
      impact: `Potential savings: ${formatCurrency(Math.min(remaining * 0.3, 45000))}`,
    });
  }

  // Check 80CCD(1B) utilization
  if (deductions.chapterVIA.section80CCD1B < 50000) {
    suggestions.push({
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Consider NPS Investment",
      description: "Invest up to ₹50,000 in NPS to claim additional deduction under Section 80CCD(1B). This is over and above the 80C limit.",
      impact: `Potential savings: ${formatCurrency((50000 - deductions.chapterVIA.section80CCD1B) * 0.3)}`,
    });
  }

  // Check Health Insurance
  const total80D = deductions.chapterVIA.section80D_self + deductions.chapterVIA.section80D_parents;
  if (total80D < 25000) {
    suggestions.push({
      icon: <Shield className="w-5 h-5" />,
      title: "Get Health Insurance Coverage",
      description: "Health insurance premium up to ₹25,000 (₹50,000 for senior citizens) is deductible under 80D. Consider coverage for parents too for additional benefits.",
      impact: "Stay protected + Tax savings",
    });
  }

  // General regime suggestion
  const betterRegime = oldRegime.totalTax < newRegime.totalTax ? 'old' : 'new';
  if (betterRegime === 'new' && oldRegime.totalDeductions < 200000) {
    suggestions.push({
      icon: <Building className="w-5 h-5" />,
      title: "New Regime May Be Better",
      description: "With your current deductions level, the New Regime offers lower tax. However, if you can increase deductions significantly, Old Regime might become beneficial.",
    });
  }

  // HRA suggestion
  if (deductions.exemptions.hraExemption === 0 && oldRegime.grossIncome > 500000) {
    suggestions.push({
      icon: <Building className="w-5 h-5" />,
      title: "Claim HRA Exemption",
      description: "If you're paying rent, you can claim HRA exemption under the Old Regime. This can significantly reduce your taxable income.",
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Great Tax Planning!",
      description: "You seem to be utilizing most available deductions. Review your investments annually to ensure they align with your financial goals.",
    });
  }

  return (
    <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="section-title mb-0">Tax Saving Suggestions</h2>
          <p className="text-xs text-muted-foreground mt-1">Personalized recommendations to optimize your tax</p>
        </div>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <div className="flex gap-4">
              <div className="p-2 rounded-lg bg-primary/10 h-fit">
                <span className="text-primary">{suggestion.icon}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">{suggestion.title}</h4>
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                {suggestion.impact && (
                  <p className="text-sm font-medium text-accent mt-2">{suggestion.impact}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
        <p className="text-xs text-muted-foreground">
          <strong>Disclaimer:</strong> This calculator provides estimates based on the provisions of the Income Tax Act, 1961 as amended by Finance Act 2025 for AY 2026-27. 
          The calculations are for illustrative purposes only. Please consult a qualified tax professional for personalized advice.
        </p>
      </div>
    </div>
  );
};
