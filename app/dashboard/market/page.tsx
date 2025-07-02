// app/dashboard/market/page.tsx
import IndicesTable from "@/components/indices-table";
import WeeklyTradeTable from "@/components/weekly-trade-table"; // For managing weekly trades
import TodayBestTradeTable from "@/components/today-best-trade-table"; // For managing today's best trade

export default async function DashboardMarketPage() {
    return(
        <div className="flex flex-col justify-center items-center gap-8">
            {/* Component for managing Today's Best Trade */}
            <TodayBestTradeTable />
            
            {/* Component for managing Weekly Trades */}
            <WeeklyTradeTable /> 
            
            {/* Your existing Indices Table */}
            <IndicesTable />
        </div>
    );
}