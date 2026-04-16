"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Flame, ArrowUpRight, ArrowDownLeft, CheckCircle, XCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

export default function HistoryPage() {
  const pastExchanges = [
    {
      id: "EX-1049",
      type: "Borrowed",
      date: "Oct 12, 2026",
      status: "Completed",
      partner: "Ramesh Kumar",
      rating: 5,
      trustDelta: "+2",
    },
    {
      id: "EX-1042",
      type: "Lent",
      date: "Oct 01, 2026",
      status: "Completed",
      partner: "Sunita Yadav",
      rating: 5,
      trustDelta: "+3",
    },
    {
      id: "EX-1038",
      type: "Borrowed",
      date: "Sep 15, 2026",
      status: "Cancelled",
      partner: "Ajay Singh",
      rating: 0,
      trustDelta: "0",
    },
  ];

  const trustData = [
    { month: "Jan", score: 65 },
    { month: "Mar", score: 72 },
    { month: "Jun", score: 85 },
    { month: "Aug", score: 83 },
    { month: "Oct", score: 92 },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Exchange History</h2>
        <p className="text-slate-500 font-medium pb-4 border-b border-slate-200">
          Review your past exchanges and track your community trust score growth.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle>Past Exchanges</CardTitle>
            <CardDescription>Your history of lending and borrowing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pastExchanges.map((exchange) => (
                <div key={exchange.id} className="flex flex-col sm:flex-row justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-300 transition-colors bg-white shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${exchange.type === "Lent" ? "bg-orange-50 text-orange-500" : "bg-blue-50 text-blue-500"}`}>
                      {exchange.type === "Lent" ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{exchange.type} from/to {exchange.partner}</p>
                      <p className="text-sm text-slate-500">{exchange.date} • {exchange.id}</p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between mt-4 sm:mt-0">
                    <Badge variant="outline" className={exchange.status === "Completed" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}>
                      {exchange.status === "Completed" ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                      {exchange.status}
                    </Badge>
                    {exchange.status === "Completed" && (
                      <span className="text-xs font-bold text-green-600 mt-1">Trust {exchange.trustDelta}</span>
                    )}
                  </div>
                </div>
              ))}
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
                <AreaChart data={trustData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FF6B35" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
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
