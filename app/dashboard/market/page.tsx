import IndicesTable from "@/components/indices-table";
import WeeklyTradeTable from "@/components/weekly-trade-table";

export default async function Page() {
    return(
        <div className="flex flex-col justify-center items-center gap-8">
        <WeeklyTradeTable />
        <IndicesTable />
        </div>
    );
}