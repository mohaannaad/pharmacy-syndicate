interface RegisterStepsProps {
  steps: string[];
  current: number;
  onStepClick?: (step: number) => void;
}

export default function RegisterSteps({ steps, current, onStepClick }: RegisterStepsProps) {
  return (
    <div className="flex items-start justify-center gap-3 mb-10">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum <= current;
        const isClickable = stepNum < current && onStepClick;

        return (
          <div key={label} className="flex items-start gap-3">
            {i !== 0 && <div className={`w-14 h-0.5 mt-5 ${stepNum <= current ? "bg-primary" : "bg-gray-200"}`} />}
            <div className="flex flex-col items-center gap-2 w-20">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick?.(stepNum)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-transform ${
                  isActive ? "bg-primary text-white" : "bg-gray-200 text-gray-400"
                } ${isClickable ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
              >
                {stepNum}
              </button>
              <span className="text-xs text-gray-500 text-center">{label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}