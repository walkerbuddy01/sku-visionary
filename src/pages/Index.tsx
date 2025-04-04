
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import TableView from "@/components/TableView";
import GraphView from "@/components/GraphView";
import Sidebar from "@/components/Sidebar";

const Index = () => {
  const [viewMode, setViewMode] = useState<"table" | "graph">("table");
  const [timeFrame, setTimeFrame] = useState<"daily" | "weekly" | "monthly" | "quarterly" | "yearly">("monthly");
  const [activeTab, setActiveTab] = useState<"salesTrends" | "financialGoals" | "manual">("salesTrends");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Forecasting - Inventory</h1>
            <p className="text-gray-500 mt-2">
              Track and analyze your inventory SKU performance
            </p>
          </header>

          {/* Search and View Toggle */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative md:w-1/2">
              <Input
                placeholder="SKU Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={viewMode === "table" ? "default" : "outline"}
                className={viewMode === "table" ? "bg-indigo-700 hover:bg-indigo-800" : ""}
                onClick={() => setViewMode("table")}
              >
                Table View
              </Button>
              <Button 
                variant={viewMode === "graph" ? "default" : "outline"}
                className={viewMode === "graph" ? "bg-indigo-700 hover:bg-indigo-800" : ""}
                onClick={() => setViewMode("graph")}
              >
                Graph View
              </Button>
            </div>
          </div>

          {/* Data Category Tabs */}
          <div className="mb-6">
            <Tabs defaultValue="salesTrends" className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger 
                  value="salesTrends" 
                  className="py-3 data-[state=active]:bg-indigo-700 data-[state=active]:text-white"
                  onClick={() => setActiveTab("salesTrends")}
                >
                  Sales Trends
                </TabsTrigger>
                <TabsTrigger 
                  value="financialGoals" 
                  className="py-3 data-[state=active]:bg-indigo-700 data-[state=active]:text-white"
                  onClick={() => setActiveTab("financialGoals")}
                >
                  Financial Goals
                </TabsTrigger>
                <TabsTrigger 
                  value="manual" 
                  className="py-3 data-[state=active]:bg-indigo-700 data-[state=active]:text-white"
                  onClick={() => setActiveTab("manual")}
                >
                  Manual
                </TabsTrigger>
              </TabsList>

              <TabsContent value="salesTrends">
                {viewMode === "table" ? (
                  <TableView timeFrame={timeFrame} category="salesTrends" searchQuery={searchQuery} />
                ) : (
                  <GraphView timeFrame={timeFrame} category="salesTrends" searchQuery={searchQuery} />
                )}
              </TabsContent>
              
              <TabsContent value="financialGoals">
                {viewMode === "table" ? (
                  <TableView timeFrame={timeFrame} category="financialGoals" searchQuery={searchQuery} />
                ) : (
                  <GraphView timeFrame={timeFrame} category="financialGoals" searchQuery={searchQuery} />
                )}
              </TabsContent>
              
              <TabsContent value="manual">
                {viewMode === "table" ? (
                  <TableView timeFrame={timeFrame} category="manual" searchQuery={searchQuery} />
                ) : (
                  <GraphView timeFrame={timeFrame} category="manual" searchQuery={searchQuery} />
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Time Frame Selector */}
          <div className="flex flex-wrap gap-2 mt-10">
            <Button
              variant={timeFrame === "daily" ? "default" : "outline"}
              className={timeFrame === "daily" ? "bg-indigo-700 hover:bg-indigo-800" : ""}
              onClick={() => setTimeFrame("daily")}
            >
              Daily View
            </Button>
            <Button
              variant={timeFrame === "weekly" ? "default" : "outline"}
              className={timeFrame === "weekly" ? "bg-indigo-700 hover:bg-indigo-800" : ""}
              onClick={() => setTimeFrame("weekly")}
            >
              Weekly View
            </Button>
            <Button
              variant={timeFrame === "monthly" ? "default" : "outline"}
              className={timeFrame === "monthly" ? "bg-indigo-700 hover:bg-indigo-800" : ""}
              onClick={() => setTimeFrame("monthly")}
            >
              Monthly View
            </Button>
            <Button
              variant={timeFrame === "quarterly" ? "default" : "outline"}
              className={timeFrame === "quarterly" ? "bg-indigo-700 hover:bg-indigo-800" : ""}
              onClick={() => setTimeFrame("quarterly")}
            >
              Quarterly View
            </Button>
            <Button
              variant={timeFrame === "yearly" ? "default" : "outline"}
              className={timeFrame === "yearly" ? "bg-indigo-700 hover:bg-indigo-800" : ""}
              onClick={() => setTimeFrame("yearly")}
            >
              Yearly View
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
