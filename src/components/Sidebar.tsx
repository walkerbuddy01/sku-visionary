
import { useState } from "react";
import { Home, BarChart2, ShoppingCart, Package, Settings, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile sidebar toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 left-4 z-50 md:hidden" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-gradient-to-b from-indigo-900 to-indigo-950 text-white shadow-xl transition-transform duration-300 ease-in-out",
          "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-center h-16 border-b border-indigo-800">
          <h1 className="text-xl font-bold">SKU Visionary</h1>
        </div>
        
        <div className="flex flex-col flex-1 py-6 overflow-y-auto">
          <SidebarItem icon={<Home size={20} />} label="Dashboard" isActive={false} />
          <SidebarItem icon={<BarChart2 size={20} />} label="Forecasting" isActive={true} />
          <SidebarItem icon={<ShoppingCart size={20} />} label="Orders" isActive={false} />
          <SidebarItem icon={<Package size={20} />} label="Inventory" isActive={false} />
          <SidebarItem icon={<Settings size={20} />} label="Settings" isActive={false} />
        </div>
        
        <div className="p-4 border-t border-indigo-800">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-indigo-700 flex items-center justify-center">
              <span className="text-sm font-medium">JD</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-indigo-300">Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

const SidebarItem = ({ 
  icon, 
  label, 
  isActive 
}: { 
  icon: React.ReactNode; 
  label: string; 
  isActive: boolean 
}) => {
  return (
    <div 
      className={cn(
        "flex items-center px-6 py-3 text-sm cursor-pointer transition-colors duration-200",
        isActive 
          ? "bg-indigo-800 text-white border-l-4 border-white font-medium" 
          : "text-indigo-300 hover:bg-indigo-800/70 hover:text-white"
      )}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </div>
  );
};

export default Sidebar;
