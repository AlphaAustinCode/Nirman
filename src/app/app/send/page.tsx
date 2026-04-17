"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  Send,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MapWrapper from "@/components/MapWrapper";
import { Marker } from "react-map-gl";
import { apiFetch } from "@/lib/client-auth";

type Listing = {
  _id: string;
  location_label: string;
  available_from: string;
  available_to: string;
  status: "ACTIVE" | "RESERVED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  serial_number: string;
  location: {
    coordinates: [number, number];
  };
};

function getDefaultCoordinates() {
  return { latitude: 28.6139, longitude: 77.209 };
}

export default function SenderPage() {
  const [location, setLocation] = useState("");
  const [autoDetected, setAutoDetected] = useState(false);
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [coordinates, setCoordinates] = useState(getDefaultCoordinates());

  const loadListings = async () => {
    const response = await apiFetch<Listing[]>("/api/listings/mine");
    setListings(response.data || []);
  };

  useEffect(() => {
    loadListings().catch(() => {
      toast.error("Unable to load your listings.");
    });
  }, []);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not available in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setAutoDetected(true);
        setLocation("Current GPS Location");
        toast.success("Location auto-detected via GPS.");
      },
      () => {
        toast.error("Unable to access your live location.");
      }
    );
  };

  const handlePublishListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !availableFrom || !availableTo) {
      toast.error("Please fill all required fields");
      return;
    }
    setShowConfirmDialog(true);
  };

  const listingMarkers = useMemo(
    () =>
      listings.filter((listing) => listing.location?.coordinates?.length === 2),
    [listings]
  );

  const confirmPublish = async () => {
    try {
      setSubmitting(true);

      const today = new Date().toISOString().slice(0, 10);
      await apiFetch("/api/listings", {
        method: "POST",
        body: JSON.stringify({
          location_label: location,
          available_from: `${today}T${availableFrom}:00`,
          available_to: `${today}T${availableTo}:00`,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          radius_km: 3,
        }),
      });

      setLocation("");
      setAvailableFrom("");
      setAvailableTo("");
      setAutoDetected(false);
      setShowConfirmDialog(false);
      await loadListings();
      toast.success(
        "Cylinder listed successfully. Nearby users can now discover it."
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to publish listing."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteListing = async (id: string) => {
    try {
      await apiFetch(`/api/listings/${id}`, { method: "DELETE" });
      setListings((current) => current.filter((listing) => listing._id !== id));
      toast.success("Listing removed from the community board.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to remove listing."
      );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
          List Your Cylinder
        </h2>
        <p className="text-slate-500 font-medium pb-2 border-b border-slate-200">
          Be a hero. Help your community by safely lending out your spare LPG
          capacity.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-5 border-[#FFE5D9] shadow-xl shadow-[#FFE5D9]/40 bg-white">
          <CardHeader>
            <CardTitle className="text-slate-800">Create New Listing</CardTitle>
            <CardDescription className="text-slate-500">
              Pick the time and place for the exchange
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePublishListing} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="location" className="text-slate-700 font-bold">
                  Exchange Location
                </Label>
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
                  <Label htmlFor="from" className="text-slate-700 font-bold">
                    Available From
                  </Label>
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
                  <Label htmlFor="to" className="text-slate-700 font-bold">
                    Available To
                  </Label>
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
                      <li>Use in-app request confirmation before handover</li>
                      <li>Double check the cylinder seal before exchange</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#FF6B35] to-[#FFC857] hover:opacity-90 shadow-md text-base"
              >
                <Send className="mr-2 h-4 w-4" />
                Publish to Community Map
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-7 border-slate-200 shadow-lg overflow-hidden flex flex-col">
          <CardHeader className="bg-slate-50 border-b border-slate-100 flex-none pb-4">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-slate-500" /> Map Picker & Active
              Listings
            </CardTitle>
            <CardDescription>
              Your current listing markers and exchange zone
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1 min-h-[300px] h-[50dvh]">
            <MapWrapper
              initialViewState={{
                longitude: coordinates.longitude,
                latitude: coordinates.latitude,
                zoom: 11,
              }}
            >
              {listingMarkers.map((listing) => (
                <Marker
                  key={listing._id}
                  longitude={listing.location.coordinates[0]}
                  latitude={listing.location.coordinates[1]}
                >
                  <div className="rounded-full bg-[#FF6B35] p-2 text-white shadow-lg">
                    <Send className="h-4 w-4" />
                  </div>
                </Marker>
              ))}
            </MapWrapper>
          </CardContent>
        </Card>
      </div>

      <h3 className="text-xl font-bold text-slate-800 mt-10 mb-4 border-b border-slate-200 pb-2">
        Your Cylinder Listings
      </h3>
      <div className="space-y-4">
        {listings.map((listing) => (
          <Card
            key={listing._id}
            className={`border-l-4 shadow-sm transition-all hover:shadow-md ${
              listing.status === "ACTIVE"
                ? "border-l-[#4CAF50] bg-white"
                : "border-l-slate-300 bg-slate-50"
            }`}
          >
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                    listing.status === "ACTIVE"
                      ? "bg-gradient-to-br from-[#FF6B35] to-[#FFC857]"
                      : "bg-slate-200"
                  }`}
                >
                  <Send
                    className={`h-6 w-6 ${
                      listing.status === "ACTIVE"
                        ? "text-white"
                        : "text-slate-400"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p
                        className={`font-bold text-lg ${
                          listing.status === "ACTIVE"
                            ? "text-slate-800"
                            : "text-slate-500"
                        }`}
                      >
                        {listing.location_label}
                      </p>
                    </div>
                    <Badge
                      className={
                        listing.status === "ACTIVE"
                          ? "bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white shadow-sm px-2"
                          : "bg-slate-200 text-slate-600 shadow-sm px-2"
                      }
                    >
                      {listing.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 font-medium">
                    <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(listing.available_from).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(listing.available_to).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span>
                      Serial:{" "}
                      <span className="font-mono bg-slate-100 px-1 rounded">
                        {listing.serial_number}
                      </span>
                    </span>
                    <span>{new Date(listing.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className="w-full sm:w-auto flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteListing(listing._id)}
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
            <p className="text-sm text-slate-500 mt-1">
              Create your first listing to help the community
            </p>
          </div>
        )}
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="rounded-2xl border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Confirm Listing
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-medium">
              Review details before notifying community members.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Location
              </p>
              <p className="text-base font-medium text-slate-800">{location}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Window
              </p>
              <p className="text-base font-medium text-slate-800">
                {availableFrom} to {availableTo}
              </p>
            </div>
            <div className="p-4 bg-[#FFF8F3] rounded-xl border border-[#FFE5D9] mt-2">
              <p className="text-sm text-[#FF6B35] font-bold">
                Your listing will become visible within a 3km discovery radius.
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
              disabled={submitting}
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
