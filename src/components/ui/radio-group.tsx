import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function RadioGroup({ className, ...props }: ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root className={cn("radix-radio-group", className)} {...props} />;
}

export function RadioGroupItem({ className, children, ...props }: ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item className={cn("radio-option", className)} {...props}>
      <span className="radio-marker" aria-hidden="true">
        <RadioGroupPrimitive.Indicator className="radix-radio-indicator" />
      </span>
      <span>{children}</span>
    </RadioGroupPrimitive.Item>
  );
}
