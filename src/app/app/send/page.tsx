"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Send, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MapWrapper from "@/components/MapWrapper";

interface Listing {
  id: number;
  location: string;
  availableFrom: string;
  availableTo: string;
  status: "active" | "completed";
  createdAt: string;
  serialNumber: string;
}

export default function SenderPage() {
  const [location, setLocation] = useState("");
  const [autoDetected, setAutoDetected] = useState(false);
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [listings, setListings] = useState<Listing[]>([
    {
      id: 1,
      location: "Sector 12, Noida",
      availableFrom: "10:00 AM",
      availableTo: "6:00 PM",
      status: "active",
      createdAt: "2 hours ago",
      serialNumber: "HP-123456789",
    },
    {
      id: 2,
      location: "Sector 15, Noida",
      availableFrom: "09:00 AM",
      availableTo: "12:00 PM",
      status: "completed",
      createdAt: "2 days ago",
      serialNumber: "HP-987654321",
    },
  ]);

  const handleDetectLocation = () => {
    setAutoDetected(true);
    setLocation("Sector 12, Noida, UP - 201301");
    toast.success("Location auto-detected via GPS!");
  };

  const handlePublishListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !availableFrom || !availableTo) {
      toast.error("Please fill all required fields");
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmPublish = () => {
    const newListing: Listing = {
      id: Date.now(),
      location,
      availableFrom,
      availableTo,
      status: "active",
      createdAt: "Just now",
      serialNumber: "HP-" + Math.random().toString().slice(2, 11),
    };
    setListings([newListing, ...listings]);
    setLocation("");
    setAvailableFrom("");
    setAvailableTo("");
    setAutoDetected(false);
    setShowConfirmDialog(false);
    toast.success("Cylinder listed successfully! Nearby users are being notified.");
  };

  const handleDeleteListing = (id: number) => {
    setListings(listings.filter(l => l.id !== id));
    toast.success("Listing removed from community board");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">List Your Cylinder</h2>
        <p className="text-slate-500 font-medium pb-2 border-b border-slate-200">
          Be a hero. Help your community by safely lending out your spare LPG space.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Listing Form */}
        <Card className="lg:col-span-5 border-[#FFE5D9] shadow-xl shadow-[#FFE5D9]/40 bg-white">
          <CardHeader>
            <CardTitle className="text-slate-800">Create New Listing</CardTitle>
            <CardDescription className="text-slate-500">Pick the time and place for the exchange</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePublishListing} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="location" className="text-slate-700 font-bold">Exchange Location</Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    placeholder="Enter full address or building name"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 bg-slate-50"
                    required
                  />
                  <Button
                    type="button"
                    title="Auto-detect location"
                    variant="outline"
                    onClick={handleDetectLocation}
                    className="border-[#FF6B35] text-[#FF6B35] hover:bg-[#FFE5D9] hover:text-[#FF6B35]"
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
                {autoDetected && (
                  <p className="text-xs text-[#4CAF50] font-semibold flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Verified GPS Location
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="from" className="text-slate-700 font-bold">Available From</Label>
                  <Input
                    id="from"
                    type="time"
                    className="bg-slate-50"
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="to" className="text-slate-700 font-bold">Available To</Label>
                  <Input
                    id="to"
                    type="time"
                    className="bg-slate-50"
                    value={availableTo}
                    onChange={(e) => setAvailableTo(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="p-4 bg-[#FFF8F3] rounded-xl border border-[#FFE5D9]">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-[#FF6B35] flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-bold text-[#FF6B35] mb-1">Safety First</p>
                    <ul className="text-slate-600 space-y-1 list-disc list-inside font-medium">
                      <li>Meet during daytime in public spots</li>
                      <li>Scan passbook via app during handover</li>
                      <li>Double check the cylinder seal</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#FF6B35] to-[#FFC857] hover:opacity-90 shadow-md text-base"
              >
                <Send className="mr-2 h-4 w-4" />
                Publish to Community map
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Map Column */}
        <Card className="lg:col-span-7 border-slate-200 shadow-lg overflow-hidden flex flex-col">
          <CardHeader className="bg-slate-50 border-b border-slate-100 flex-none pb-4">
             <CardTitle className="flex items-center gap-2">
               <MapPin className="h-5 w-5 text-slate-500" /> Map Picker & Live Requests
             </CardTitle>
             <CardDescription>Live map of people requesting cylinders near you</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1 min-h-[300px] h-[50dvh]">
             <MapWrapper />
          </CardContent>
        </Card>
      </div>

      {/* Active Listings List */}
      <h3 className="text-xl font-bold text-slate-800 mt-10 mb-4 border-b border-slate-200 pb-2">Your Cylinder Listings</h3>
      <div className="space-y-4">
        {listings.map((listing) => (
          <Card key={listing.id} className={`border-l-4 shadow-sm transition-all hover:shadow-md ${listing.status === 'active' ? 'border-l-[#4CAF50] bg-white' : 'border-l-slate-300 bg-slate-50'}`}>
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${listing.status === 'active' ? 'bg-gradient-to-br from-[#FF6B35] to-[#FFC857]' : 'bg-slate-200'}`}>
                  <Send className={`h-6 w-6 ${listing.status === 'active' ? 'text-white' : 'text-slate-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className={`font-bold text-lg ${listing.status === 'active' ? 'text-slate-800' : 'text-slate-500'}`}>{listing.location}</p>
                    </div>
                    {listing.status === 'active' ? (
                      <Badge className="bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white shadow-sm px-2">
                        <CheckCircle className="h-3.5 w-3.5 mr-1" /> Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-slate-200 text-slate-600 shadow-sm px-2">
                        Completed
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 font-medium">
                    <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                      <Clock className="h-3.5 w-3.5" />
                      {listing.availableFrom} - {listing.availableTo}
                    </span>
                    <span>Serial: <span className="font-mono bg-slate-100 px-1 rounded">{listing.serialNumber}</span></span>
                    <span className="hidden sm:inline-block text-slate-300">•</span>
                    <span>{listing.createdAt}</span>
                  </div>
                </div>
                <div className="w-full sm:w-auto flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteListing(listing.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2 sm:mr-0" />
                    <span className="sm:hidden">Remove</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {listings.length === 0 && (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
            <Send className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="font-bold text-slate-600">No active listings</p>
            <p className="text-sm text-slate-500 mt-1">Create your first listing to help the community</p>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="rounded-2xl border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Confirm Listing</DialogTitle>
            <DialogDescription className="text-slate-500 font-medium">
              Review details before notifying community members.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</p>
              <p className="text-base font-medium text-slate-800">{location}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Window</p>
              <p className="text-base font-medium text-slate-800">
                {availableFrom} to {availableTo}
              </p>
            </div>
            <div className="p-4 bg-[#FFF8F3] rounded-xl border border-[#FFE5D9] mt-2">
              <p className="text-sm text-[#FF6B35] font-bold">
                Your listing will immediately ping verified users in a 3km radius!
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="flex-1 h-12"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmPublish}
              className="flex-1 h-12 bg-gradient-to-r from-[#FF6B35] to-[#FFC857] hover:opacity-90 shadow-md"
            >
              Confirm & Publish
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
