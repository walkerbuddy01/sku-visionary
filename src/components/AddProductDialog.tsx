
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Barcode, Package, Tag, Truck, Image, ChevronDown, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CustomField {
  id: string;
  name: string;
  value: string;
  type: "text" | "number" | "select";
  options?: string[];
}

// Mock data for dropdowns - in a real app, these would come from an API
const suppliers = ["Supplier A", "Supplier B", "Supplier C", "Supplier D"];
const warehouses = ["Warehouse 1", "Warehouse 2", "Warehouse 3", "Warehouse 4"];
const freightOptions = ["SEA", "AIR", "LCL", "Truck"];
const paymentTerms = ["Net 30", "Net 60", "COD", "Prepaid"];

const AddProductDialog = ({ open, onOpenChange }: AddProductDialogProps) => {
  const { toast } = useToast();
  
  // Basic product information
  const [productTitle, setProductTitle] = useState("");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [productStatus, setProductStatus] = useState<"active" | "draft">("draft");
  
  // Dimensions & weight
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  
  // Shipping details
  const [cartonWeight, setCartonWeight] = useState("");
  const [cartonLength, setCartonLength] = useState("");
  const [cartonWidth, setCartonWidth] = useState("");
  const [cartonHeight, setCartonHeight] = useState("");
  const [countryOrigin, setCountryOrigin] = useState("");
  const [hsCode, setHsCode] = useState("");
  const [customsDescription, setCustomsDescription] = useState("");
  
  // Inventory planning
  const [selectedWarehouses, setSelectedWarehouses] = useState<string[]>([]);
  const [emergencyStockLevel, setEmergencyStockLevel] = useState("");
  const [moq, setMoq] = useState("");
  const [leadTime, setLeadTime] = useState("");
  const [cogs, setCogs] = useState("");
  const [retailPrice, setRetailPrice] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedPaymentTerms, setSelectedPaymentTerms] = useState("");
  const [selectedFreight, setSelectedFreight] = useState<string[]>([]);
  
  // Custom fields
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState<"text" | "number" | "select">("text");

  const handleAddField = () => {
    if (!newFieldName) return;
    
    const newId = `field-${Date.now()}`;
    const newField: CustomField = {
      id: newId,
      name: newFieldName,
      value: "",
      type: newFieldType,
      options: newFieldType === "select" ? ["Option 1", "Option 2", "Option 3"] : undefined
    };
    
    setCustomFields([...customFields, newField]);
    setNewFieldName("");
    setNewFieldType("text");
  };

  const handleRemoveField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id));
  };

  const handleFieldChange = (id: string, value: string) => {
    setCustomFields(
      customFields.map(field => 
        field.id === id ? { ...field, value } : field
      )
    );
  };
  
  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleImageFile(file);
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleImageFile(file);
    }
  };
  
  const handleImageFile = (file: File) => {
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }
    
    setImage(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImagePreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleWarehouse = (warehouse: string) => {
    setSelectedWarehouses(current => 
      current.includes(warehouse)
        ? current.filter(w => w !== warehouse)
        : [...current, warehouse]
    );
  };
  
  const toggleFreight = (freight: string) => {
    setSelectedFreight(current => 
      current.includes(freight)
        ? current.filter(f => f !== freight)
        : [...current, freight]
    );
  };

  const handleSubmit = () => {
    // Basic validation
    if (!productTitle || !sku || !barcode || !price || !stock) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would send the product data to an API
    const newProduct = {
      id: `prod-${Date.now()}`,
      title: productTitle,
      sku,
      barcode,
      category,
      price: parseFloat(price),
      stock: parseInt(stock),
      description,
      status: productStatus,
      dimensions: {
        length: parseFloat(length) || 0,
        width: parseFloat(width) || 0,
        height: parseFloat(height) || 0,
        weight: parseFloat(weight) || 0,
      },
      shipping: {
        carton: {
          weight: parseFloat(cartonWeight) || 0,
          length: parseFloat(cartonLength) || 0,
          width: parseFloat(cartonWidth) || 0,
          height: parseFloat(cartonHeight) || 0,
        },
        countryOrigin,
        hsCode,
        customsDescription,
        freight: selectedFreight
      },
      inventory: {
        warehouses: selectedWarehouses,
        emergencyStockLevel: parseInt(emergencyStockLevel) || 0,
        moq: parseInt(moq) || 0,
        leadTime: parseInt(leadTime) || 0,
      },
      pricing: {
        cogs: parseFloat(cogs) || 0,
        retail: parseFloat(retailPrice) || 0,
      },
      supplier: selectedSupplier,
      paymentTerms: selectedPaymentTerms,
      customFields: customFields.map(({ name, value }) => ({ name, value })),
      // In a real app, we'd upload the image and store its URL
      imageUrl: image ? URL.createObjectURL(image) : "",
      createdAt: new Date().toISOString()
    };
    
    console.log("New product:", newProduct);
    
    toast({
      title: "Product created",
      description: `${productTitle} has been added to your inventory`,
    });
    
    // Reset form
    resetForm();
    
    // Close dialog
    onOpenChange(false);
  };
  
  const resetForm = () => {
    // Reset all form fields
    setProductTitle("");
    setSku("");
    setBarcode("");
    setCategory("");
    setDescription("");
    setPrice("");
    setStock("");
    setImage(null);
    setImagePreview("");
    setProductStatus("draft");
    setLength("");
    setWidth("");
    setHeight("");
    setWeight("");
    setCartonWeight("");
    setCartonLength("");
    setCartonWidth("");
    setCartonHeight("");
    setCountryOrigin("");
    setHsCode("");
    setCustomsDescription("");
    setSelectedWarehouses([]);
    setEmergencyStockLevel("");
    setMoq("");
    setLeadTime("");
    setCogs("");
    setRetailPrice("");
    setSelectedSupplier("");
    setSelectedPaymentTerms("");
    setSelectedFreight([]);
    setCustomFields([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the product details below. Required fields are marked with an asterisk (*).
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Product Status Toggle */}
          <div className="flex justify-end gap-2">
            <span className="text-sm text-gray-500">Status:</span>
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                variant={productStatus === "draft" ? "default" : "outline"} 
                onClick={() => setProductStatus("draft")}
                className={productStatus === "draft" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
              >
                Draft
              </Button>
              <Button 
                size="sm" 
                variant={productStatus === "active" ? "default" : "outline"} 
                onClick={() => setProductStatus("active")}
                className={productStatus === "active" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Active
              </Button>
            </div>
          </div>
        
          {/* Basic Information */}
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-3">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productTitle">
                  Product Title *
                </Label>
                <Input
                  id="productTitle"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  placeholder="Enter product title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sku">
                  SKU *
                </Label>
                <Input
                  id="sku"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. PROD-001"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="barcode">
                  Barcode *
                </Label>
                <div className="relative">
                  <Barcode className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="barcode"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="Enter barcode"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category
                </Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Electronics"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price ($) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock">
                  Stock Quantity *
                </Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="image">
                  Product Image
                </Label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center text-center"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleImageDrop}
                >
                  {imagePreview ? (
                    <div className="relative w-full">
                      <img 
                        src={imagePreview} 
                        alt="Product preview" 
                        className="h-40 mx-auto object-contain"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute right-0 top-0 rounded-full"
                        onClick={() => {
                          setImage(null);
                          setImagePreview("");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Image className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <label htmlFor="file-upload" className="text-indigo-600 hover:text-indigo-500 cursor-pointer">
                          Upload a file
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="text-gray-500 mt-1">or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dimensions */}
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-3">Dimensions & Weight</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="length">
                  Length (cm)
                </Label>
                <Input
                  id="length"
                  type="number"
                  min="0"
                  step="0.1"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="width">
                  Width (cm)
                </Label>
                <Input
                  id="width"
                  type="number"
                  min="0"
                  step="0.1"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height">
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  min="0"
                  step="0.1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          
          {/* Supplier Information */}
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-3">Supplier Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">
                  Supplier
                </Label>
                <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentTerms">
                  Payment Terms
                </Label>
                <Select value={selectedPaymentTerms} onValueChange={setSelectedPaymentTerms}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentTerms.map((term) => (
                      <SelectItem key={term} value={term}>{term}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Shipping Details */}
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-3">Shipping Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Carton Dimensions</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="cartonLength" className="text-xs">
                      Length (cm)
                    </Label>
                    <Input
                      id="cartonLength"
                      type="number"
                      min="0"
                      step="0.1"
                      value={cartonLength}
                      onChange={(e) => setCartonLength(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="cartonWidth" className="text-xs">
                      Width (cm)
                    </Label>
                    <Input
                      id="cartonWidth"
                      type="number"
                      min="0"
                      step="0.1"
                      value={cartonWidth}
                      onChange={(e) => setCartonWidth(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="cartonHeight" className="text-xs">
                      Height (cm)
                    </Label>
                    <Input
                      id="cartonHeight"
                      type="number"
                      min="0"
                      step="0.1"
                      value={cartonHeight}
                      onChange={(e) => setCartonHeight(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="cartonWeight" className="text-xs">
                      Weight (kg)
                    </Label>
                    <Input
                      id="cartonWeight"
                      type="number"
                      min="0"
                      step="0.1"
                      value={cartonWeight}
                      onChange={(e) => setCartonWeight(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="countryOrigin">
                    Country of Origin
                  </Label>
                  <Input
                    id="countryOrigin"
                    value={countryOrigin}
                    onChange={(e) => setCountryOrigin(e.target.value)}
                    placeholder="e.g. United States"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hsCode">
                    HS Code
                  </Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="hsCode"
                      value={hsCode}
                      onChange={(e) => setHsCode(e.target.value)}
                      placeholder="Enter HS code"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="customsDescription">
                  Customs Description
                </Label>
                <Textarea
                  id="customsDescription"
                  value={customsDescription}
                  onChange={(e) => setCustomsDescription(e.target.value)}
                  placeholder="Enter customs description"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="freight">
                  Freight Options
                </Label>
                <div className="flex flex-wrap gap-2">
                  {freightOptions.map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant={selectedFreight.includes(option) ? "default" : "outline"}
                      size="sm"
                      className={selectedFreight.includes(option) ? "bg-indigo-700 hover:bg-indigo-800" : ""}
                      onClick={() => toggleFreight(option)}
                    >
                      <Truck className="h-4 w-4 mr-1" />
                      {option}
                      {selectedFreight.includes(option) && (
                        <Check className="h-3.5 w-3.5 ml-1" />
                      )}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Select all applicable freight options
                </p>
              </div>
            </div>
          </div>
          
          {/* Inventory Planning */}
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-3">Inventory Planning</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="warehouse">
                  Warehouses
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <span className="mr-auto">
                        {selectedWarehouses.length === 0 
                          ? "Select warehouses" 
                          : `${selectedWarehouses.length} warehouse(s) selected`}
                      </span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[200px]" align="start">
                    {warehouses.map((warehouse) => (
                      <DropdownMenuCheckboxItem
                        key={warehouse}
                        checked={selectedWarehouses.includes(warehouse)}
                        onCheckedChange={() => toggleWarehouse(warehouse)}
                      >
                        {warehouse}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyStockLevel">
                  Emergency Stock Level
                </Label>
                <Input
                  id="emergencyStockLevel"
                  type="number"
                  min="0"
                  value={emergencyStockLevel}
                  onChange={(e) => setEmergencyStockLevel(e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="moq">
                  Minimum Order Quantity (MOQ)
                </Label>
                <Input
                  id="moq"
                  type="number"
                  min="1"
                  value={moq}
                  onChange={(e) => setMoq(e.target.value)}
                  placeholder="1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="leadTime">
                  Production Lead Time (days)
                </Label>
                <Input
                  id="leadTime"
                  type="number"
                  min="0"
                  value={leadTime}
                  onChange={(e) => setLeadTime(e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cogs">
                  Cost of Goods (COGS) ($)
                </Label>
                <Input
                  id="cogs"
                  type="number"
                  min="0"
                  step="0.01"
                  value={cogs}
                  onChange={(e) => setCogs(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="retailPrice">
                  Retail Price ($)
                </Label>
                <Input
                  id="retailPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={retailPrice}
                  onChange={(e) => setRetailPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Custom Fields */}
          {customFields.length > 0 && (
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-3">Custom Fields</h3>
              <div className="space-y-3">
                {customFields.map((field) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <div className="flex-1">
                      <Label className="text-xs text-gray-500">{field.name}</Label>
                      {field.type === "select" ? (
                        <Select
                          value={field.value}
                          onValueChange={(value) => handleFieldChange(field.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          type={field.type}
                          value={field.value}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          placeholder={`Enter ${field.name}`}
                        />
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 mt-5" 
                      onClick={() => handleRemoveField(field.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Add Custom Field */}
          <div className="border-t pt-4 mt-2">
            <h3 className="text-base font-medium text-gray-900 mb-3">Add Custom Field</h3>
            <div className="flex gap-2">
              <Input
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                placeholder="Field name"
                className="flex-1"
              />
              <Select value={newFieldType} onValueChange={(value: "text" | "number" | "select") => setNewFieldType(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Field type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                className="flex-shrink-0" 
                onClick={handleAddField}
                disabled={!newFieldName}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Add custom fields for additional product attributes like color, size, material, etc.
            </p>
          </div>
        </div>
        
        <DialogFooter className="sticky bottom-0 bg-white pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-indigo-700 hover:bg-indigo-800" onClick={handleSubmit}>
            Create Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
