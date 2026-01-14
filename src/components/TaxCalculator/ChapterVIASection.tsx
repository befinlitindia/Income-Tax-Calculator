import React, { useState } from 'react';
import { ChapterVIADeductions } from './types';
import { InputField } from './InputField';
import { PiggyBank, ChevronDown, ChevronUp, Landmark, Heart, GraduationCap, HandHeart, Home, Coins, Accessibility } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

interface ChapterVIASectionProps {
  deductions: ChapterVIADeductions;
  onChange: (deductions: ChapterVIADeductions) => void;
}

export const ChapterVIASection: React.FC<ChapterVIASectionProps> = ({ deductions, onChange }) => {
  const [section80COpen, setSection80COpen] = useState(true);
  const [section80CCDOpen, setSection80CCDOpen] = useState(false);
  const [section80DOpen, setSection80DOpen] = useState(false);
  const [otherDeductionsOpen, setOtherDeductionsOpen] = useState(false);

  const updateField = (field: keyof ChapterVIADeductions, value: number) => {
    onChange({ ...deductions, [field]: value });
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
              <span className="font-medium text-sm">Section 80C (Max ₹1.5L)</span>
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

        {/* Section 80CCD - NPS */}
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
            <div className="grid grid-cols-1 gap-4">
              <InputField
                label="80CCD(1) - Employee NPS Contribution"
                value={deductions.section80CCD1}
                onChange={(v) => updateField('section80CCD1', v)}
                tooltip="Employee's contribution to NPS (part of 80C limit)"
              />
              <InputField
                label="80CCD(1B) - Additional NPS (Max ₹50,000)"
                value={deductions.section80CCD1B}
                onChange={(v) => updateField('section80CCD1B', v)}
                tooltip="Additional NPS contribution over 80C limit (Max: ₹50,000)"
              />
              <div className="relative">
                <InputField
                  label="80CCD(2) - Employer NPS Contribution"
                  value={deductions.section80CCD2}
                  onChange={(v) => updateField('section80CCD2', v)}
                  tooltip="Employer's contribution to NPS (up to 14% of salary for govt, 10% for others) - Available in BOTH regimes"
                />
                <Badge className="absolute top-0 right-0 bg-emerald-500 text-white text-xs">
                  Both Regimes
                </Badge>
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
                label="Self & Family Premium (Max ₹25K/₹50K)"
                value={deductions.section80D_self}
                onChange={(v) => updateField('section80D_self', v)}
                tooltip="Health insurance premium for self, spouse & children (₹25K normal, ₹50K if senior citizen)"
              />
              <InputField
                label="Parents Premium (Max ₹25K/₹50K)"
                value={deductions.section80D_parents}
                onChange={(v) => updateField('section80D_parents', v)}
                tooltip="Health insurance premium for parents (₹25K normal, ₹50K if senior citizen)"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Other Deductions */}
        <Collapsible open={otherDeductionsOpen} onOpenChange={setOtherDeductionsOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
            <div className="flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-accent" />
              <span className="font-medium text-sm">Other Deductions (80E, 80G, 80GG, 80TTA, 80U)</span>
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
                  tooltip="Interest on education loan (no max limit, deduction for 8 years)"
                  className="flex-1"
                />
              </div>
              <div className="flex items-start gap-2">
                <HandHeart className="w-4 h-4 text-purple-500 mt-6" />
                <InputField
                  label="80G - Charitable Donations"
                  value={deductions.section80G}
                  onChange={(v) => updateField('section80G', v)}
                  tooltip="Donations to eligible charitable institutions (50%/100% deduction)"
                  className="flex-1"
                />
              </div>
              <div className="flex items-start gap-2">
                <Home className="w-4 h-4 text-cyan-500 mt-6" />
                <InputField
                  label="80GG - Rent Paid (No HRA)"
                  value={deductions.section80GG}
                  onChange={(v) => updateField('section80GG', v)}
                  tooltip="For those not receiving HRA (Max ₹60,000 per year)"
                  className="flex-1"
                />
              </div>
              <div className="flex items-start gap-2">
                <Coins className="w-4 h-4 text-green-500 mt-6" />
                <InputField
                  label="80TTA/80TTB - Savings Interest"
                  value={deductions.section80TTA}
                  onChange={(v) => updateField('section80TTA', v)}
                  tooltip="Interest from savings account (80TTA: Max ₹10K, 80TTB for seniors: Max ₹50K)"
                  className="flex-1"
                />
              </div>
              <div className="flex items-start gap-2">
                <Accessibility className="w-4 h-4 text-orange-500 mt-6" />
                <InputField
                  label="80U - Disability Deduction"
                  value={deductions.section80U}
                  onChange={(v) => updateField('section80U', v)}
                  tooltip="Deduction for person with disability (₹75K normal, ₹1.25L severe)"
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
