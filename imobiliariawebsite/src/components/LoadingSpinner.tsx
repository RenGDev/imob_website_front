// components/LoadingSpinner.tsx
import { cn } from "@/lib/utils";

export default function LoadingSpinner({
  size = "md",
  text = "",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-solid border-purple-500 border-t-transparent",
          sizeClasses[size]
        )}
        aria-label="Carregando"
        role="status"
      />
      {text && (
        <span className={cn("text-purple-600 font-medium", textSizeClasses[size])}>
          {text}
        </span>
      )}
    </div>
  );
}