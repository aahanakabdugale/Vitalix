import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  title: string
  value: string | number
  change: string
  trend: "up" | "down" | "neutral"
  icon: React.ReactNode
  color?: "blue" | "green" | "red" | "amber"
}

const colorMap = {
  blue:  { bg: "bg-blue-50",  icon: "bg-blue-600",  text: "text-blue-600" },
  green: { bg: "bg-green-50", icon: "bg-green-600", text: "text-green-600" },
  red:   { bg: "bg-red-50",   icon: "bg-red-500",   text: "text-red-500" },
  amber: { bg: "bg-amber-50", icon: "bg-amber-500", text: "text-amber-600" },
}

export function StatsCard({ title, value, change, trend, icon, color = "blue" }: Props) {
  const c = colorMap[color]

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", c.icon)}>
          <span className="text-white w-5 h-5">{icon}</span>
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
          trend === "up"       && "bg-green-50 text-green-700",
          trend === "down"     && "bg-red-50 text-red-600",
          trend === "neutral" && "bg-gray-100 text-gray-500",
        )}>
          {trend === "up"       && <TrendingUp className="w-3 h-3" />}
          {trend === "down"     && <TrendingDown className="w-3 h-3" />}
          {trend === "neutral" && <Minus className="w-3 h-3" />}
          {change}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{title}</p>
      </div>
    </div>
  )
}