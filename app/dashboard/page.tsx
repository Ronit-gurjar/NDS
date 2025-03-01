import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StockChart } from "@/components/stock-chart";
import { MarketOverview } from "@/components/market-overview";
import { PortfolioSummary } from "@/components/portfolio-summary";
import { RecentTransactions } from "@/components/recent-transactions";
import { WatchlistTable } from "@/components/watchlist-table";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Page() {
    const {getUser} = getKindeServerSession();
    const user = await getUser();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl">Welcome, <span className="font-semibold">{user.given_name}</span></h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PortfolioSummary />
        <MarketOverview />
        <Card className="bg-accent border-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription className="text-accent-foreground/50">Manage your portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md">Buy Stocks</button>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md">Sell Stocks</button>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">Deposit Funds</button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-accent border-card">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription className="text-zinc-400">Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <StockChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WatchlistTable />
        <RecentTransactions />
      </div>
    </div>
  );
}
