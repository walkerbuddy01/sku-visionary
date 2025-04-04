
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { generateMockData, aggregateDataForGraphs } from "@/lib/mockData";

interface GraphViewProps {
  timeFrame: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  category: "salesTrends" | "financialGoals" | "manual";
  searchQuery: string;
}

const GraphView = ({ timeFrame, category, searchQuery }: GraphViewProps) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Generate and aggregate data for charts
    const mockData = generateMockData(30, timeFrame, category);
    const filteredData = mockData.filter(item =>
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const aggregatedData = aggregateDataForGraphs(filteredData, timeFrame);
    setChartData(aggregatedData);
  }, [timeFrame, category, searchQuery]);

  const renderTimeFrameLabel = () => {
    switch (timeFrame) {
      case "daily":
        return "Daily Forecast";
      case "weekly":
        return "Weekly Forecast";
      case "monthly":
        return "Monthly Forecast";
      case "quarterly":
        return "Quarterly Forecast";
      case "yearly":
        return "Yearly Forecast";
      default:
        return "Forecast";
    }
  };

  const renderCategoryLabel = () => {
    switch (category) {
      case "salesTrends":
        return "Sales Trends";
      case "financialGoals":
        return "Financial Goals";
      case "manual":
        return "Manual Data";
      default:
        return "";
    }
  };

  return (
    <Card className="shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          {renderCategoryLabel()} - {renderTimeFrameLabel()}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sales and Revenue Bar Chart */}
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Sales vs Revenue</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sales" name="Sales Units" fill="#4F46E5" />
                  <Bar yAxisId="right" dataKey="revenue" name="Revenue ($)" fill="#818CF8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          {/* Stock Levels Line Chart */}
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Stock Levels Forecast</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="currentStock" name="Current Stock" stroke="#4F46E5" />
                  <Line type="monotone" dataKey="forecastStock" name="Forecasted Stock" stroke="#60A5FA" />
                  <Line type="monotone" dataKey="recommendedOrder" name="Recommended Order" stroke="#F87171" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          {/* Category Distribution */}
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Sales by Category</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData.slice(0, 5)} // Take only first 5 for visibility
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="categorySales" name="Sales by Category" fill="#6366F1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          {/* Forecast Accuracy */}
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Forecast Accuracy</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="actualSales" name="Actual Sales" stroke="#4F46E5" />
                  <Line type="monotone" dataKey="forecastSales" name="Forecast Sales" stroke="#F87171" />
                  <Line type="monotone" dataKey="accuracy" name="Accuracy (%)" stroke="#10B981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </Card>
  );
};

export default GraphView;
