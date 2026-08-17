interface RegisterStepsProps {
  steps: string[];
  current: number;
}

export default function RegisterSteps({ steps, current }: RegisterStepsProps) {
  return (
    <div className="flex items-start justify-center gap-3 mb-10">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum <= current;
        return (
          <div key={label} className="flex items-start gap-3">
            {i !== 0 && <div className={`w-14 h-0.5 mt-5 ${stepNum <= current ? "bg-primary" : "bg-gray-200"}`} />}
            <div className="flex flex-col items-center gap-2 w-20">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${isActive ? "bg-primary text-white" : "bg-gray-200 text-gray-400"}`}>
                {stepNum}
              </div>
              <span className="text-xs text-gray-500 text-center">{label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}