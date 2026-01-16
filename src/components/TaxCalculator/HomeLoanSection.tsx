import React, { useState } from 'react';
import { HomeLoanInterest } from './types';
import { InputField } from './InputField';
import { Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface HomeLoanSectionProps {
  homeLoanInterest: HomeLoanInterest;
  onChange: (homeLoanInterest: HomeLoanInterest) => void;
}

export const HomeLoanSection: React.FC<HomeLoanSectionProps> = ({ homeLoanInterest, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateField = (field: keyof HomeLoanInterest, value: number | boolean) => {
    onChange({ ...homeLoanInterest, [field]: value });
  };

  return (
    <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-500/10">
          <Building2 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="section-title mb-0">Section 24(b) - Home Loan Interest</h2>
          <p className="text-xs text-muted-foreground mt-1">Deduction for Interest on Housing Loan</p>
        </div>
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-sm">Home Loan Interest Details</span>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Home Loan Interest Paid (Annual)"
                value={homeLoanInterest.interestPaid}
                onChange={(v) => updateField('interestPaid', v)}
                tooltip="Total interest paid on home loan during the financial year"
              />
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Property Type</Label>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <span className={`text-sm ${!homeLoanInterest.isSelfOccupied ? 'font-medium' : 'text-muted-foreground'}`}>
                    Let Out
                  </span>
                  <Switch
                    checked={homeLoanInterest.isSelfOccupied}
                    onCheckedChange={(checked) => updateField('isSelfOccupied', checked)}
                  />
                  <span className={`text-sm ${homeLoanInterest.isSelfOccupied ? 'font-medium' : 'text-muted-foreground'}`}>
                    Self Occupied
                  </span>
                </div>
              </div>
            </div>
            
            {/* Info Box */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Deduction Limits:</strong>
              </p>
              <ul className="text-xs text-blue-600 mt-2 space-y-1">
                <li>• <strong>Self Occupied (Old Regime):</strong> Max ₹2,00,000</li>
                <li>• <strong>Let Out (Old Regime):</strong> No limit (actual interest paid)</li>
                <li>• <strong>New Regime:</strong> Only for Let Out property (set off against rental income)</li>
              </ul>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
