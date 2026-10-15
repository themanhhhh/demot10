import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, Ref } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "button focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "button-primary",
        outline: "button-outline",
        dark: "button-dark",
      },
      size: {
        default: "",
        small: "button-small",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type ButtonProps = ComponentPropsWithoutRef<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { asChild = false, className, size, variant, ...props },
  ref,
) {
  const classes = cn(buttonVariants({ className, size, variant }));

  if (asChild) {
    return <Slot ref={ref as Ref<HTMLElement>} className={classes} {...props} />;
  }

  return <button ref={ref} className={classes} {...props} />;
});

export { buttonVariants };
