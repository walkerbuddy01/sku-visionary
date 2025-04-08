
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  stock: number;
  description: string;
  createdAt: string;
  barcode?: string;
  countryOrigin?: string;
  hsCode?: string;
  weight?: number;
  status?: 'active' | 'draft';
  supplier?: string;
  emergencyStockLevel?: number;
  moq?: number;
  productionLeadTime?: number;
  cogs?: number;
  retailPrice?: number;
}

interface ProductTableProps {
  searchQuery: string;
}

const ProductTable = ({ searchQuery }: ProductTableProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
          createdAt: "2023-09-15",
          barcode: "123456789012",
          countryOrigin: "China",
          hsCode: "8518.30.20",
          weight: 0.35,
          status: "active",
          supplier: "TechAudio Inc.",
          emergencyStockLevel: 10,
          moq: 50,
          productionLeadTime: 30,
          cogs: 65.50,
          retailPrice: 149.99
        },
        {
          id: "2",
          name: "Organic Cotton T-Shirt",
          category: "Apparel",
          sku: "AP-TS-002",
          price: 29.99,
          stock: 120,
          description: "Soft, 100% organic cotton t-shirt in various colors",
          createdAt: "2023-08-22",
          barcode: "223456789013",
          countryOrigin: "India",
          hsCode: "6109.10.00",
          weight: 0.2,
          status: "active",
          supplier: "EcoTextiles Ltd.",
          emergencyStockLevel: 25,
          moq: 100,
          productionLeadTime: 45,
          cogs: 12.75,
          retailPrice: 29.99
        },
        {
          id: "3",
          name: "Smart Home Hub",
          category: "Electronics",
          sku: "EL-SH-003",
          price: 199.99,
          stock: 30,
          description: "Central hub for controlling all your smart home devices",
          createdAt: "2023-10-05",
          barcode: "323456789014",
          countryOrigin: "Taiwan",
          hsCode: "8517.62.00",
          weight: 0.5,
          status: "draft",
          supplier: "SmartTech Solutions",
          emergencyStockLevel: 5,
          moq: 25,
          productionLeadTime: 60,
          cogs: 89.50,
          retailPrice: 199.99
        },
        {
          id: "4",
          name: "Stainless Steel Water Bottle",
          category: "Accessories",
          sku: "AC-WB-004",
          price: 24.99,
          stock: 200,
          description: "Vacuum insulated, keeps drinks cold for 24 hours or hot for 12",
          createdAt: "2023-07-30",
          barcode: "423456789015",
          countryOrigin: "Vietnam",
          hsCode: "7323.93.00",
          weight: 0.4,
          status: "active",
          supplier: "EcoProducts Inc.",
          emergencyStockLevel: 50,
          moq: 200,
          productionLeadTime: 20,
          cogs: 9.25,
          retailPrice: 24.99
        },
        {
          id: "5",
          name: "Bluetooth Speaker",
          category: "Electronics",
          sku: "EL-BS-005",
          price: 79.99,
          stock: 60,
          description: "Waterproof portable speaker with 20-hour battery life",
          createdAt: "2023-09-28",
          barcode: "523456789016",
          countryOrigin: "China",
          hsCode: "8518.22.00",
          weight: 0.6,
          status: "active",
          supplier: "AudioTech Ltd.",
          emergencyStockLevel: 15,
          moq: 50,
          productionLeadTime: 30,
          cogs: 35.75,
          retailPrice: 79.99
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
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.barcode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.supplier?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.countryOrigin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.hsCode?.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

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
                    <TableHead className="font-semibold hidden md:table-cell">Supplier</TableHead>
                    <TableHead className="font-semibold hidden md:table-cell">Category</TableHead>
                    <TableHead className="font-semibold hidden md:table-cell">Origin</TableHead>
                    <TableHead className="font-semibold hidden lg:table-cell">HS Code</TableHead>
                    <TableHead className="text-right font-semibold">Price</TableHead>
                    <TableHead className="text-right font-semibold">Stock</TableHead>
                    <TableHead className="text-center font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={`loading-${index}`} className="animate-pulse">
                        {Array.from({ length: 10 }).map((_, cellIndex) => (
                          <TableCell key={`loading-cell-${cellIndex}`} className={cellIndex > 3 && cellIndex < 8 ? "hidden md:table-cell" : ""}>
                            <div className="h-4 bg-gray-200 rounded"></div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : currentItems.length > 0 ? (
                    currentItems.map((product) => (
                      <TableRow key={product.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell className="hidden md:table-cell">{product.supplier}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {product.category}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{product.countryOrigin}</TableCell>
                        <TableCell className="hidden lg:table-cell">{product.hsCode}</TableCell>
                        <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <span className={product.stock < (product.emergencyStockLevel || 10) ? "text-red-600 font-medium" : ""}>
                            {product.stock}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={product.status === 'active' ? "success" : "outline"}
                                className={product.status === 'active' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                            {product.status === 'active' ? 'Active' : 'Draft'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end space-x-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Product
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
                      <TableCell colSpan={10} className="text-center py-10 text-gray-500">
                        {searchQuery ? "No matching products found. Try a different search term." : "No products available."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        
        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(prev => prev > 1 ? prev - 1 : prev);
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(i + 1);
                    }}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(prev => prev < totalPages ? prev + 1 : prev);
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </Card>
  );
};

export default ProductTable;
