import React, { useState } from 'react';
import { SalaryBreakdown } from './types';
import { InputField } from './InputField';
import { Briefcase, ChevronDown, ChevronUp, Gift, TrendingUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SalarySectionProps {
  salary: SalaryBreakdown;
  onChange: (salary: SalaryBreakdown) => void;
}

export const SalarySection: React.FC<SalarySectionProps> = ({ salary, onChange }) => {
  const [section17_1Open, setSection17_1Open] = useState(true);
  const [specialAllowancesOpen, setSpecialAllowancesOpen] = useState(false);
  const [section17_2Open, setSection17_2Open] = useState(false);
  const [section17_3Open, setSection17_3Open] = useState(false);

  const updateSection17_1 = (field: keyof typeof salary.section17_1, value: number) => {
    onChange({ ...salary, section17_1: { ...salary.section17_1, [field]: value } });
  };

  const updateSpecialAllowances = (field: keyof typeof salary.specialAllowances, value: number) => {
    onChange({ ...salary, specialAllowances: { ...salary.specialAllowances, [field]: value } });
  };

  const updateSection17_2 = (field: keyof typeof salary.section17_2, value: number) => {
    onChange({ ...salary, section17_2: { ...salary.section17_2, [field]: value } });
  };

  const updateSection17_3 = (field: keyof typeof salary.section17_3, value: number) => {
    onChange({ ...salary, section17_3: { ...salary.section17_3, [field]: value } });
  };

  return (
    <div className="card-elevated p-4 sm:p-6 animate-slide-up">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        <h2 className="section-title mb-0 text-base sm:text-lg">Salary Breakdown</h2>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {/* Section 17(1) - Salary (Only Basic + DA) */}
        <Collapsible open={section17_1Open} onOpenChange={setSection17_1Open}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 sm:p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
            <div className="flex items-center gap-2">
              <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              <span className="font-medium text-xs sm:text-sm">Section 17(1) - Salary</span>
            </div>
            {section17_1Open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 sm:pt-4 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <InputField
                label="Basic Salary (Annual)"
                value={salary.section17_1.basicSalary}
                onChange={(v) => updateSection17_1('basicSalary', v)}
                tooltip="Your annual basic salary component"
              />
              <InputField
                label="Dearness Allowance"
                value={salary.section17_1.dearnessAllowance}
                onChange={(v) => updateSection17_1('dearnessAllowance', v)}
                tooltip="Annual dearness allowance received"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Special Allowances - Separate Collapsible */}
        <Collapsible open={specialAllowancesOpen} onOpenChange={setSpecialAllowancesOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 sm:p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
            <div className="flex items-center gap-2">
              <Gift className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
              <span className="font-medium text-xs sm:text-sm">Special Allowances</span>
            </div>
            {specialAllowancesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 sm:pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <InputField
                label="House Rent Allowance (HRA)"
                value={salary.specialAllowances.hra}
                onChange={(v) => updateSpecialAllowances('hra', v)}
                tooltip="Annual HRA received from employer"
              />
              <InputField
                label="Leave Travel Allowance (LTA)"
                value={salary.specialAllowances.lta}
                onChange={(v) => updateSpecialAllowances('lta', v)}
                tooltip="Annual LTA received"
              />
              <InputField
                label="Leave Encashment"
                value={salary.specialAllowances.leaveEncashment}
                onChange={(v) => updateSpecialAllowances('leaveEncashment', v)}
                tooltip="Leave encashment received during service"
              />
              <InputField
                label="Conveyance Allowance"
                value={salary.specialAllowances.conveyanceAllowance}
                onChange={(v) => updateSpecialAllowances('conveyanceAllowance', v)}
                tooltip="Annual conveyance allowance"
              />
              <InputField
                label="Medical Allowance"
                value={salary.specialAllowances.medicalAllowance}
                onChange={(v) => updateSpecialAllowances('medicalAllowance', v)}
                tooltip="Annual medical allowance received"
              />
              <InputField
                label="Meal Allowance / Food Coupons"
                value={salary.specialAllowances.mealAllowance}
                onChange={(v) => updateSpecialAllowances('mealAllowance', v)}
                tooltip="Annual meal allowance or food coupon value"
              />
              <InputField
                label="Uniform Allowance"
                value={salary.specialAllowances.uniformAllowance}
                onChange={(v) => updateSpecialAllowances('uniformAllowance', v)}
                tooltip="Uniform allowance received"
              />
              <InputField
                label="Other Allowances"
                value={salary.specialAllowances.otherAllowances}
                onChange={(v) => updateSpecialAllowances('otherAllowances', v)}
                tooltip="Any other taxable allowances"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Section 17(2) - Perquisites */}
        <Collapsible open={section17_2Open} onOpenChange={setSection17_2Open}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 sm:p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
            <div className="flex items-center gap-2">
              <Gift className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
              <span className="font-medium text-xs sm:text-sm">Section 17(2) - Perquisites</span>
            </div>
            {section17_2Open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 sm:pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <InputField
                label="Rent Free Accommodation"
                value={salary.section17_2.rentFreeAccommodation}
                onChange={(v) => updateSection17_2('rentFreeAccommodation', v)}
                tooltip="Value of rent-free accommodation provided"
              />
              <InputField
                label="Motor Car / Conveyance Provided"
                value={salary.section17_2.motorCarProvided}
                onChange={(v) => updateSection17_2('motorCarProvided', v)}
                tooltip="Value of motor car/conveyance facility"
              />
              <InputField
                label="Free Education for Children"
                value={salary.section17_2.freeEducation}
                onChange={(v) => updateSection17_2('freeEducation', v)}
                tooltip="Value of free education facility"
              />
              <InputField
                label="Interest Free/Concessional Loans"
                value={salary.section17_2.interestFreeLoans}
                onChange={(v) => updateSection17_2('interestFreeLoans', v)}
                tooltip="Perquisite value of interest-free loans"
              />
              <InputField
                label="Other Perquisites"
                value={salary.section17_2.otherPerquisites}
                onChange={(v) => updateSection17_2('otherPerquisites', v)}
                tooltip="Any other perquisites"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Section 17(3) - Profits in lieu of Salary */}
        <Collapsible open={section17_3Open} onOpenChange={setSection17_3Open}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 sm:p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
              <span className="font-medium text-xs sm:text-sm">Section 17(3) - Profits in lieu of Salary</span>
            </div>
            {section17_3Open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 sm:pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <InputField
                label="Bonus / Performance Pay"
                value={salary.section17_3.bonus}
                onChange={(v) => updateSection17_3('bonus', v)}
                tooltip="Annual bonus or performance pay"
              />
              <InputField
                label="Commission"
                value={salary.section17_3.commission}
                onChange={(v) => updateSection17_3('commission', v)}
                tooltip="Commission received"
              />
              <InputField
                label="Retirement Benefits (Taxable)"
                value={salary.section17_3.retirementBenefits}
                onChange={(v) => updateSection17_3('retirementBenefits', v)}
                tooltip="Taxable portion of retirement benefits"
              />
              <InputField
                label="Ex-Gratia"
                value={salary.section17_3.exGratia}
                onChange={(v) => updateSection17_3('exGratia', v)}
                tooltip="Ex-gratia payments received"
              />
              <InputField
                label="Other Profits"
                value={salary.section17_3.otherProfits}
                onChange={(v) => updateSection17_3('otherProfits', v)}
                tooltip="Any other profits in lieu of salary"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
