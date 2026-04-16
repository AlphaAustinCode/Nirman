"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Star, Clock, AlertTriangle, ChevronRight, Fingerprint, IndianRupee } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import MapWrapper from "@/components/MapWrapper";
import { Marker } from "react-map-gl";
import gsap from "gsap";

export default function ReceiverPage() {
  const [urgency, setUrgency] = useState<"low" | "medium" | "high">("medium");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [selectedSender, setSelectedSender] = useState<any>(null);
  const [requestStatus, setRequestStatus] = useState<"idle" | "waiting" | "confirmed">("idle");

  const senders = [
    {
      id: 1,
      name: "Ramesh Kumar",
      distance: "0.8 km",
      trustScore: 94,
      availableFrom: "14:00",
      availableTo: "18:00",
      price: "₹0 (Free)",
      lat: 28.5355,
      lng: 77.3910,
    },
    {
      id: 2,
      name: "Sunita Yadav",
      distance: "1.2 km",
      trustScore: 98,
      availableFrom: "Now",
      availableTo: "20:00",
      price: "Exchange Only",
      lat: 28.5450,
      lng: 77.3800,
    },
    {
      id: 3,
      name: "Ajay Singh",
      distance: "2.5 km",
      trustScore: 85,
      availableFrom: "17:00",
      availableTo: "21:00",
      price: "₹50 (Transport)",
      lat: 28.5200,
      lng: 77.4000,
    },
  ];

  const handleRequest = (sender: any) => {
    setSelectedSender(sender);
    setShowRequestDialog(true);
    setRequestStatus("idle");
  };

  const confirmRequest = () => {
    setRequestStatus("waiting");
    // Simulate network request and user acceptance
    setTimeout(() => {
      setRequestStatus("confirmed");
      toast.success("Request accepted! Check your notifications for details.");
    }, 2000);
  };

  const urgencyConfig = {
    low: { color: "bg-blue-100 text-blue-700 border-blue-200", icon: Clock, label: "Can wait 24h" },
    medium: { color: "bg-[#FFE5D9] text-[#FF6B35] border-[#FF6B35]", icon: AlertTriangle, label: "Need by today" },
    high: { color: "bg-red-100 text-red-700 border-red-200", icon: Flame, label: "Emergency (Now)" },
  };

  // Filter out those who don't match (simple name match)
  const filteredSenders = senders.filter((s) => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Find a Cylinder</h2>
        <p className="text-slate-500 font-medium pb-4 border-b border-slate-200">
          Search for available cylinders in your 3km radius.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Search & List */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-slate-200 shadow-lg bg-white overflow-hidden">
            <div className="p-1 bg-gradient-to-r from-[#FF6B35] to-[#FFC857]"></div>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-slate-800">Search Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                <Label className="text-slate-700 font-bold">Urgency Level</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["low", "medium", "high"] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setUrgency(level)}
                      className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                        urgency === level
                          ? `${urgencyConfig[level].color} shadow-sm ring-2 ring-offset-1 ring-${urgencyConfig[level].color.split(" ")[1].split("-")[1]}-400`
                          : "border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <span className="capitalize">{level}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs font-semibold text-slate-400 text-center mt-1">
                  {urgencyConfig[urgency].label}
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-slate-700 font-bold">Search Location/User</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder="Search by area or name..."
                    className="pl-10 h-12 bg-slate-50 border-slate-200 text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center justify-between">
              Available Near You
              <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-none border border-slate-200">{filteredSenders.length} Found</Badge>
            </h3>
            
            {filteredSenders.map((sender) => (
              <Card key={sender.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-lg text-slate-800">{sender.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center text-sm font-bold text-[#4CAF50] bg-[#4CAF50]/10 px-2 py-0.5 rounded-md">
                            <Star className="h-3.5 w-3.5 mr-1 fill-[#4CAF50]" /> {sender.trustScore}
                          </span>
                          <span className="flex items-center text-sm font-medium text-slate-500">
                            <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400" /> {sender.distance}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-[#FF6B35] text-[#FF6B35] bg-[#FFE5D9]/30 font-semibold px-2 py-1">
                        <Clock className="h-3 w-3 mr-1" /> {sender.availableFrom}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                        <IndianRupee className="h-4 w-4 text-slate-400" />
                        {sender.price}
                      </div>
                      <Button 
                        onClick={() => handleRequest(sender)}
                        className="bg-slate-800 hover:bg-slate-700 text-white shadow-md rounded-full px-6 h-10 transition-transform group-hover:scale-105"
                      >
                        Request
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Dynamic Map */}
        <div className="lg:col-span-7 h-[60dvh] lg:h-auto min-h-[500px] sticky top-24">
          <Card className="h-full border-slate-200 shadow-lg overflow-hidden flex flex-col">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-3 flex-none">
              <CardTitle className="flex justify-between items-center text-base">
                <span className="flex items-center gap-2"><MapPin className="h-5 w-5 text-[#FF6B35] fill-[#FF6B35]/20" /> 3km Radius Map</span>
                <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded-full">Live</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 relative">
              <MapWrapper>
                {/* We would render markers here dynamically in a real app if token handles it */}
                {/* For example using <Marker longitude={s.lng} latitude={s.lat}>...</Marker> */}
              </MapWrapper>
              
              {/* Radar overlay effect for cinematic feel */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                 <div className="w-[150%] h-[150%] rounded-full border border-[#FF6B35]/20 animate-ping" style={{ animationDuration: '4s' }}></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Request Modal Flow */}
      <Dialog open={showRequestDialog} onOpenChange={(open) => !open && setShowRequestDialog(false)}>
        <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-2xl overflow-hidden p-0">
          <div className="p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-bold">Request Cylinder</DialogTitle>
              <DialogDescription className="text-slate-500 font-medium pt-1">
                You are requesting an LPG cylinder exchange with {selectedSender?.name}.
              </DialogDescription>
            </DialogHeader>

            {requestStatus === "idle" && (
              <div className="space-y-4 animate-in fade-in zoom-in-95">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                   <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                     <span className="text-slate-500 font-semibold text-sm">Provider</span>
                     <span className="font-bold text-slate-800">{selectedSender?.name} <span className="text-[#4CAF50]">★{selectedSender?.trustScore}</span></span>
                   </div>
                   <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                     <span className="text-slate-500 font-semibold text-sm">Distance</span>
                     <span className="font-bold text-slate-800">{selectedSender?.distance} away</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-slate-500 font-semibold text-sm">Estimated Cost</span>
                     <span className="font-bold text-[#FF6B35]">{selectedSender?.price}</span>
                   </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-100">
                  <Fingerprint className="h-5 w-5 mt-0.5 text-blue-500 flex-shrink-0" />
                  <p className="text-xs font-medium leading-relaxed">
                    By confirming, your verified profile and passbook status will be securely shared with the provider.
                  </p>
                </div>

                <Button 
                  onClick={confirmRequest}
                  className="w-full h-14 text-lg bg-slate-900 hover:bg-slate-800 text-white shadow-xl rounded-xl mt-2"
                >
                  Send Request Now
                </Button>
              </div>
            )}

            {requestStatus === "waiting" && (
              <div className="py-12 flex flex-col items-center justify-center space-y-4 animate-in fade-in">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-[#FF6B35] animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-[#FF6B35]" />
                  </div>
                </div>
                <p className="font-bold text-slate-700 text-lg">Awaiting Confirmation...</p>
                <p className="text-slate-500 text-sm text-center max-w-xs">
                  {selectedSender?.name} is being notified. They usually respond within 5-10 minutes.
                </p>
              </div>
            )}

            {requestStatus === "confirmed" && (
              <div className="py-8 flex flex-col items-center justify-center space-y-4 animate-in zoom-in-90 fade-in">
                <div className="w-20 h-20 rounded-full bg-[#4CAF50]/10 flex items-center justify-center mb-2">
                  <CheckCircle className="h-10 w-10 text-[#4CAF50]" />
                </div>
                <p className="font-bold text-slate-800 text-2xl">Request Accepted!</p>
                <div className="text-center text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 w-full mb-2">
                  <p className="font-bold mb-1">Meet at: Main Gate, Sector 12</p>
                  <p className="text-sm">Provider will meet you at {selectedSender?.availableFrom}.</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full h-12 border-2"
                  onClick={() => setShowRequestDialog(false)}
                >
                  View Details in Dashboard
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
