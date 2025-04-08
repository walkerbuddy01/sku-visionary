
import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductTable from "@/components/ProductTable";
import AddProductDialog from "@/components/AddProductDialog";
import Sidebar from "@/components/Sidebar";

const Products = () => {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 md:ml-64 p-4 md:p-6 pt-16 md:pt-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-500 mt-2">
                Manage your product inventory and catalog
              </p>
            </div>
            <Button 
              onClick={() => setIsAddProductOpen(true)} 
              className="bg-indigo-700 hover:bg-indigo-800 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </header>

          <Card className="p-4 mb-6">
            <div className="relative w-full md:w-1/2">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </Card>

          <ProductTable searchQuery={searchQuery} />

          <AddProductDialog 
            open={isAddProductOpen} 
            onOpenChange={setIsAddProductOpen} 
          />
        </div>
      </div>
    </div>
  );
};

export default Products;
