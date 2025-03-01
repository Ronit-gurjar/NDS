import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function RecentTransactions() {
  const transactions = [
    { id: 1, type: "Buy", symbol: "AAPL", shares: 5, price: 187.68, date: "2023-03-01" },
    { id: 2, type: "Sell", symbol: "MSFT", shares: 2, price: 378.92, date: "2023-02-28" },
    { id: 3, type: "Buy", symbol: "GOOGL", shares: 3, price: 142.56, date: "2023-02-27" },
    { id: 4, type: "Buy", symbol: "TSLA", shares: 1, price: 237.49, date: "2023-02-25" },
    { id: 5, type: "Sell", symbol: "AMZN", shares: 4, price: 178.12, date: "2023-02-24" },
  ]

  return (
    <Card className="bg-accent border-card">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your trading activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex justify-between items-center border-b border-zinc-700 pb-3">
              <div>
                <div className="font-medium flex items-center">
                  <span className={transaction.type === "Buy" ? "text-green-500" : "text-red-500"}>
                    {transaction.type}
                  </span>
                  <span className="mx-1">•</span>
                  <span>{transaction.symbol}</span>
                </div>
                <div className="text-accent-foreground/50 text-sm">{transaction.date}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {transaction.shares} {transaction.shares === 1 ? "share" : "shares"} @ ${transaction.price.toFixed(2)}
                </div>
                <div className="text-accent-foreground/50 text-sm">${(transaction.shares * transaction.price).toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

