import IndicesTable from "@/components/indices-table";
import LiveMarketTicker from "@/components/live-market-ticker";

export default async function Page() {
    return(
        <div>
        {/* <LiveMarketTicker/> */}
        <IndicesTable />
        </div>
    );
}