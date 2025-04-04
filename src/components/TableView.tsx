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
import { TrendingUp, TrendingDown, Minus, Plus, Upload, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface TableViewProps {
  timeFrame: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  category: "salesTrends" | "financialGoals" | "manual";
  searchQuery: string;
  isAddDataOpen: boolean;
  setIsAddDataOpen: (isOpen: boolean) => void;
}

const addDataSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  productName: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  currentStock: z.coerce.number().min(0, "Current stock must be at least 0"),
  forecastSales: z.coerce.number().min(0, "Forecast sales must be at least 0"),
  recommendedOrder: z.coerce.number().min(0, "Recommended order must be at least 0"),
  revenue: z.coerce.number().min(0, "Revenue must be at least 0"),
});

type AddDataFormValues = z.infer<typeof addDataSchema>;

const TableView = ({ timeFrame, category, searchQuery, isAddDataOpen, setIsAddDataOpen }: TableViewProps) => {
  const [data, setData] = useState<SKUData[]>([]);
  const [filteredData, setFilteredData] = useState<SKUData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addMethod, setAddMethod] = useState<"manual" | "csv">("manual");
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const form = useForm<AddDataFormValues>({
    resolver: zodResolver(addDataSchema),
    defaultValues: {
      sku: "",
      productName: "",
      category: "",
      currentStock: 0,
      forecastSales: 0,
      recommendedOrder: 0,
      revenue: 0,
    },
  });

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

  const onSubmit = (values: AddDataFormValues) => {
    // Generate a random ID for the new item
    const newId = Math.random().toString(36).substring(2, 9);
    
    // Get current date in ISO format (YYYY-MM-DD)
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Add the new item to the data with all required properties
    const newItem: SKUData = {
      id: newId,
      sku: values.sku,
      productName: values.productName,
      category: values.category,
      currentStock: values.currentStock,
      forecastSales: values.forecastSales,
      recommendedOrder: values.recommendedOrder,
      revenue: values.revenue,
      date: currentDate,
      actualSales: 0,
      forecastStock: Math.max(0, values.currentStock - values.forecastSales),
      accuracy: 100,
    };
    
    setData([newItem, ...data]);
    setIsAddDataOpen(false);
    form.reset();
  };

  const handleCsvUpload = () => {
    if (!csvFile) return;
    
    // In a real app, this would process the CSV file
    // For this demo, we'll just close the modal
    console.log("Processing CSV file:", csvFile.name);
    setIsAddDataOpen(false);
    setCsvFile(null);
  };

  return (
    <Card className="shadow-sm overflow-hidden">
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            {category === "salesTrends" ? "Sales Trends" : 
             category === "financialGoals" ? "Financial Goals" : "Manual Data"} - {timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} View
          </h2>
          
          {category === "manual" && (
            <Button 
              onClick={() => setIsAddDataOpen(true)} 
              className="bg-indigo-700 hover:bg-indigo-800"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Data
            </Button>
          )}
        </div>
        
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

      <Dialog open={isAddDataOpen} onOpenChange={setIsAddDataOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Inventory Data</DialogTitle>
            <DialogDescription>
              Choose how you want to add your inventory data.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="manual" className="w-full mt-4" onValueChange={(value) => setAddMethod(value as "manual" | "csv")}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="csv">CSV Upload</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. SKU-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="productName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Widget X" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Electronics" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="currentStock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Stock</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="forecastSales"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Forecast Sales</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="recommendedOrder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recommended Order</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="revenue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Revenue ($)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDataOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-indigo-700 hover:bg-indigo-800">
                      Add Item
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="csv">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Label htmlFor="csvFile" className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-indigo-700 text-white hover:bg-indigo-800 h-10 px-4 py-2">
                      Choose CSV File
                    </Label>
                    <Input 
                      id="csvFile" 
                      type="file" 
                      accept=".csv" 
                      className="hidden" 
                      onChange={(e) => e.target.files && setCsvFile(e.target.files[0])}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {csvFile ? `Selected: ${csvFile.name}` : "Upload a CSV file with your inventory data"}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Columns: SKU, Product Name, Category, Current Stock, Forecast Sales, Recommended Order, Revenue
                  </p>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDataOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    className="bg-indigo-700 hover:bg-indigo-800"
                    onClick={handleCsvUpload}
                    disabled={!csvFile}
                  >
                    Upload CSV
                  </Button>
                </DialogFooter>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TableView;
