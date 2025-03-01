import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

export function WatchlistTable() {
  const stocks = [
    { symbol: "AAPL", name: "Apple Inc.", price: 187.68, change: 1.24 },
    { symbol: "MSFT", name: "Microsoft Corp.", price: 378.92, change: 2.35 },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.56, change: 0.87 },
    { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.12, change: -0.54 },
    { symbol: "TSLA", name: "Tesla Inc.", price: 237.49, change: -1.23 },
  ]

  return (
    <Card className="bg-accent border-card">
      <CardHeader>
        <CardTitle>Watchlist</CardTitle>
        <CardDescription className="">Stocks you're tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-accent-foreground">
                <th className="text-left py-2 font-medium">Symbol</th>
                <th className="text-left py-2 font-medium">Name</th>
                <th className="text-right py-2 font-medium">Price</th>
                <th className="text-right py-2 font-medium">Change</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.symbol} className="border-b border-accent">
                  <td className="py-3 font-medium">{stock.symbol}</td>
                  <td className="py-3">{stock.name}</td>
                  <td className="py-3 text-right">${stock.price.toFixed(2)}</td>
                  <td className={`py-3 text-right ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    <div className="flex items-center justify-end">
                      {stock.change >= 0 ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      )}
                      {stock.change >= 0 ? "+" : ""}
                      {stock.change}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

