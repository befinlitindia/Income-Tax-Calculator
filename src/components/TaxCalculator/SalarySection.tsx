import React from 'react';
import { SalaryBreakdown } from './types';
import { InputField } from './InputField';
import { Briefcase } from 'lucide-react';

interface SalarySectionProps {
  salary: SalaryBreakdown;
  onChange: (salary: SalaryBreakdown) => void;
}

export const SalarySection: React.FC<SalarySectionProps> = ({ salary, onChange }) => {
  const updateField = (field: keyof SalaryBreakdown, value: number) => {
    onChange({ ...salary, [field]: value });
  };

  return (
    <div className="card-elevated p-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Briefcase className="w-5 h-5 text-primary" />
        </div>
        <h2 className="section-title mb-0">Salary Breakdown</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Basic Salary (Annual)"
          value={salary.basicSalary}
          onChange={(v) => updateField('basicSalary', v)}
          tooltip="Your annual basic salary component"
        />
        <InputField
          label="House Rent Allowance (HRA)"
          value={salary.hra}
          onChange={(v) => updateField('hra', v)}
          tooltip="Annual HRA received from employer"
        />
        <InputField
          label="Special Allowance"
          value={salary.specialAllowance}
          onChange={(v) => updateField('specialAllowance', v)}
          tooltip="Annual special allowance component"
        />
        <InputField
          label="Leave Travel Allowance (LTA)"
          value={salary.lta}
          onChange={(v) => updateField('lta', v)}
          tooltip="Annual LTA received"
        />
        <InputField
          label="Other Allowances"
          value={salary.otherAllowances}
          onChange={(v) => updateField('otherAllowances', v)}
          tooltip="Any other taxable allowances"
        />
        <InputField
          label="Bonus / Variable Pay"
          value={salary.bonus}
          onChange={(v) => updateField('bonus', v)}
          tooltip="Annual bonus or variable pay"
        />
      </div>
    </div>
  );
};
