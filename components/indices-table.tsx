"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const NSE_API_URL = "https://marketapi.intoday.in/widget/indices/view?exchange=nse";
const BSE_API_URL = "https://marketapi.intoday.in/widget/indices/view?exchange=bse";
const REFRESH_INTERVAL = 5000; // Fetch new data every 5 seconds

export default function MarketIndices() {
  const [nseIndices, setNseIndices] = useState<any[]>([]);
  const [bseIndices, setBseIndices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketData = async () => {
    try {
      const [nseResponse, bseResponse] = await Promise.all([fetch(NSE_API_URL), fetch(BSE_API_URL)]);

      if (!nseResponse.ok || !bseResponse.ok) {
        throw new Error("Failed to fetch market data");
      }

      const [nseData, bseData] = await Promise.all([nseResponse.json(), bseResponse.json()]);

      if (nseData?.success && Array.isArray(nseData.data)) {
        setNseIndices(nseData.data);
      } else {
        console.error("Unexpected NSE API response:", nseData);
        setError("Invalid NSE data format");
      }

      if (bseData?.success && Array.isArray(bseData.data)) {
        setBseIndices(bseData.data);
      } else {
        console.error("Unexpected BSE API response:", bseData);
        setError("Invalid BSE data format");
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Market Indices (Live Updates)</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="overflow-x-auto">
        {loading ? (
          <p className="text-center text-muted-foreground">Loading market data...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : (
          <Tabs defaultValue="nse">
            <TabsList className="flex justify-center mb-4">
              <TabsTrigger value="nse">NSE</TabsTrigger>
              <TabsTrigger value="bse">BSE</TabsTrigger>
            </TabsList>

            {/* NSE Data */}
            <TabsContent value="nse">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>% Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nseIndices.map((index) => (
                    <TableRow key={index.indexcode} className="hover:bg-accent">
                      <TableCell className="font-medium">{index.aliasname}</TableCell>
                      <TableCell>{index.last}</TableCell>
                      <TableCell
                        className={`font-medium ${
                          index.pricediff < 0 ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {index.pricediff}
                      </TableCell>
                      <TableCell
                        className={`font-medium ${
                          index.pricediff < 0 ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {parseFloat(index.change_dump).toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            {/* BSE Data */}
            <TabsContent value="bse">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>% Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bseIndices.map((index) => (
                    <TableRow key={index.indexcode} className="hover:bg-accent">
                      <TableCell className="font-medium">{index.aliasname}</TableCell>
                      <TableCell>{index.last}</TableCell>
                      <TableCell
                        className={`font-medium ${
                          index.pricediff < 0 ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {index.pricediff}
                      </TableCell>
                      <TableCell
                        className={`font-medium ${
                          index.pricediff < 0 ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {parseFloat(index.change_dump).toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
