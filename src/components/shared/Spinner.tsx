import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";
import { HTMLAttributes } from "react";

/**
 * Defines the props for the Spinner component.
 * It extends HTMLAttributes<HTMLDivElement> to allow passing standard div props,
 * but specifically focuses on the className for Tailwind customization.
 */
interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Optional Tailwind CSS class to customize size, color, spin speed, etc.
   * Example: "h-8 w-8 text-blue-500"
   */
  className?: string;
}

/**
 * A professional loading spinner component for shadcn/ui based projects.
 * It uses the RefreshCw icon from lucide-react and the animate-spin utility class.
 *
 * @param {SpinnerProps} props - Component props, including optional className.
 * @returns {JSX.Element} The rendered spinner icon.
 */
export default function Spinner({ className }: SpinnerProps): JSX.Element {
  return (
    <RefreshCw
      // Use cn to safely merge custom classNames with the default style
      className={cn("h-4 w-4 animate-spin text-primary", className)}
      aria-label="Loading indicator"
    />
  );
}
