interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="mb-8 w-full">
      <div className="mb-2 flex justify-between">
        <span className="text-sm font-medium text-primary/70 retro-terminal">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-primary/70 retro-terminal">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-black border border-primary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  )
}

