
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  stock: number;
  description: string;
  createdAt: string;
}

interface ProductTableProps {
  searchQuery: string;
}

const ProductTable = ({ searchQuery }: ProductTableProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching products from an API
    setIsLoading(true);
    setTimeout(() => {
      const mockProducts: Product[] = [
        {
          id: "1",
          name: "Premium Wireless Headphones",
          category: "Electronics",
          sku: "EL-WH-001",
          price: 149.99,
          stock: 45,
          description: "Noise-cancelling wireless headphones with premium sound quality",
          createdAt: "2023-09-15"
        },
        {
          id: "2",
          name: "Organic Cotton T-Shirt",
          category: "Apparel",
          sku: "AP-TS-002",
          price: 29.99,
          stock: 120,
          description: "Soft, 100% organic cotton t-shirt in various colors",
          createdAt: "2023-08-22"
        },
        {
          id: "3",
          name: "Smart Home Hub",
          category: "Electronics",
          sku: "EL-SH-003",
          price: 199.99,
          stock: 30,
          description: "Central hub for controlling all your smart home devices",
          createdAt: "2023-10-05"
        },
        {
          id: "4",
          name: "Stainless Steel Water Bottle",
          category: "Accessories",
          sku: "AC-WB-004",
          price: 24.99,
          stock: 200,
          description: "Vacuum insulated, keeps drinks cold for 24 hours or hot for 12",
          createdAt: "2023-07-30"
        },
        {
          id: "5",
          name: "Bluetooth Speaker",
          category: "Electronics",
          sku: "EL-BS-005",
          price: 79.99,
          stock: 60,
          description: "Waterproof portable speaker with 20-hour battery life",
          createdAt: "2023-09-28"
        }
      ];
      setProducts(mockProducts);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    // Filter products based on search query
    if (searchQuery) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchQuery]);

  const handleDelete = (id: string) => {
    // In a real app, this would call an API to delete the product
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  return (
    <Card className="shadow-sm overflow-hidden">
      <div className="p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
          Product Inventory
        </h2>
        
        <div className="overflow-x-auto -mx-4 md:-mx-6">
          <div className="inline-block min-w-full align-middle p-4 md:p-6">
            <div className="overflow-hidden border border-gray-200 md:rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Product Name</TableHead>
                    <TableHead className="font-semibold">SKU</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="text-right font-semibold">Price</TableHead>
                    <TableHead className="text-right font-semibold">Stock</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={`loading-${index}`} className="animate-pulse">
                        {Array.from({ length: 6 }).map((_, cellIndex) => (
                          <TableCell key={`loading-cell-${cellIndex}`}>
                            <div className="h-4 bg-gray-200 rounded"></div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {product.category}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <span className={product.stock < 10 ? "text-red-600 font-medium" : ""}>
                            {product.stock}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-500"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                        {searchQuery ? "No matching products found. Try a different search term." : "No products available."}
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

export default ProductTable;
