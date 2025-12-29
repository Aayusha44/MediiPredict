import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Activity, 
  Heart, 
  Brain, 
  Settings, 
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Diabetes", href: "/diabetes", icon: Activity, color: "text-blue-400" },
  { label: "Heart Disease", href: "/heart", icon: Heart, color: "text-red-400" },
  { label: "Parkinson's", href: "/parkinsons", icon: Brain, color: "text-purple-400" },
];

export function Sidebar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#1f2121] text-white">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-display font-bold text-gradient">MediPredict</h1>
        <p className="text-xs text-muted-foreground mt-1">AI Diagnostic Assistant</p>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div 
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group",
                location === item.href 
                  ? "bg-primary/20 text-primary border border-primary/20" 
                  : "hover:bg-white/5 text-muted-foreground hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-colors", item.color, location !== item.href && "opacity-70 group-hover:opacity-100")} />
              <span className="font-medium">{item.label}</span>
              {location === item.href && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-white transition-colors cursor-pointer rounded-xl hover:bg-white/5">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 z-50 border-r border-white/10">
        <SidebarContent />
      </aside>

      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="p-2 bg-[#1f2121] border border-white/10 rounded-lg text-white">
            <Menu className="w-6 h-6" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 border-r border-white/10 bg-[#1f2121] w-72">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
