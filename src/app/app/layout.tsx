"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Flame,
  LayoutDashboard,
  Send,
  Inbox,
  History,
  Bell,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { apiFetch, clearAuthSession, getStoredUser } from "@/lib/client-auth";

type ProfileSummary = {
  id: string;
  name: string;
  trustScore: number;
  recentNotifications: Array<{ read_at: string | null }>;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const initialStoredUser = getStoredUser();
  const [profile, setProfile] = useState<ProfileSummary | null>(null);
  const [userName, setUserName] = useState(
    initialStoredUser?.consumer?.full_name ||
      initialStoredUser?.email ||
      "Verified User"
  );
  const [unreadCount, setUnreadCount] = useState(0);

  const navigation = useMemo(
    () => [
      { name: "Dashboard", href: "/app", icon: LayoutDashboard },
      { name: "Send Cylinder", href: "/app/send", icon: Send },
      { name: "Find Cylinder", href: "/app/receive", icon: Inbox },
      { name: "History", href: "/app/history", icon: History },
    ],
    []
  );

  useEffect(() => {
    let isMounted = true;

    apiFetch<ProfileSummary>("/api/user/profile")
      .then((response) => {
        if (!isMounted || !response.data) {
          return;
        }

        setProfile(response.data);
        setUserName(response.data.name || userName);
        setUnreadCount(
          response.data.recentNotifications.filter(
            (notification) => !notification.read_at
          ).length
        );
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        clearAuthSession();
        router.push("/login");
      });

    return () => {
      isMounted = false;
    };
  }, [router, userName]);

  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isActive = (href: string) => {
    if (href === "/app") {
      return pathname === "/app";
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    clearAuthSession();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F3] via-white to-[#FFE5D9]">
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white/90 backdrop-blur-md border-r border-border shadow-xl shadow-slate-200/50 z-50">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center gap-2 px-6 py-6 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFC857] flex items-center justify-center shadow-lg shadow-[#FF6B35]/20">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#FFC857] bg-clip-text text-transparent">
              Eendhan Bandhu
            </span>
          </div>
          <nav className="flex-1 px-4 py-8 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "secondary" : "ghost"}
                    className={`w-full justify-start h-12 text-md transition-all duration-300 ${
                      isActive(item.href)
                        ? "bg-[#FFE5D9] text-[#FF6B35] hover:bg-[#FFE5D9] shadow-sm shadow-[#FF6B35]/10 translate-x-1"
                        : "hover:bg-[#FFF8F3] text-slate-600 hover:text-[#FF6B35]"
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

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-safe">
        <nav className="flex items-center justify-around px-2 py-3 shadow-[0_-5px_15px_-10px_rgba(0,0,0,0.1)]">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href} className="flex-1">
                <Button
                  variant="ghost"
                  className={`w-full flex flex-col items-center gap-1.5 h-auto py-2 transition-colors ${
                    isActive(item.href) ? "text-[#FF6B35]" : "text-slate-500"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${isActive(item.href) ? "drop-shadow-md" : ""}`}
                  />
                  <span className="text-[10px] font-semibold">
                    {item.name.split(" ")[0]}
                  </span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 lg:hidden">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFC857] flex items-center justify-center shadow-md">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-[#FF6B35] to-[#FFC857] bg-clip-text text-transparent">
                  Eendhan Bandhu
                </span>
              </div>
              <div className="hidden lg:block">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                  {navigation.find((item) => isActive(item.href))?.name ||
                    "Dashboard"}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-slate-100 rounded-full h-10 w-10 transition-colors"
                >
                  <Bell className="h-5 w-5 text-slate-600" />
                  <Badge className="absolute -top-0.5 -right-0.5 h-5 min-w-5 flex items-center justify-center p-0 bg-[#FF6B35] text-[10px] shadow-sm">
                    {unreadCount}
                  </Badge>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 hover:bg-slate-100 rounded-full sm:rounded-xl h-10 px-2 sm:px-3"
                    >
                      <Avatar className="h-8 w-8 border border-white shadow-sm ring-2 ring-slate-100">
                        <AvatarFallback className="bg-gradient-to-br from-[#FF6B35] to-[#FFC857] text-white font-bold text-xs">
                          {initials || "VU"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline font-medium text-slate-700">
                        {profile?.name || userName}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 rounded-xl shadow-xl border-slate-200"
                  >
                    <DropdownMenuLabel className="font-bold text-slate-800">
                      My Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-100" />
                    <DropdownMenuItem className="focus:bg-slate-50 cursor-pointer transition-colors">
                      <User className="mr-2 h-4 w-4 text-slate-500" />
                      <span className="font-medium text-slate-700">
                        Trust Score: {profile?.trustScore ?? "--"}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-slate-50 cursor-pointer transition-colors">
                      <History className="mr-2 h-4 w-4 text-slate-500" />
                      <span className="font-medium text-slate-700">
                        Unread Notifications: {unreadCount}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-100" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-500 focus:text-red-600 focus:bg-red-50 cursor-pointer font-medium transition-colors"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-8 pb-32 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
