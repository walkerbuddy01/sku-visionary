
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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

const AddProductDialog = ({ open, onOpenChange }: AddProductDialogProps) => {
  const { toast } = useToast();
  const [productName, setProductName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
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

  const handleSubmit = () => {
    // Basic validation
    if (!productName || !sku || !price || !stock) {
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
      name: productName,
      sku,
      category,
      price: parseFloat(price),
      stock: parseInt(stock),
      description,
      customFields: customFields.map(({ name, value }) => ({ name, value })),
      createdAt: new Date().toISOString()
    };
    
    console.log("New product:", newProduct);
    
    toast({
      title: "Product created",
      description: `${productName} has been added to your inventory`,
    });
    
    // Reset form
    setProductName("");
    setSku("");
    setCategory("");
    setPrice("");
    setStock("");
    setDescription("");
    setCustomFields([]);
    
    // Close dialog
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the product details below. Add custom fields as needed for additional information.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-right">
              Product Name *
            </Label>
            <Input
              id="name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sku" className="text-right">
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
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Electronics"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price" className="text-right">
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
            <Label htmlFor="stock" className="text-right">
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
            <Label htmlFor="description" className="text-right">
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

          {/* Custom Fields */}
          {customFields.length > 0 && (
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Custom Fields</h3>
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
          <div className="md:col-span-2 border-t pt-4 mt-2">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Add Custom Field</h3>
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
        
        <DialogFooter>
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
