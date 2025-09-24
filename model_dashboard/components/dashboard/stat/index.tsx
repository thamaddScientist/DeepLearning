import type React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bullet } from "@/components/ui/bullet"
import { cn } from "@/lib/utils"

interface DashboardStatProps {
  label: string
  value: string
  description?: string
  tag?: string
  tag1?: string
  tag2?: string
  tag3?: string
  tag4?: string
  tag5?: string
  icon: React.ElementType
  intent?: "positive" | "negative" | "neutral"
  direction?: "up" | "down"
}

export default function DashboardStat({
  label,
  value,
  description,
  icon,
  tag,
  tag1,
  tag2,
  tag3,
  tag4,
  tag5,
  intent,
  direction,
}: DashboardStatProps) {
  const Icon = icon

  const getIntentClassName = () => {
    if (intent === "positive") return "text-success"
    if (intent === "negative") return "text-destructive"
    return "text-muted-foreground"
  }

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2.5">
          <Bullet />
          {label}
        </CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>

      <CardContent className="bg-accent flex-1 pt-2 md:pt-6 overflow-clip relative min-h-[120px] md:min-h-[140px]">
        <div className="flex items-start gap-3">
          <span className="text-4xl md:text-5xl font-display">{value}</span>

          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {tag && (
              <Badge variant="default" className="uppercase text-xs">
                {tag}
              </Badge>
            )}
            {tag1 && (
              <Badge variant="secondary" className="uppercase text-xs">
                {tag1}
              </Badge>
            )}
            {tag2 && (
              <Badge variant="outline" className="uppercase text-xs">
                {tag2}
              </Badge>
            )}
            {tag3 && (
              <Badge variant="default" className="uppercase text-xs bg-blue-500">
                {tag3}
              </Badge>
            )}
            {tag4 && (
              <Badge variant="default" className="uppercase text-xs bg-green-500">
                {tag4}
              </Badge>
            )}
            {tag5 && (
              <Badge variant="default" className="uppercase text-xs bg-purple-500">
                {tag5}
              </Badge>
            )}
          </div>
        </div>

        {description && (
          <div className="justify-between mt-2">
            <p className="text-xs md:text-sm font-medium text-muted-foreground tracking-wide">{description}</p>
          </div>
        )}

        {/* Marquee Animation */}
        {direction && (
          <div className="absolute top-0 right-0 w-14 h-full pointer-events-none overflow-hidden group">
            <div
              className={cn(
                "flex flex-col transition-all duration-500",
                "group-hover:scale-105 group-hover:brightness-110",
                getIntentClassName(),
                direction === "up" ? "animate-marquee-up" : "animate-marquee-down",
              )}
            >
              <div className={cn("flex", direction === "up" ? "flex-col-reverse" : "flex-col")}>
                {Array.from({ length: 6 }, (_, i) => (
                  <Arrow key={i} direction={direction} index={i} />
                ))}
              </div>
              <div className={cn("flex", direction === "up" ? "flex-col-reverse" : "flex-col")}>
                {Array.from({ length: 6 }, (_, i) => (
                  <Arrow key={i} direction={direction} index={i} />
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ArrowProps {
  direction: "up" | "down"
  index: number
}

const Arrow = ({ direction, index }: ArrowProps) => {
  const staggerDelay = index * 0.15 // Faster stagger
  const phaseDelay = (index % 3) * 0.8 // Different phase groups

  return (
    <span
      style={{
        animationDelay: `${staggerDelay + phaseDelay}s`,
        animationDuration: "3s",
        animationTimingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)",
      }}
      className={cn(
        "text-center text-5xl size-14 font-display leading-none block",
        "transition-all duration-700 ease-out",
        "animate-marquee-pulse",

        "will-change-transform",
      )}
    >
      {direction === "up" ? "↑" : "↓"}
    </span>
  )
}
