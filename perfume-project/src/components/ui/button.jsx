// components/ui/button.jsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  asChild = false,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 dark:focus-visible:ring-gray-400",
        className
      )}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }