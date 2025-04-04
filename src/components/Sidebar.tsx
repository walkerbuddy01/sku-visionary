
import { Home, BarChart2, ShoppingCart, Package, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  return (
    <div className="hidden md:flex h-screen w-64 flex-col bg-indigo-900 text-white">
      <div className="flex items-center justify-center h-16 border-b border-indigo-800">
        <h1 className="text-xl font-bold">SKU Visionary</h1>
      </div>
      
      <div className="flex flex-col flex-1 py-6">
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
        "flex items-center px-6 py-3 text-sm cursor-pointer",
        isActive 
          ? "bg-indigo-800 text-white border-l-4 border-white" 
          : "text-indigo-300 hover:bg-indigo-800 hover:text-white"
      )}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </div>
  );
};

export default Sidebar;
