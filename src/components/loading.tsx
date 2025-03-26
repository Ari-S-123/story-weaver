import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

const loadingVariants = cva("flex flex-col items-center justify-center min-h-[120px] w-full gap-2", {
  variants: {
    variant: {
      default: "p-4",
      fullPage: "h-[calc(100vh-4rem)]",
      embedded: "p-2"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof loadingVariants> {
  text?: string;
  spinnerSize?: "sm" | "default" | "lg";
}

export function Loading({ className, variant, text, spinnerSize = "default", ...props }: LoadingProps) {
  return (
    <div className={cn(loadingVariants({ variant, className }))} {...props}>
      <Spinner size={spinnerSize} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

export { loadingVariants };
