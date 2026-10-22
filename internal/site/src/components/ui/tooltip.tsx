import * as TooltipPrimitive from "@animate-ui/react/primitives/radix-ui/tooltip"
import type * as React from "react"

import { cn } from "@/lib/utils"

function TooltipProvider({ delayDuration = 50, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
	return <TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration} {...props} />
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
	return (
		<TooltipProvider>
			<TooltipPrimitive.Root data-slot="tooltip" {...props} />
		</TooltipProvider>
	)
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
	return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
	className,
	sideOffset = 0,
	children,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				data-slot="tooltip-content"
				sideOffset={sideOffset}
				className={cn(
					"bg-popover text-popover-foreground border z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-sm text-balance",
					className
				)}
				{...props}
			>
				{children}
				<TooltipPrimitive.Arrow
					className="bg-popover border z-50 fill-popover size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] will-change-transform"
					style={{ clipPath: "inset(25% 0 0 25%)" }}
				/>
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	)
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
