import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Adds a 4px left border stripe (for table rows needing attention) */
  accentColor?: "yellow" | "red" | "maroon";
}

const ACCENT_COLORS = {
  yellow: "border-r-gym-yellow",
  red: "border-r-gym-red",
  maroon: "border-r-gym-maroon",
};

export function Card({ className, accentColor, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-gym-surface rounded-2xl border border-gym-border",
        "shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)]",
        "transition-shadow duration-200",
        accentColor && ["border-r-4", ACCENT_COLORS[accentColor]],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-5 py-4 border-b border-gym-border flex items-center justify-between gap-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-base font-bold text-gym-black font-cairo leading-tight", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-5 py-3 border-t border-gym-border flex items-center justify-end gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/** Stat card with big number, label, optional financial indicator line */
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  financialType?: "income" | "expense";
  className?: string;
}

export function StatCard({ label, value, icon, financialType, className }: StatCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      {financialType && (
        <div
          className={cn(
            "absolute bottom-0 right-0 left-0 h-1 rounded-b-2xl",
            financialType === "income" ? "bg-gym-yellow" : "bg-gym-red"
          )}
        />
      )}
      <div className="p-5 pb-6">
        <div className="flex items-start justify-between mb-3">
          <p className="text-sm text-gym-text-secondary font-medium">{label}</p>
          {icon && (
            <span className="text-gym-text-secondary opacity-60">{icon}</span>
          )}
        </div>
        <p className="text-3xl font-bold text-gym-black font-cairo tracking-tight">
          {value}
        </p>
      </div>
    </Card>
  );
}
