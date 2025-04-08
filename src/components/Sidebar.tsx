
import { useState } from "react";
import { Home, BarChart2, ShoppingCart, Package, Settings, Menu, X, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    // Handle logout functionality here
    console.log("Logging out");
    // For demonstration, navigate to login page
    navigate("/login");
  };

  const handleProfileSettings = () => {
    // Handle profile settings navigation
    console.log("Navigate to profile settings");
    // You would navigate to profile settings page here
  };

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
          <SidebarItem 
            icon={<Home size={20} />} 
            label="Dashboard" 
            isActive={location.pathname === '/'} 
            onClick={() => navigate('/')}
          />
          <SidebarItem 
            icon={<BarChart2 size={20} />} 
            label="Forecasting" 
            isActive={location.pathname === '/forecasting'} 
            onClick={() => navigate('/forecasting')}
          />
          <SidebarItem 
            icon={<Package size={20} />} 
            label="Products" 
            isActive={location.pathname === '/products'} 
            onClick={() => navigate('/products')}
          />
          <SidebarItem 
            icon={<ShoppingCart size={20} />} 
            label="Orders" 
            isActive={location.pathname === '/orders'} 
            onClick={() => navigate('/orders')}
          />
          <SidebarItem 
            icon={<Settings size={20} />} 
            label="Settings" 
            isActive={location.pathname === '/settings'} 
            onClick={() => navigate('/settings')}
          />
        </div>
        
        <div className="p-4 border-t border-indigo-800">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center cursor-pointer hover:bg-indigo-800 p-2 rounded-md transition-colors">
                <div className="h-8 w-8 rounded-full bg-indigo-700 flex items-center justify-center">
                  <span className="text-sm font-medium">JD</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-indigo-300">Admin</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" side="top" sideOffset={16}>
              <DropdownMenuItem onClick={handleProfileSettings} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
  isActive,
  onClick
}: { 
  icon: React.ReactNode; 
  label: string; 
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <div 
      className={cn(
        "flex items-center px-6 py-3 text-sm cursor-pointer transition-colors duration-200",
        isActive 
          ? "bg-indigo-800 text-white border-l-4 border-white font-medium" 
          : "text-indigo-300 hover:bg-indigo-800/70 hover:text-white"
      )}
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </div>
  );
};

export default Sidebar;
