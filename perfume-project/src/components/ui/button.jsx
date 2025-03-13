import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  asChild = false,
  ...props 
}, ref) => {
  // Varyantlar için sınıflar
  const variantClasses = {
    default: "bg-blue-900 text-white hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100",
    destructive: "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
    outline: "border border-slate-200 bg-transparent text-slate-900 hover:bg-slate-100 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
    ghost: "bg-transparent text-slate-900 hover:bg-slate-100 dark:text-gray-100 dark:hover:bg-gray-800",
    link: "bg-transparent text-slate-900 underline-offset-4 hover:underline dark:text-gray-100",
  };

  // Boyutlar için sınıflar
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-6 text-base",
    icon: "h-9 w-9 p-0", // Icon butonu için
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none dark:focus-visible:ring-gray-400",
        variantClasses[variant] || variantClasses.default,
        sizeClasses[size] || sizeClasses.default,
        className
      )}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }