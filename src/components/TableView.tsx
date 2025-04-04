
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

interface TableViewProps {
  timeFrame: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  category: "salesTrends" | "financialGoals" | "manual";
  searchQuery: string;
}

const TableView = ({ timeFrame, category, searchQuery }: TableViewProps) => {
  const [data, setData] = useState<SKUData[]>([]);
  const [filteredData, setFilteredData] = useState<SKUData[]>([]);

  useEffect(() => {
    // Generate mock data based on time frame and category
    const mockData = generateMockData(30, timeFrame, category);
    setData(mockData);
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
    <Card className="shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          {category === "salesTrends" ? "Sales Trends" : 
           category === "financialGoals" ? "Financial Goals" : "Manual Data"} - {timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} View
        </h2>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">SKU</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Current Stock</TableHead>
                <TableHead className="text-right">Forecast Sales</TableHead>
                <TableHead className="text-right">Recommended Order</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.sku}</TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right">{item.currentStock}</TableCell>
                    <TableCell className="text-right">{item.forecastSales}</TableCell>
                    <TableCell className="text-right">{item.recommendedOrder}</TableCell>
                    <TableCell className="text-right">${item.revenue.toLocaleString()}</TableCell>
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
    </Card>
  );
};

export default TableView;
