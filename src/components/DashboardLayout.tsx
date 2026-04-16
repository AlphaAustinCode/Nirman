import { Outlet, Link, useLocation } from "react-router";
import { Flame, LayoutDashboard, Send, Inbox, History, Bell, User, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useState } from "react";

export function DashboardLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/app", icon: LayoutDashboard },
    { name: "Send Cylinder", href: "/app/send", icon: Send },
    { name: "Find Cylinder", href: "/app/receive", icon: Inbox },
    { name: "History", href: "/app/history", icon: History },
  ];

  const isActive = (href: string) => {
    if (href === "/app") {
      return location.pathname === "/app";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F3] via-white to-[#FFE5D9]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-border">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFC857] flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#FFC857] bg-clip-text text-transparent">
              GasShare
            </span>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive(item.href) ? "secondary" : "ghost"}
                    className={`w-full justify-start ${
                      isActive(item.href)
                        ? "bg-[#FFE5D9] text-[#FF6B35] hover:bg-[#FFE5D9]"
                        : "hover:bg-[#FFF8F3]"
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border">
        <nav className="flex items-center justify-around px-2 py-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} to={item.href} className="flex-1">
                <Button
                  variant="ghost"
                  className={`w-full flex flex-col items-center gap-1 h-auto py-2 ${
                    isActive(item.href)
                      ? "text-[#FF6B35]"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{item.name.split(" ")[0]}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 lg:hidden">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFC857] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-[#FF6B35] to-[#FFC857] bg-clip-text text-transparent">
                  GasShare
                </span>
              </div>
              <div className="hidden lg:block">
                <h1 className="text-2xl font-bold">
                  {navigation.find((item) => isActive(item.href))?.name || "Dashboard"}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#FF6B35]">
                    3
                  </Badge>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-[#FF6B35] to-[#FFC857] text-white">
                          JD
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline">John Doe</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
