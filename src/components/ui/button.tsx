import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full bg-clip-padding text-sm font-black tracking-wide uppercase transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg]:transition-transform [&_svg]:duration-300",
  {
    variants: {
      variant: {
        default: "border-2 border-secondary bg-primary text-secondary hover:bg-[#aed83d] shadow-[3px_3px_0px_#1d2b1f] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#1d2b1f]",
        outline:
          "border-2 border-secondary bg-[#f7f0e6] text-secondary hover:bg-[#ebdcc5] shadow-[3px_3px_0px_#1d2b1f] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#1d2b1f]",
        secondary:
          "border-2 border-secondary bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),#000_10%)] shadow-[3px_3px_0px_#bfea4b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#bfea4b]",
        ghost:
          "border border-transparent hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "border-2 border-secondary bg-destructive text-white shadow-[3px_3px_0px_#1d2b1f] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#1d2b1f]",
        link: "text-primary underline-offset-4 hover:underline font-medium normal-case",
      },
      size: {
        default:
          "h-10 gap-1.5 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-7 gap-1 px-3 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 px-3.5 text-xs has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-1.5 px-6 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        xl: "h-14 gap-2.5 px-8 text-[15px] font-black tracking-wide [&_svg:not([class*='size-'])]:size-5 shadow-[4px_4px_0px_#1d2b1f] hover:shadow-[2px_2px_0px_#1d2b1f] hover:translate-x-[2px] hover:translate-y-[2px]",
        icon: "size-10",
        "icon-xs":
          "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
