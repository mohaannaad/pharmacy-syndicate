interface RegisterStepsProps {
  steps: string[];
  current: number;
  onStepClick?: (step: number) => void;
}

export default function RegisterSteps({ steps, current, onStepClick }: RegisterStepsProps) {
  return (
    <div className="flex items-start justify-center gap-1 sm:gap-3 mb-10">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum <= current;
        const isClickable = stepNum < current && onStepClick;

        return (
          <div key={label} className="flex items-start gap-1 sm:gap-3">
            {i !== 0 && <div className={`w-4 sm:w-14 h-[3px] rounded mt-5 ${stepNum <= current ? "bg-primary" : "bg-line"}`} />}
            <div className="flex flex-col items-center gap-2 w-14 sm:w-20">
              <button type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick?.(stepNum)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-transform ${
                  stepNum === current ? "bg-primary text-white ring-4 ring-primary/15" : isActive ? "bg-primary text-white" : "bg-white border border-line text-ink-muted"
                } ${isClickable ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
              >
                {stepNum}
              </button>
              <span className={`text-[10px] sm:text-xs text-center ${stepNum === current ? "text-primary font-bold" : "text-ink-muted"}`}>{label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}