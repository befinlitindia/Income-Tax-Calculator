import React from 'react';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuggestionsToggleProps {
  showSuggestions: boolean;
  onToggle: () => void;
}

export const SuggestionsToggle: React.FC<SuggestionsToggleProps> = ({ showSuggestions, onToggle }) => {
  return (
    <div className="card-elevated p-4 sm:p-6 animate-slide-up" style={{ animationDelay: '0.25s' }}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-sm sm:text-base text-foreground">
              Do you want basic tax saving suggestions?
            </h2>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
              Get personalized recommendations based on your income and deductions
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={showSuggestions ? "default" : "outline"}
            size="sm"
            onClick={() => !showSuggestions && onToggle()}
            className="gap-1.5"
          >
            Yes
            {showSuggestions && <ChevronDown className="w-4 h-4" />}
          </Button>
          <Button
            variant={!showSuggestions ? "secondary" : "outline"}
            size="sm"
            onClick={() => showSuggestions && onToggle()}
            className="gap-1.5"
          >
            No
            {!showSuggestions && <ChevronUp className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
