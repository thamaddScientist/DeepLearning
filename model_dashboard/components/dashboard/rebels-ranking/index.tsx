import { Badge } from "@/components/ui/badge"
import DashboardCard from "@/components/dashboard/card"
import type { RebelRanking } from "@/types/dashboard"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface RebelsRankingProps {
  rebels: RebelRanking[]
}

const getModelSlug = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, "-")
}

export default function RebelsRanking({ rebels }: RebelsRankingProps) {
  return (
    <DashboardCard title="MODEL RANKINGS" intent="default" addon={<Badge variant="outline-warning">2 NEW</Badge>}>
      <div className="space-y-4">
        {rebels.map((rebel) => {
          const modelSlug = getModelSlug(rebel.name)
          return (
            <Link
              key={rebel.id}
              href={`/models/${modelSlug}/dashboard`}
              className="block hover:bg-accent/50 rounded-lg transition-colors"
            >
              <div className="flex items-center justify-between p-2 -m-2">
                <div className="flex items-center gap-1 w-full">
                  <div
                    className={cn(
                      "flex items-center justify-center rounded text-sm font-bold px-1.5 mr-1 md:mr-2",
                      rebel.featured
                        ? "h-10 bg-primary text-primary-foreground"
                        : "h-8 bg-secondary text-secondary-foreground",
                    )}
                  >
                    {rebel.id}
                  </div>
                  <div
                    className={cn(
                      "rounded-lg overflow-hidden bg-muted",
                      rebel.featured ? "size-14 md:size-16" : "size-10 md:size-12",
                    )}
                  >
                    {rebel.avatar ? (
                      <Image
                        src={rebel.avatar || "/placeholder.svg"}
                        alt={rebel.name}
                        width={120}
                        height={120}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "flex flex-1 h-full items-center justify-between py-2 px-2.5 rounded",
                      rebel.featured && "bg-accent",
                    )}
                  >
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span
                            className={cn(
                              "font-display",
                              rebel.featured ? "text-xl md:text-2xl" : "text-lg md:text-xl",
                            )}
                          >
                            {rebel.name}
                          </span>
                          <span className="text-muted-foreground text-xs md:text-sm">{rebel.handle}</span>
                        </div>
                        <Badge variant={rebel.featured ? "default" : "secondary"}>{rebel.points} POINTS</Badge>
                      </div>
                      {rebel.subtitle && <span className="text-sm text-muted-foreground italic">{rebel.subtitle}</span>}
                      {rebel.streak && !rebel.featured && (
                        <span className="text-sm text-muted-foreground italic">{rebel.streak}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </DashboardCard>
  )
}
