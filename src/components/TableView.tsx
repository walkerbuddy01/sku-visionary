
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { generateMockData, SKUData } from "@/lib/mockData";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TableViewProps {
  timeFrame: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  category: "salesTrends" | "financialGoals" | "manual";
  searchQuery: string;
}

const TableView = ({ timeFrame, category, searchQuery }: TableViewProps) => {
  const [data, setData] = useState<SKUData[]>([]);
  const [filteredData, setFilteredData] = useState<SKUData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate mock data based on time frame and category
    setIsLoading(true);
    // Simulate a loading delay
    setTimeout(() => {
      const mockData = generateMockData(30, timeFrame, category);
      setData(mockData);
      setIsLoading(false);
    }, 500);
  }, [timeFrame, category]);

  useEffect(() => {
    // Filter data based on search query
    const filtered = data.filter(item =>
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [data, searchQuery]);

  return (
    <Card className="shadow-sm overflow-hidden">
      <div className="p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">
          {category === "salesTrends" ? "Sales Trends" : 
           category === "financialGoals" ? "Financial Goals" : "Manual Data"} - {timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} View
        </h2>
        
        <div className="overflow-x-auto -mx-4 md:-mx-6">
          <div className="inline-block min-w-full align-middle p-4 md:p-6">
            <div className="overflow-hidden border border-gray-200 md:rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[100px] font-semibold">SKU</TableHead>
                    <TableHead className="font-semibold">Product Name</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="text-right font-semibold">Current Stock</TableHead>
                    <TableHead className="text-right font-semibold">Forecast Sales</TableHead>
                    <TableHead className="text-right font-semibold">Recommended Order</TableHead>
                    <TableHead className="text-right font-semibold">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Loading state
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={`loading-${index}`} className="animate-pulse">
                        {Array.from({ length: 7 }).map((_, cellIndex) => (
                          <TableCell key={`loading-cell-${cellIndex}`}>
                            <div className="h-4 bg-gray-200 rounded"></div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{item.sku}</TableCell>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.category}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{item.currentStock}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            {item.forecastSales > item.currentStock ? (
                              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            ) : item.forecastSales < item.currentStock ? (
                              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                            ) : (
                              <Minus className="w-4 h-4 text-gray-400 mr-1" />
                            )}
                            {item.forecastSales}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.recommendedOrder > 0 ? (
                            <span className="font-medium text-amber-600">{item.recommendedOrder}</span>
                          ) : (
                            <span className="text-gray-500">0</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">${item.revenue.toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                        {searchQuery ? "No matching SKUs found. Try a different search term." : "No data available for the selected criteria."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TableView;
