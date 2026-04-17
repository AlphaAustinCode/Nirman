"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  Area,
  AreaChart,
  XAxis,
  Tooltip,
} from "recharts";
import { apiFetch } from "@/lib/client-auth";

type HistoryRecord = {
  id: string;
  date: string;
  type: "Lent" | "Borrowed";
  counterparty: string;
  status: string;
  amount: string;
};

type ProfileData = {
  trustScore: number;
  stats: {
    lends_completed: number;
    borrows_completed: number;
  };
};

export default function HistoryPage() {
  const [pastExchanges, setPastExchanges] = useState<HistoryRecord[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    Promise.all([
      apiFetch<HistoryRecord[]>("/api/history"),
      apiFetch<ProfileData>("/api/user/profile"),
    ])
      .then(([historyResponse, profileResponse]) => {
        setPastExchanges(historyResponse.data || []);
        setProfile(profileResponse.data || null);
      })
      .catch(() => {
        setPastExchanges([]);
      });
  }, []);

  const trustData = useMemo(() => {
    const score = profile?.trustScore ?? 80;
    const lends = profile?.stats.lends_completed ?? 0;
    const borrows = profile?.stats.borrows_completed ?? 0;
    const totalCompleted = lends + borrows;

    return [
      { month: "Start", score: Math.max(50, score - totalCompleted * 2) },
      { month: "Growth", score: Math.max(55, score - totalCompleted) },
      { month: "Now", score },
    ];
  }, [profile]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
          Exchange History
        </h2>
        <p className="text-slate-500 font-medium pb-4 border-b border-slate-200">
          Review your past exchanges and track your community trust score growth.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle>Past Exchanges</CardTitle>
            <CardDescription>
              Your history of lending and borrowing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pastExchanges.map((exchange) => (
                <div
                  key={exchange.id}
                  className="flex flex-col sm:flex-row justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-300 transition-colors bg-white shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-lg ${
                        exchange.type === "Lent"
                          ? "bg-orange-50 text-orange-500"
                          : "bg-blue-50 text-blue-500"
                      }`}
                    >
                      {exchange.type === "Lent" ? (
                        <ArrowUpRight className="h-5 w-5" />
                      ) : (
                        <ArrowDownLeft className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">
                        {exchange.type} with {exchange.counterparty}
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(exchange.date).toLocaleString()} | {exchange.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between mt-4 sm:mt-0">
                    <Badge
                      variant="outline"
                      className={
                        exchange.status === "COMPLETED"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }
                    >
                      {exchange.status === "COMPLETED" ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {exchange.status}
                    </Badge>
                    {exchange.status === "COMPLETED" && (
                      <span className="text-xs font-bold text-green-600 mt-1">
                        Trust gained through verified completion
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {pastExchanges.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                  No exchange history yet. Your completed lending and borrowing
                  records will appear here.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle>Trust Growth</CardTitle>
            <CardDescription>Your score over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trustData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Area
                    type="natural"
                    dataKey="score"
                    stroke="#FF6B35"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
