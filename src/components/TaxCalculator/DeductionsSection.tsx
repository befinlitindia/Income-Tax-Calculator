import React from 'react';
import { Deductions } from './types';
import { InputField } from './InputField';
import { PiggyBank } from 'lucide-react';

interface DeductionsSectionProps {
  deductions: Deductions;
  onChange: (deductions: Deductions) => void;
}

export const DeductionsSection: React.FC<DeductionsSectionProps> = ({ deductions, onChange }) => {
  const updateField = (field: keyof Deductions, value: number) => {
    onChange({ ...deductions, [field]: value });
  };

  return (
    <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-accent/10">
          <PiggyBank className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="section-title mb-0">Deductions</h2>
          <p className="text-xs text-muted-foreground mt-1">Applicable for Old Regime only (except Standard Deduction)</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Section 80C (Max ₹1.5L)"
          value={deductions.section80C}
          onChange={(v) => updateField('section80C', v)}
          tooltip="PPF, ELSS, LIC, PF, etc. Max limit: ₹1,50,000"
        />
        <InputField
          label="Section 80D - Medical Insurance"
          value={deductions.section80D}
          onChange={(v) => updateField('section80D', v)}
          tooltip="Health insurance premium for self, family & parents"
        />
        <InputField
          label="Section 80CCD(1B) - NPS"
          value={deductions.section80CCD1B}
          onChange={(v) => updateField('section80CCD1B', v)}
          tooltip="Additional NPS contribution. Max: ₹50,000"
        />
        <InputField
          label="Section 80E - Education Loan"
          value={deductions.section80E}
          onChange={(v) => updateField('section80E', v)}
          tooltip="Interest on education loan (no max limit)"
        />
        <InputField
          label="Section 80G - Donations"
          value={deductions.section80G}
          onChange={(v) => updateField('section80G', v)}
          tooltip="Donations to eligible charitable institutions"
        />
        <InputField
          label="HRA Exemption"
          value={deductions.hraExemption}
          onChange={(v) => updateField('hraExemption', v)}
          tooltip="Calculated HRA exemption based on rent paid"
        />
        <InputField
          label="Professional Tax"
          value={deductions.professionalTax}
          onChange={(v) => updateField('professionalTax', v)}
          tooltip="State professional tax paid (max ₹2,500)"
        />
      </div>
    </div>
  );
};
