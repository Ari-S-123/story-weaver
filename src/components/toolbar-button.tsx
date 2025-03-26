import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ToolbarButtonProps = {
  onClick?: () => void;
  isActive?: boolean;
  icon: LucideIcon;
  label?: string;
  variant?: "default" | "destructive";
};

export default function ToolbarButton({
  onClick,
  isActive,
  icon: Icon,
  variant = "default",
  label
}: ToolbarButtonProps) {
  return (
    <button
      title={label}
      onClick={onClick}
      className={cn(
        "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm",
        variant === "default" && "hover:bg-neutral-400/80",
        variant === "destructive" && "hover:bg-red-500/80 text-red-500 hover:text-white",
        isActive && "bg-neutral-400/80"
      )}
    >
      <Icon className="size-4" />
    </button>
  );
}
