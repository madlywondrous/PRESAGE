import type React from "react"
import { cn } from "@/lib/utils"

interface CodeProps extends React.HTMLAttributes<HTMLPreElement> {
  children: React.ReactNode
}

export function Code({ className, children, ...props }: CodeProps) {
  return (
    <pre className={cn("rounded-md bg-muted p-4 overflow-x-auto text-sm text-muted-foreground", className)} {...props}>
      <code className="font-mono">{children}</code>
    </pre>
  )
}

