import React, { useState, useMemo } from 'react';
import { ChapterVIADeductions, SalaryBreakdown, Section80GDonation, UserProfile } from './types';
import { InputField } from './InputField';
import { calculate80CCD1B, calculate80GGDeduction, calculate80GDeduction } from './taxUtils';
import { PiggyBank, ChevronDown, ChevronUp, Landmark, Heart, GraduationCap, HandHeart, Home, Coins, Accessibility, Info, Plus, Trash2 } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ChapterVIASectionProps {
  deductions: ChapterVIADeductions;
  salary: SalaryBreakdown;
  userProfile: UserProfile;
  grossIncome: number;
  onChange: (deductions: ChapterVIADeductions) => void;
}

const DONATION_TYPES = {
  '100_unlimited': {
    label: '100% Deduction (Unlimited)',
    examples: 'PM National Relief Fund, National Defence Fund, PM CARES Fund',
    percentage: 100
  },
  '50_unlimited': {
    label: '50% Deduction (Unlimited)', 
    examples: 'PM Drought Relief Fund, National Children\'s Fund',
    percentage: 50
  },
  '100_limited': {
    label: '100% Deduction (Limited to 10% of GTI)',
    examples: 'Local authority/govt for family planning, approved university/institution for scientific research',
    percentage: 100
  },
  '50_limited': {
    label: '50% Deduction (Limited to 10% of GTI)',
    examples: 'Other approved charitable institutions with 80G certificate',
    percentage: 50
  }
};

export const ChapterVIASection: React.FC<ChapterVIASectionProps> = ({ deductions, salary, userProfile, grossIncome, onChange }) => {
  const [section80COpen, setSection80COpen] = useState(true);
  const [section80CCDOpen, setSection80CCDOpen] = useState(false);
  const [section80DOpen, setSection80DOpen] = useState(false);
  const [section80GOpen, setSection80GOpen] = useState(false);
  const [section80GGOpen, setSection80GGOpen] = useState(false);
  const [otherDeductionsOpen, setOtherDeductionsOpen] = useState(false);

  const updateField = (field: keyof ChapterVIADeductions, value: number) => {
    onChange({ ...deductions, [field]: value });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate NPS deduction limits based on Basic + DA
  const npsCalculation = useMemo(() => {
    const basicPlusDA = salary.section17_1.basicSalary + salary.section17_1.dearnessAllowance;
    
    // 80CCD(1): Employee contribution - Max 10% of Basic+DA, within 80C limit of 1.5L
    const maxEmployeeNPS = Math.round(basicPlusDA * 0.10);
    const usedIn80C = Math.min(deductions.section80C, 150000);
    const remainingFor80CCD1 = Math.max(0, 150000 - usedIn80C);
    const ccd1InLimit = Math.min(deductions.section80CCD1, remainingFor80CCD1, maxEmployeeNPS);
    
    // 80CCD(1B): Auto-calculated from excess NPS over 80C
    const autoCalculated80CCD1B = calculate80CCD1B(deductions.section80C, deductions.section80CCD1, maxEmployeeNPS);
    
    // 80CCD(2): Employer contribution - Max 14% for Govt, 10% for others
    const maxEmployerNPS_Govt = Math.round(basicPlusDA * 0.14);
    const maxEmployerNPS_Private = Math.round(basicPlusDA * 0.10);
    const allowedCCD2 = Math.min(deductions.section80CCD2, maxEmployerNPS_Govt);
    
    return {
      basicPlusDA,
      maxEmployeeNPS,
      ccd1InLimit,
      autoCalculated80CCD1B,
      maxEmployerNPS_Govt,
      maxEmployerNPS_Private,
      allowedCCD2,
      totalNPSDeduction: ccd1InLimit + autoCalculated80CCD1B + allowedCCD2,
    };
  }, [salary.section17_1.basicSalary, salary.section17_1.dearnessAllowance, deductions.section80C, deductions.section80CCD1, deductions.section80CCD2]);

  // 80D limits based on senior citizen status
  const section80DLimits = useMemo(() => {
    const selfLimit = userProfile.age >= 60 ? 50000 : 25000;
    const parentsLimit = userProfile.isParentSeniorCitizen ? 50000 : 25000;
    return { selfLimit, parentsLimit };
  }, [userProfile.age, userProfile.isParentSeniorCitizen]);

  // 80GG calculation
  const section80GGCalculation = useMemo(() => {
    return calculate80GGDeduction(deductions.section80GG_monthlyRent, grossIncome);
  }, [deductions.section80GG_monthlyRent, grossIncome]);

  // 80G calculation
  const section80GCalculation = useMemo(() => {
    return calculate80GDeduction(deductions.section80G_donations, grossIncome);
  }, [deductions.section80G_donations, grossIncome]);

  // Add donation
  const addDonation = () => {
    const newDonation: Section80GDonation = {
      type: '50_limited',
      institutionName: '',
      amount: 0
    };
    onChange({
      ...deductions,
      section80G_donations: [...deductions.section80G_donations, newDonation]
    });
  };

  // Update donation
  const updateDonation = (index: number, field: keyof Section80GDonation, value: string | number) => {
    const updated = [...deductions.section80G_donations];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...deductions, section80G_donations: updated });
  };

  // Remove donation
  const removeDonation = (index: number) => {
    const updated = deductions.section80G_donations.filter((_, i) => i !== index);
    onChange({ ...deductions, section80G_donations: updated });
  };

  return (
    <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-accent/10">
          <PiggyBank className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="section-title mb-0">Chapter VI-A Deductions</h2>
          <p className="text-xs text-muted-foreground mt-1">Tax saving investments and deductions</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Section 80C */}
        <Collapsible open={section80COpen} onOpenChange={setSection80COpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-accent" />
              <span className="font-medium text-sm">Section 80C (Max ₹1,50,000)</span>
            </div>
            {section80COpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <p className="text-xs text-muted-foreground mb-4">
              Investments in PPF, ELSS, LIC Premium, EPF, NSC, Tax Saver FD, ULIP, Tuition Fees, Home Loan Principal, etc.
            </p>
            <InputField
              label="Total 80C Investments"
              value={deductions.section80C}
              onChange={(v) => updateField('section80C', v)}
              tooltip="Total of all 80C eligible investments (Max limit: ₹1,50,000)"
            />
          </CollapsibleContent>
        </Collapsible>

        {/* Section 80CCD - NPS with detailed calculation */}
        <Collapsible open={section80CCDOpen} onOpenChange={setSection80CCDOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-600" />
              <span className="font-medium text-sm">Section 80CCD - NPS</span>
              <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                80CCD(2) in Both Regimes
              </Badge>
            </div>
            {section80CCDOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="space-y-4">
              {/* NPS Calculation Info Box */}
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-amber-700 space-y-1">
                    <p><strong>Basic + DA:</strong> {formatCurrency(npsCalculation.basicPlusDA)}</p>
                    <p><strong>80CCD(1) Limit:</strong> 10% of Basic+DA = {formatCurrency(npsCalculation.maxEmployeeNPS)} (within 80C limit of ₹1,50,000)</p>
                    <p><strong>80CCD(1B):</strong> Excess NPS contribution beyond 80C limit (auto-calculated, Max ₹50,000)</p>
                    <p><strong>80CCD(2) Limit (Employer's Contr.):</strong> 14% for Govt Employees ({formatCurrency(npsCalculation.maxEmployerNPS_Govt)}) / 10% for Private Employees ({formatCurrency(npsCalculation.maxEmployerNPS_Private)})</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <InputField
                    label="80CCD(1) - Employee NPS Contribution"
                    value={deductions.section80CCD1}
                    onChange={(v) => updateField('section80CCD1', v)}
                    tooltip="Employee's contribution to NPS (Max 10% of Basic+DA). Amount within 80C limit goes to 80C, excess automatically goes to 80CCD(1B)"
                  />
                  <p className="text-xs text-muted-foreground ml-1">
                    Within 80C: {formatCurrency(npsCalculation.ccd1InLimit)} | Auto 80CCD(1B): {formatCurrency(npsCalculation.autoCalculated80CCD1B)}
                  </p>
                </div>
                
                <div className="relative space-y-2">
                  <InputField
                    label="80CCD(2) - Employer NPS Contribution"
                    value={deductions.section80CCD2}
                    onChange={(v) => updateField('section80CCD2', v)}
                    tooltip="Employer's contribution to NPS - Available in BOTH regimes (14% for Govt, 10% for Private)"
                  />
                  <Badge className="absolute top-0 right-0 bg-emerald-500 text-white text-xs">
                    Both Regimes
                  </Badge>
                  <p className="text-xs text-muted-foreground ml-1">
                    Allowed: {formatCurrency(npsCalculation.allowedCCD2)} (Max: {formatCurrency(npsCalculation.maxEmployerNPS_Govt)} for Govt / {formatCurrency(npsCalculation.maxEmployerNPS_Private)} for Private)
                  </p>
                </div>
              </div>

              {/* Total NPS Summary */}
              <div className="p-3 bg-amber-100 rounded-lg border border-amber-300">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-amber-800">Total NPS Deduction Allowed</span>
                  <span className="font-bold text-amber-800">{formatCurrency(npsCalculation.totalNPSDeduction)}</span>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Section 80D - Medical Insurance */}
        <Collapsible open={section80DOpen} onOpenChange={setSection80DOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="font-medium text-sm">Section 80D - Medical Insurance</span>
            </div>
            {section80DOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label={`Self & Family Premium (Max ₹${section80DLimits.selfLimit.toLocaleString('en-IN')})`}
                value={deductions.section80D_self}
                onChange={(v) => updateField('section80D_self', v)}
                tooltip={`Health insurance premium for self, spouse & children (₹25,000 normal, ₹50,000 if senior citizen). You are ${userProfile.age >= 60 ? 'a senior citizen' : 'not a senior citizen'}.`}
              />
              <InputField
                label={`Parents Premium (Max ₹${section80DLimits.parentsLimit.toLocaleString('en-IN')})`}
                value={deductions.section80D_parents}
                onChange={(v) => updateField('section80D_parents', v)}
                tooltip={`Health insurance premium for parents (₹25,000 normal, ₹50,000 if senior citizen). Parents are ${userProfile.isParentSeniorCitizen ? 'senior citizens' : 'not senior citizens'}.`}
              />
            </div>
            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-xs text-red-700">
                <strong>Note:</strong> You can also claim up to <strong>₹5,000</strong> for preventive health check-up within the 80D limit for self/family and parents separately.
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Section 80G - Charitable Donations (Detailed) */}
        <Collapsible open={section80GOpen} onOpenChange={setSection80GOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
            <div className="flex items-center gap-2">
              <HandHeart className="w-4 h-4 text-purple-500" />
              <span className="font-medium text-sm">Section 80G - Charitable Donations</span>
            </div>
            {section80GOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-purple-700 space-y-2">
                    <p><strong>Donation Categories:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>100% Unlimited:</strong> PM Relief Fund, PM CARES, National Defence Fund</li>
                      <li><strong>50% Unlimited:</strong> PM Drought Relief Fund, National Children's Fund</li>
                      <li><strong>100% Limited (10% of GTI):</strong> Approved universities, scientific research institutions</li>
                      <li><strong>50% Limited (10% of GTI):</strong> Other approved charitable institutions</li>
                    </ul>
                    <p className="mt-2"><strong>Important:</strong> For 50% limited deductions, you must have an 80G certificate from the charitable institution.</p>
                  </div>
                </div>
              </div>

              {deductions.section80G_donations.map((donation, index) => (
                <div key={index} className="p-4 bg-muted/30 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Donation {index + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeDonation(index)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-sm">Donation Type</Label>
                      <Select 
                        value={donation.type} 
                        onValueChange={(v) => updateDonation(index, 'type', v as Section80GDonation['type'])}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(DONATION_TYPES).map(([key, val]) => (
                            <SelectItem key={key} value={key}>{val.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <InputField
                      label="Donation Amount"
                      value={donation.amount}
                      onChange={(v) => updateDonation(index, 'amount', v)}
                    />
                  </div>
                  <InputField
                    label="Institution Name (Optional)"
                    value={0}
                    onChange={() => {}}
                    className="hidden"
                  />
                  <input
                    type="text"
                    placeholder="Institution name (optional)"
                    value={donation.institutionName || ''}
                    onChange={(e) => updateDonation(index, 'institutionName', e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-md"
                  />
                  <p className="text-xs text-muted-foreground">
                    Deduction: {DONATION_TYPES[donation.type].percentage}% = {formatCurrency(donation.amount * DONATION_TYPES[donation.type].percentage / 100)}
                    {donation.type.includes('limited') && ` (subject to 10% of GTI limit: ${formatCurrency(grossIncome * 0.10)})`}
                  </p>
                </div>
              ))}

              <Button variant="outline" onClick={addDonation} className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Add Donation
              </Button>

              <div className="p-3 bg-purple-100 rounded-lg border border-purple-300">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-purple-800">Total 80G Deduction</span>
                  <span className="font-bold text-purple-800">{formatCurrency(section80GCalculation)}</span>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Section 80GG - Rent Deduction Calculator */}
        <Collapsible open={section80GGOpen} onOpenChange={setSection80GGOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-cyan-500" />
              <span className="font-medium text-sm">Section 80GG - Rent Paid (No HRA)</span>
            </div>
            {section80GGOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="space-y-4">
              <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-cyan-700 space-y-1">
                    <p><strong>80GG Eligibility:</strong> For salaried individuals who do NOT receive HRA from employer.</p>
                    <p><strong>Deduction is MINIMUM of:</strong></p>
                    <ul className="list-disc list-inside">
                      <li>₹5,000 per month (₹60,000 per year)</li>
                      <li>25% of Total Income = {formatCurrency(grossIncome * 0.25)}</li>
                      <li>Rent paid minus 10% of Total Income</li>
                    </ul>
                  </div>
                </div>
              </div>

              <InputField
                label="Monthly Rent Paid"
                value={deductions.section80GG_monthlyRent}
                onChange={(v) => updateField('section80GG_monthlyRent', v)}
                tooltip="Enter the rent you pay per month (for those not receiving HRA)"
              />

              {deductions.section80GG_monthlyRent > 0 && (
                <div className="p-4 bg-cyan-100 rounded-lg border border-cyan-300 space-y-2">
                  <p className="text-sm font-medium text-cyan-800">80GG Calculation:</p>
                  <div className="text-xs text-cyan-700 space-y-1">
                    <p>Annual Rent: {formatCurrency(deductions.section80GG_monthlyRent * 12)}</p>
                    <p>Option 1 (Max ₹5,000/month): {formatCurrency(60000)}</p>
                    <p>Option 2 (25% of Income): {formatCurrency(grossIncome * 0.25)}</p>
                    <p>Option 3 (Rent - 10% of Income): {formatCurrency(Math.max(0, deductions.section80GG_monthlyRent * 12 - grossIncome * 0.10))}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-cyan-300">
                    <span className="text-sm font-medium text-cyan-800">Eligible Deduction (Minimum of above)</span>
                    <span className="font-bold text-cyan-800">{formatCurrency(section80GGCalculation)}</span>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Other Deductions */}
        <Collapsible open={otherDeductionsOpen} onOpenChange={setOtherDeductionsOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
            <div className="flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-accent" />
              <span className="font-medium text-sm">Other Deductions (80E, 80U)</span>
            </div>
            {otherDeductionsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <GraduationCap className="w-4 h-4 text-blue-500 mt-6" />
                <InputField
                  label="80E - Education Loan Interest"
                  value={deductions.section80E}
                  onChange={(v) => updateField('section80E', v)}
                  tooltip="Interest on Education Loan from specified Institutions (no max limit, deduction for 8 years from the year of starting repayment)"
                  className="flex-1"
                />
              </div>
              <div className="flex items-start gap-2">
                <Accessibility className="w-4 h-4 text-orange-500 mt-6" />
                <InputField
                  label="80U - Disability Deduction"
                  value={deductions.section80U}
                  onChange={(v) => updateField('section80U', v)}
                  tooltip="Deduction for person with disability (₹75,000 normal, ₹1,25,000 severe disability)"
                  className="flex-1"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
