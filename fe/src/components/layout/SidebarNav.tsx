
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, LayoutDashboard, Table, Upload, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarNavProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

export function SidebarNav({ open, setOpen }: SidebarNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      path: "/",
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: "Upload Data",
      path: "/upload",
      icon: <Upload size={20} />,
    },
    {
      title: "People Data",
      path: "/data",
      icon: <Users size={20} />,
    },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen bg-black text-white transition-all duration-300 ease-in-out",
        open ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-DEFAULT">
            <Table size={20} />
          </div>
          {open && <span className="text-lg font-semibold">DataHub</span>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-2 text-white hover:bg-black/20",
            open ? "" : "right-[-12px] top-8 rounded-full bg-black shadow-md"
          )}
          onClick={() => setOpen(!open)}
        >
          {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </Button>
      </div>

      <div className="mt-8 px-3">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2 mb-1 transition-colors",
              isActivePath(item.path) 
                ? "bg-purple-DEFAULT text-white" 
                : "text-gray-300 hover:bg-white/10"
            )}
          >
            {item.icon}
            {open && <span className="text-sm font-medium">{item.title}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
