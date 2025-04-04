
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, LayoutGrid, BarChart, Plus } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import TableView from "@/components/TableView";
import GraphView from "@/components/GraphView";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [viewMode, setViewMode] = useState<"table" | "graph">("table");
  const [timeFrame, setTimeFrame] = useState<"daily" | "weekly" | "monthly" | "quarterly" | "yearly">("monthly");
  const [activeTab, setActiveTab] = useState<"salesTrends" | "financialGoals" | "manual">("salesTrends");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDataOpen, setIsAddDataOpen] = useState(false);

  const timeFrameOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly", label: "Yearly" },
  ] as const;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 md:ml-64 p-4 md:p-6 pt-16 md:pt-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Forecasting - Inventory</h1>
              <p className="text-gray-500 mt-2">
                Track and analyze your inventory SKU performance
              </p>
            </div>
            <Button 
              onClick={() => setIsAddDataOpen(true)} 
              className="bg-indigo-700 hover:bg-indigo-800 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Data
            </Button>
          </header>

          {/* Dashboard Cards */}
          <div className="mb-8">
            <Dashboard />
          </div>

          {/* Search and View Toggle */}
          <Card className="p-4 mb-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative w-full md:w-1/2">
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
                  className={`flex-1 md:flex-none gap-2 ${viewMode === "table" ? "bg-indigo-700 hover:bg-indigo-800" : ""}`}
                  onClick={() => setViewMode("table")}
                >
                  <LayoutGrid size={18} />
                  <span className="hidden md:inline">Table View</span>
                </Button>
                <Button 
                  variant={viewMode === "graph" ? "default" : "outline"}
                  className={`flex-1 md:flex-none gap-2 ${viewMode === "graph" ? "bg-indigo-700 hover:bg-indigo-800" : ""}`}
                  onClick={() => setViewMode("graph")}
                >
                  <BarChart size={18} />
                  <span className="hidden md:inline">Graph View</span>
                </Button>
              </div>
            </div>
          </Card>

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
                  <TableView timeFrame={timeFrame} category="salesTrends" searchQuery={searchQuery} isAddDataOpen={isAddDataOpen} setIsAddDataOpen={setIsAddDataOpen} />
                ) : (
                  <GraphView timeFrame={timeFrame} category="salesTrends" searchQuery={searchQuery} />
                )}
              </TabsContent>
              
              <TabsContent value="financialGoals">
                {viewMode === "table" ? (
                  <TableView timeFrame={timeFrame} category="financialGoals" searchQuery={searchQuery} isAddDataOpen={isAddDataOpen} setIsAddDataOpen={setIsAddDataOpen} />
                ) : (
                  <GraphView timeFrame={timeFrame} category="financialGoals" searchQuery={searchQuery} />
                )}
              </TabsContent>
              
              <TabsContent value="manual">
                {viewMode === "table" ? (
                  <TableView timeFrame={timeFrame} category="manual" searchQuery={searchQuery} isAddDataOpen={isAddDataOpen} setIsAddDataOpen={setIsAddDataOpen} />
                ) : (
                  <GraphView timeFrame={timeFrame} category="manual" searchQuery={searchQuery} />
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Time Frame Selector */}
          <Card className="p-4 mt-6">
            <div className="flex flex-wrap gap-2">
              {timeFrameOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={timeFrame === option.value ? "default" : "outline"}
                  className={`flex-1 md:flex-none ${timeFrame === option.value ? "bg-indigo-700 hover:bg-indigo-800" : ""}`}
                  onClick={() => setTimeFrame(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
