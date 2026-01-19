import React from 'react';
import { ClipboardCheck, AlertTriangle, FileText, Calendar, Building2, Receipt, Globe } from 'lucide-react';

export const Compliances: React.FC = () => {
  const compliances = [
    {
      icon: <Building2 className="w-5 h-5" />,
      title: "TDS on Rent u/s 194-IB",
      description: "If you pay rent exceeding ₹50,000 per month, you must deduct TDS at 2% and deposit it with the government using Form 26QC. If your landlord is an NRI, TDS must be deducted under Section 195 at 31.2% without any threshold limit.",
      severity: "warning" as const,
    },
    {
      icon: <Receipt className="w-5 h-5" />,
      title: "Maintain Document Proofs",
      description: "Collect Form 16 & salary slips from employer, maintain investment proofs for 80C/80D/NPS deductions, keep rent agreement & rent receipts for HRA/80GG exemption, and preserve all documents for at least 6 years from the end of the relevant assessment year.",
      severity: "info" as const,
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Form 12BB Submission",
      description: "Submit Form 12BB to your employer with details of deductions and exemptions claimed to ensure correct TDS deduction from salary.",
      severity: "info" as const,
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "Advance Tax Payment",
      description: "If your total tax liability after TDS exceeds ₹10,000, pay advance tax in quarterly installments (15th Jun, Sep, Dec, Mar) to avoid interest u/s 234B & 234C.",
      severity: "warning" as const,
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Regime Selection Deadline",
      description: "Salaried individuals must inform their employer about regime choice at the start of the financial year. Final selection can be changed while filing ITR.",
      severity: "info" as const,
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "ITR Filing Due Date",
      description: "File your Income Tax Return by 31st July of the assessment year. Late filing attracts penalty u/s 234F (up to ₹5,000) and interest u/s 234A.",
      severity: "warning" as const,
    },
  ];

  return (
    <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-orange-100">
          <ClipboardCheck className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h2 className="section-title mb-0">Compliances to Keep in Mind</h2>
          <p className="text-xs text-muted-foreground mt-1">Important tax compliance requirements for salaried individuals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {compliances.map((compliance, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border transition-colors ${
              compliance.severity === 'warning' 
                ? 'border-orange-200 bg-orange-50 hover:bg-orange-100' 
                : 'border-blue-200 bg-blue-50 hover:bg-blue-100'
            }`}
          >
            <div className="flex gap-3">
              <div className={`p-2 rounded-lg h-fit ${
                compliance.severity === 'warning' 
                  ? 'bg-orange-200 text-orange-700' 
                  : 'bg-blue-200 text-blue-700'
              }`}>
                {compliance.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">{compliance.title}</h4>
                <p className="text-sm text-muted-foreground">{compliance.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Important Note */}
      <div className="mt-6 p-4 rounded-lg bg-amber-50 border border-amber-200">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800 mb-1">Important Note</h4>
            <p className="text-sm text-amber-700">
              Non-compliance with tax provisions may result in penalties, interest, and prosecution under the Income Tax Act, 1961. 
              Ensure timely compliance to avoid legal consequences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};