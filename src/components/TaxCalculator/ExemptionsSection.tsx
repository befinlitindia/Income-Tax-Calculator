import React, { useState, useEffect } from 'react';
import { SalaryExemptions, SalaryBreakdown } from './types';
import { InputField } from './InputField';
import { Shield, ChevronDown, ChevronUp, Home } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ExemptionsSectionProps {
  exemptions: SalaryExemptions;
  salary: SalaryBreakdown;
  onChange: (exemptions: SalaryExemptions) => void;
}

export const ExemptionsSection: React.FC<ExemptionsSectionProps> = ({ exemptions, salary, onChange }) => {
  const [hraOpen, setHraOpen] = useState(true);
  const [otherExemptionsOpen, setOtherExemptionsOpen] = useState(false);

  const updateField = (field: keyof SalaryExemptions, value: number | boolean) => {
    onChange({ ...exemptions, [field]: value });
  };

  // Calculate HRA exemption whenever inputs change
  useEffect(() => {
    const calculateHRAExemption = () => {
      const basicSalary = salary.section17_1.basicSalary;
      const da = salary.section17_1.dearnessAllowance;
      const hraReceived = salary.specialAllowances.hra;
      const rentPaid = exemptions.rentPaid;
      const isMetro = exemptions.isMetroCity;

      if (hraReceived === 0 || rentPaid === 0) {
        return 0;
      }

      // HRA Exemption is MINIMUM of:
      // 1. Actual HRA received
      // 2. Rent paid - 10% of (Basic + DA)
      // 3. 50% of (Basic + DA) for metro cities OR 40% for non-metro

      const basicPlusDA = basicSalary + da;
      const actualHRA = hraReceived;
      const rentMinus10Percent = rentPaid - (0.10 * basicPlusDA);
      const metroPercentage = isMetro ? 0.50 : 0.40;
      const percentageOfBasic = metroPercentage * basicPlusDA;

      const hraExemption = Math.max(0, Math.min(actualHRA, rentMinus10Percent, percentageOfBasic));
      return Math.round(hraExemption);
    };

    const calculatedHRA = calculateHRAExemption();
    if (calculatedHRA !== exemptions.hraExemption) {
      onChange({ ...exemptions, hraExemption: calculatedHRA });
    }
  }, [salary.section17_1.basicSalary, salary.section17_1.dearnessAllowance, salary.specialAllowances.hra, exemptions.rentPaid, exemptions.isMetroCity]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-emerald-500/10">
          <Shield className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="section-title mb-0">Salary Exemptions</h2>
          <p className="text-xs text-muted-foreground mt-1">Applicable for Old Regime</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* HRA Exemption Calculator */}
        <Collapsible open={hraOpen} onOpenChange={setHraOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-sm">HRA Exemption Calculator</span>
            </div>
            {hraOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Total Rent Paid (Annual)"
                  value={exemptions.rentPaid}
                  onChange={(v) => updateField('rentPaid', v)}
                  tooltip="Total rent paid during the financial year"
                />
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">City Type</Label>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <span className={`text-sm ${!exemptions.isMetroCity ? 'font-medium' : 'text-muted-foreground'}`}>
                      Non-Metro
                    </span>
                    <Switch
                      checked={exemptions.isMetroCity}
                      onCheckedChange={(checked) => updateField('isMetroCity', checked)}
                    />
                    <span className={`text-sm ${exemptions.isMetroCity ? 'font-medium' : 'text-muted-foreground'}`}>
                      Metro (Delhi, Mumbai, Chennai, Kolkata)
                    </span>
                  </div>
                </div>
              </div>
              
              {/* HRA Calculation Summary */}
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-emerald-700">Calculated HRA Exemption</span>
                  <span className="font-bold text-emerald-700">{formatCurrency(exemptions.hraExemption)}</span>
                </div>
                {salary.specialAllowances.hra > 0 && exemptions.rentPaid > 0 && (
                  <p className="text-xs text-emerald-600 mt-2">
                    Minimum of: HRA Received ({formatCurrency(salary.specialAllowances.hra)}), 
                    Rent - 10% of Basic ({formatCurrency(exemptions.rentPaid - (0.10 * (salary.section17_1.basicSalary + salary.section17_1.dearnessAllowance)))}), 
                    {exemptions.isMetroCity ? '50%' : '40%'} of Basic ({formatCurrency((exemptions.isMetroCity ? 0.50 : 0.40) * (salary.section17_1.basicSalary + salary.section17_1.dearnessAllowance))})
                  </p>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Other Salary Exemptions */}
        <Collapsible open={otherExemptionsOpen} onOpenChange={setOtherExemptionsOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-sm">Other Salary Exemptions</span>
            </div>
            {otherExemptionsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="LTA Exemption (Max claimed)"
                value={exemptions.ltaExemption}
                onChange={(v) => updateField('ltaExemption', v)}
                tooltip="Leave Travel Allowance exemption claimed"
              />
              <InputField
                label="Gratuity Exemption"
                value={exemptions.gratuityExemption}
                onChange={(v) => updateField('gratuityExemption', v)}
                tooltip="Exempt portion of gratuity received (Max ₹20L for govt, ₹20L for others)"
              />
              <InputField
                label="Leave Encashment Exemption"
                value={exemptions.leaveEncashmentExemption}
                onChange={(v) => updateField('leaveEncashmentExemption', v)}
                tooltip="Exempt leave encashment on retirement (Max ₹25L)"
              />
              <InputField
                label="Professional Tax"
                value={exemptions.professionalTax}
                onChange={(v) => updateField('professionalTax', v)}
                tooltip="State professional tax paid (Max ₹2,500)"
              />
              <InputField
                label="Entertainment Allowance (Govt only)"
                value={exemptions.entertainmentAllowance}
                onChange={(v) => updateField('entertainmentAllowance', v)}
                tooltip="Entertainment allowance for govt employees only"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
