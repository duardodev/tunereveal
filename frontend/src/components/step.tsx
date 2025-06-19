interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  number: string;
}

export function Step({ icon, title, description, number }: StepProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-4 p-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">{icon}</div>
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
          {number}
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{description}</p>
      </div>
    </div>
  );
}
