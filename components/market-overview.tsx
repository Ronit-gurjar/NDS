import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

export function MarketOverview() {
  return (
    <Card className="bg-accent border-card">
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
        <CardDescription className="text-accent">Major indices</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">S&P 500</div>
            <div className="text-accent text-sm">US</div>
          </div>
          <div className="text-right">
            <div className="font-medium">4,587.64</div>
            <div className="flex items-center justify-end text-green-500 text-sm">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+1.23%</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">NASDAQ</div>
            <div className="text-accent text-sm">US</div>
          </div>
          <div className="text-right">
            <div className="font-medium">14,346.02</div>
            <div className="flex items-center justify-end text-green-500 text-sm">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+1.64%</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">DOW JONES</div>
            <div className="text-accent text-sm">US</div>
          </div>
          <div className="text-right">
            <div className="font-medium">36,124.23</div>
            <div className="flex items-center justify-end text-red-500 text-sm">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              <span>-0.42%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

