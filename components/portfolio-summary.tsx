import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight } from "lucide-react"

export function PortfolioSummary() {
  return (
    <Card className="bg-accent border-card w-full">
      <CardHeader>
        <CardTitle>Portfolio Value</CardTitle>
        <CardDescription className="text-zinc-400">Total assets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">$17,245.65</div>
        <div className="flex items-center mt-2 text-green-500">
          <ArrowUpRight className="h-4 w-4 mr-1" />
          <span className="font-medium">+2.45%</span>
          <span className="text-accent text-sm ml-2">Today</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-zinc-400 text-sm">Invested</p>
            <p className="font-medium">$15,000.00</p>
          </div>
          <div>
            <p className="text-zinc-400 text-sm">Profit/Loss</p>
            <p className="font-medium text-green-500">+$2,245.65</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

