"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Calendar,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  Ticket,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Tag,
  X,
  Save,
  PlusCircle,
  MinusCircle,
  Check,
  FolderPlus,
  Layers,
  AlertTriangle,
  Folder,
} from "lucide-react";
import CloudinaryUploader from "./CloudinaryUploader";
import { notifyLiveContentUpdate } from "@/components/shared/LiveRouteRefresher";
import { parseTicketTiers } from "@/lib/utils";

interface EventFormData {
  _id?: string;
  id?: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  fullDescription?: string;
  date: string;
  time: string;
  location: string;
  city: string;
  venue: string;
  category: string;
  image: string;
  isFeatured: boolean;
  isPast: boolean;
  registrationOpen: boolean;
  ticketLink?: string;
  price?: string;
  ticketTiers?: { name: string; price: string }[];
  agenda: { time: string; activity: string }[];
  order?: number;
}

interface CategoryStat {
  name: string;
  count: number;
}

const DEFAULT_EVENT_FORM: EventFormData = {
  slug: "",
  title: "",
  tagline: "",
  description: "",
  fullDescription: "",
  date: "",
  time: "10:00 AM - 4:00 PM",
  location: "Edinburgh, Scotland",
  city: "Edinburgh",
  venue: "Assembly Rooms, 54 George St",
  category: "",
  image:
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
  isFeatured: false,
  isPast: false,
  registrationOpen: true,
  ticketLink: "",
  price: "",
  ticketTiers: [],
  agenda: [
    { time: "10:00 AM", activity: "Traditional Welcome & Invocational Music" },
    { time: "12:30 PM", activity: "Community Feast & Networking" },
    { time: "02:00 PM", activity: "Cultural Performances & Felicitations" },
  ],
  order: 0,
};

const SCOTTISH_CITIES = [
  "Edinburgh",
  "Glasgow",
  "Aberdeen",
  "Dundee",
  "Stirling",
  "Inverness",
  "Perth",
  "Other",
];

const generateSlugFromTitle = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export default function EventsManager() {
  const [activeSubTab, setActiveSubTab] = useState<"events" | "categories">(
    "events",
  );

  // Events state
  const [events, setEvents] = useState<EventFormData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Upcoming" | "Past">(
    "All",
  );

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventFormData | null>(null);
  const [form, setForm] = useState<EventFormData>(DEFAULT_EVENT_FORM);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [deleteTargetEvent, setDeleteTargetEvent] =
    useState<EventFormData | null>(null);

  // Category Manager states
  const [newCatName, setNewCatName] = useState("");
  const [editingCatName, setEditingCatName] = useState<string | null>(null);
  const [renameCatValue, setRenameCatValue] = useState("");
  const [deleteTargetCat, setDeleteTargetCat] = useState<CategoryStat | null>(
    null,
  );
  const [reassignToCat, setReassignToCat] = useState("");
  const [showQuickAddCat, setShowQuickAddCat] = useState(false);
  const [quickCatInput, setQuickCatInput] = useState("");

  // Toast message
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    if (type === "success") {
      notifyLiveContentUpdate();
    }
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Lock body scroll when any modal is open
  const isAnyModalOpen =
    showModal || Boolean(deleteTargetEvent) || Boolean(deleteTargetCat);
  useEffect(() => {
    if (isAnyModalOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isAnyModalOpen]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const timestamp = Date.now();
      const [eventsRes, catsRes] = await Promise.all([
        fetch(`/api/admin/events?t=${timestamp}`, { cache: "no-store" }),
        fetch(`/api/admin/events/categories?t=${timestamp}`, {
          cache: "no-store",
        }),
      ]);

      const eventsData = await eventsRes.json();
      const catsData = await catsRes.json();

      if (eventsRes.ok && eventsData.events) {
        setEvents(eventsData.events);
      }

      if (catsRes.ok && catsData.categories) {
        setCategories(catsData.categories);
        setCategoryStats(catsData.categoryStats || []);
      }
    } catch (err) {
      console.error("Error loading events data", err);
      showToast("error", "Failed to load events data from server.");
    } finally {
      setLoading(false);
    }
  };

  // --- Category Handlers ---

  const handleCreateCategory = async (catNameToCreate?: string) => {
    const targetName = (catNameToCreate || newCatName).trim();
    if (!targetName) {
      showToast("error", "Category name cannot be empty.");
      return;
    }

    try {
      const res = await fetch("/api/admin/events/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: targetName }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(
          "success",
          data.message || `Category "${targetName}" created!`,
        );
        setNewCatName("");
        setQuickCatInput("");
        setShowQuickAddCat(false);
        fetchAllData();

        // If inside event form, automatically select this new category
        if (showModal) {
          setForm((prev) => ({ ...prev, category: targetName }));
        }
      } else {
        showToast("error", data.message || "Failed to create category.");
      }
    } catch {
      showToast("error", "Network error creating category.");
    }
  };

  const handleRenameCategory = async (oldName: string) => {
    const cleanNew = renameCatValue.trim();
    if (!cleanNew || cleanNew === oldName) {
      setEditingCatName(null);
      return;
    }

    try {
      const res = await fetch("/api/admin/events/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldName, newName: cleanNew }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("success", `Renamed category to "${cleanNew}"`);
        setEditingCatName(null);
        fetchAllData();
      } else {
        showToast("error", data.message || "Failed to rename category.");
      }
    } catch {
      showToast("error", "Network error renaming category.");
    }
  };

  const handleConfirmDeleteCategory = async () => {
    if (!deleteTargetCat) return;

    setActionLoading("delete_cat");
    try {
      const res = await fetch(
        `/api/admin/events/categories?name=${encodeURIComponent(deleteTargetCat.name)}&targetCategory=${encodeURIComponent(reassignToCat)}`,
        { method: "DELETE" },
      );

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("success", data.message || "Category deleted.");
        setDeleteTargetCat(null);
        fetchAllData();
      } else {
        showToast("error", data.message || "Failed to delete category.");
      }
    } catch {
      showToast("error", "Error deleting category.");
    } finally {
      setActionLoading(null);
    }
  };

  // --- Event Modal Handlers ---

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setIsSlugManuallyEdited(false);
    const defaultCat = categories.find((c) => c !== "All") || "General";
    setForm({
      ...DEFAULT_EVENT_FORM,
      category: defaultCat,
      date: new Date().toISOString().split("T")[0], // Default to today's date in YYYY-MM-DD
    });
    setShowModal(true);
  };

  const handleOpenEdit = (evt: EventFormData) => {
    setEditingEvent(evt);
    // If current slug equals generated slug, treat as not manually edited so title changes sync slug
    const isCustom = evt.slug !== generateSlugFromTitle(evt.title);
    setIsSlugManuallyEdited(isCustom);

    const initialTiers =
      evt.ticketTiers && evt.ticketTiers.length > 0
        ? evt.ticketTiers
        : parseTicketTiers(evt.price);

    setForm({
      ...evt,
      price: evt.price || "",
      ticketTiers: initialTiers,
      ticketLink: evt.ticketLink || "",
      agenda:
        evt.agenda && evt.agenda.length > 0
          ? evt.agenda
          : DEFAULT_EVENT_FORM.agenda,
    });
    setShowModal(true);
  };

  // --- Ticket Tiers Handlers ---
  const handleAddTicketTier = () => {
    setForm((prev) => ({
      ...prev,
      ticketTiers: [...(prev.ticketTiers || []), { name: "", price: "" }],
    }));
  };

  const handleRemoveTicketTier = (index: number) => {
    setForm((prev) => {
      const updated = (prev.ticketTiers || []).filter((_, i) => i !== index);
      const summary = updated
        .filter((t) => t.name.trim())
        .map((t) => (t.price.trim() ? `${t.name} - ${t.price}` : t.name))
        .join(" , ");
      return { ...prev, ticketTiers: updated, price: summary };
    });
  };

  const handleUpdateTicketTier = (
    index: number,
    field: "name" | "price",
    value: string
  ) => {
    setForm((prev) => {
      const updated = [...(prev.ticketTiers || [])];
      updated[index] = { ...updated[index], [field]: value };
      const summary = updated
        .filter((t) => t.name.trim())
        .map((t) => (t.price.trim() ? `${t.name} - ${t.price}` : t.name))
        .join(" , ");
      return { ...prev, ticketTiers: updated, price: summary };
    });
  };

  const handleAutoParsePriceString = () => {
    const parsed = parseTicketTiers(form.price);
    if (parsed.length > 0) {
      const summary = parsed
        .filter((t) => t.name.trim())
        .map((t) => (t.price.trim() ? `${t.name} - ${t.price}` : t.name))
        .join(" , ");
      setForm((prev) => ({ ...prev, ticketTiers: parsed, price: summary }));
      showToast("success", `Parsed ${parsed.length} ticket options!`);
    } else {
      showToast("error", "Could not parse ticket options from text.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date.trim() || !form.image.trim()) {
      showToast("error", "Title, Date, and Event Image are required.");
      return;
    }

    if (!form.category.trim()) {
      showToast("error", "Please select or create a Category for this event.");
      return;
    }

    setSaving(true);
    try {
      const method = editingEvent ? "PUT" : "POST";
      const eventId = editingEvent?._id || editingEvent?.id;
      const payload = editingEvent ? { ...form, id: eventId } : form;

      const res = await fetch("/api/admin/events", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(
          "success",
          editingEvent ? "Event updated successfully!" : "New Event published!",
        );
        setShowModal(false);
        fetchAllData();
      } else {
        showToast("error", data.message || "Failed to save event.");
      }
    } catch {
      showToast("error", "Network error while saving event.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (evt: EventFormData) => {
    const eventId = evt._id || evt.id;
    if (!eventId) return;

    setActionLoading(eventId);
    try {
      const res = await fetch(`/api/admin/events?id=${eventId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("success", `Event "${evt.title}" deleted.`);
        setDeleteTargetEvent(null);
        fetchAllData();
      } else {
        showToast("error", data.message || "Failed to delete event.");
      }
    } catch {
      showToast("error", "Network error deleting event.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleRegistration = async (evt: EventFormData) => {
    const eventId = evt._id || evt.id;
    if (!eventId) return;

    const nextState = !evt.registrationOpen;
    setActionLoading(eventId);
    try {
      const res = await fetch("/api/admin/events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: eventId, registrationOpen: nextState }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEvents(
          events.map((e) =>
            (e._id || e.id) === eventId
              ? { ...e, registrationOpen: nextState }
              : e,
          ),
        );
        showToast(
          "success",
          `Registration ${nextState ? "Opened" : "Closed"} for ${evt.title}.`,
        );
      }
    } catch {
      showToast("error", "Error updating registration status.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleTogglePast = async (evt: EventFormData) => {
    const eventId = evt._id || evt.id;
    if (!eventId) return;

    const nextState = !evt.isPast;
    setActionLoading(eventId);
    try {
      const res = await fetch("/api/admin/events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: eventId, isPast: nextState }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEvents(
          events.map((e) =>
            (e._id || e.id) === eventId ? { ...e, isPast: nextState } : e,
          ),
        );
        showToast(
          "success",
          `Event marked as ${nextState ? "Past Event" : "Upcoming Event"}.`,
        );
      }
    } catch {
      showToast("error", "Error updating event status.");
    } finally {
      setActionLoading(null);
    }
  };

  // Agenda handlers
  const handleAddAgendaItem = () => {
    setForm({
      ...form,
      agenda: [...form.agenda, { time: "", activity: "" }],
    });
  };

  const handleRemoveAgendaItem = (index: number) => {
    setForm({
      ...form,
      agenda: form.agenda.filter((_, i) => i !== index),
    });
  };

  const handleAgendaChange = (
    index: number,
    field: "time" | "activity",
    value: string,
  ) => {
    const updated = [...form.agenda];
    updated[index][field] = value;
    setForm({ ...form, agenda: updated });
  };

  // Filtered list
  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity =
      selectedCity === "All" ||
      e.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesCategory =
      selectedCategory === "All" ||
      e.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Upcoming" && !e.isPast) ||
      (statusFilter === "Past" && e.isPast);

    return matchesSearch && matchesCity && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Banner */}
      {toast && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xl transition-all ${
            toast.type === "success"
              ? "bg-emerald-950/80 border border-emerald-500 text-emerald-200"
              : "bg-[#8B1A2B]/80 border border-rose-500 text-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Sub-Tab Bar */}
      <div className="bg-[#121F54] border border-[#1B3A6B] p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#E8C468]" />
            <span>Community Events CMS</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Schedule cultural celebrations, create custom categories, and manage
            ticket links dynamically.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-[#0A1440] p-1 border border-white/10">
            <button
              onClick={() => setActiveSubTab("events")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === "events"
                  ? "bg-gradient-to-r from-[#C9A227] to-[#E8C468] text-[#0A1440] shadow"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>All Events ({events.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab("categories")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === "categories"
                  ? "bg-gradient-to-r from-[#C9A227] to-[#E8C468] text-[#0A1440] shadow"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>
                Categories ({categories.filter((c) => c !== "All").length})
              </span>
            </button>
          </div>

          {activeSubTab === "events" && (
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#C9A227] to-[#E8C468] text-[#0A1440] hover:brightness-110 shadow-lg flex items-center gap-1.5 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: EVENTS LISTING */}
      {/* ========================================================================= */}
      {activeSubTab === "events" && (
        <>
          {/* Search & Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, city, venue..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A1440] border border-white/10 text-white text-xs placeholder-slate-400 focus:outline-none focus:border-[#C9A227]"
              />
            </div>

            {/* City Filter */}
            <div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0A1440] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C9A227]"
              >
                <option value="All">All Scottish Cities</option>
                {SCOTTISH_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0A1440] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C9A227]"
              >
                <option value="All">All Event Categories</option>
                {categories
                  .filter((c) => c !== "All")
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex rounded-xl bg-[#0A1440] p-1 border border-white/10">
              {(["All", "Upcoming", "Past"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === st
                      ? "bg-gradient-to-r from-[#C9A227] to-[#E8C468] text-[#0A1440] font-bold shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin mx-auto" />
              <p className="text-xs text-slate-400">
                Loading events from database...
              </p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="py-20 text-center bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-8 space-y-3">
              <Calendar className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-serif font-bold text-white">
                No events found
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No events match your selected filters. Click &quot;Add
                Event&quot; above to create one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((evt) => {
                const eventId = evt._id || evt.id || evt.slug;
                const isProcessing = actionLoading === eventId;

                return (
                  <div
                    key={eventId}
                    className="group bg-[#121F54] border border-[#1B3A6B] hover:border-[#C9A227] rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Top Image & Badges */}
                    <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                      <Image
                        src={evt.image}
                        alt={evt.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1440] via-transparent to-transparent opacity-80" />

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[#1B3A6B] text-[#E8C468] border border-[#C9A227]/40 shadow-sm">
                          {evt.category || "General"}
                        </span>
                        {evt.isFeatured && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[#C9A227] text-[#0A1440] shadow-sm">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${
                            evt.isPast
                              ? "bg-slate-800 text-slate-300"
                              : "bg-emerald-900/90 text-emerald-200 border border-emerald-500/30"
                          }`}
                        >
                          {evt.isPast ? "Past Event" : "Upcoming"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="text-base font-serif font-bold text-white group-hover:text-[#E8C468] transition-colors line-clamp-2">
                          {evt.title}
                        </h3>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {evt.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/10 space-y-1.5 text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                          <span>{evt.date}</span>
                          {evt.time && (
                            <span className="text-slate-400">• {evt.time}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#E8C468] shrink-0" />
                          <span className="truncate">
                            {evt.venue || evt.location} ({evt.city})
                          </span>
                        </div>

                        {evt.price && (
                          <div className="flex items-center gap-2">
                            <Ticket className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="text-emerald-300 font-semibold">
                              {evt.price}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="p-5 pt-0 border-t border-white/10 mt-3 flex items-center justify-between">
                      {/* Registration Status Toggle */}
                      <button
                        onClick={() => handleToggleRegistration(evt)}
                        disabled={isProcessing}
                        title={
                          evt.registrationOpen
                            ? "Click to close registration"
                            : "Click to open registration"
                        }
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-colors ${
                          evt.registrationOpen
                            ? "text-emerald-300 hover:text-emerald-200 border-emerald-500/30 bg-emerald-900/20"
                            : "text-amber-300 hover:text-amber-200 border-amber-500/30 bg-amber-900/20"
                        }`}
                      >
                        {evt.registrationOpen ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <XCircle className="w-3 h-3 text-amber-400" />
                        )}
                        <span>
                          {evt.registrationOpen ? "Reg Open" : "Reg Closed"}
                        </span>
                      </button>

                      <div className="flex items-center gap-2">
                        {/* Toggle Past */}
                        <button
                          onClick={() => handleTogglePast(evt)}
                          disabled={isProcessing}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                          title={
                            evt.isPast ? "Mark as Upcoming" : "Mark as Past"
                          }
                        >
                          <Clock className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(evt)}
                          className="p-2 rounded-lg bg-[#1B3A6B] hover:bg-[#C9A227] hover:text-[#0A1440] text-slate-200 text-xs flex items-center gap-1 transition-colors"
                          title="Edit event"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => setDeleteTargetEvent(evt)}
                          className="p-2 rounded-lg bg-[#8B1A2B]/40 hover:bg-[#8B1A2B] text-rose-300 hover:text-white text-xs flex items-center gap-1 transition-colors"
                          title="Delete event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: EVENT CATEGORY MANAGEMENT */}
      {/* ========================================================================= */}
      {activeSubTab === "categories" && (
        <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
          <div>
            <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#E8C468]" />
              <span>Event Categories</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Create and manage event categories. Categories created here will
              appear in the event creation dropdown and filter menus.
            </p>
          </div>

          {/* Create Category Input */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Traditional Folk Gala, Youth Summit, Workshop..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreateCategory();
                }
              }}
            />
            <button
              onClick={() => handleCreateCategory()}
              className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#C9A227] to-[#E8C468] text-[#0A1440] hover:brightness-110 shadow-lg flex items-center justify-center gap-1.5 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Category</span>
            </button>
          </div>

          {/* Categories Grid */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Existing Event Categories ({categoryStats.length})
            </h4>

            {categoryStats.length === 0 ? (
              <div className="p-8 text-center bg-[#0A1440] border border-white/10 rounded-xl text-slate-400 text-xs">
                No custom event categories created yet. Add one above!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryStats.map((stat) => {
                  const cat = stat.name;
                  const isEditing = editingCatName === cat;

                  return (
                    <div
                      key={cat}
                      className="p-4 rounded-xl bg-[#0A1440] border border-white/10 hover:border-[#C9A227]/40 flex items-center justify-between transition-all"
                    >
                      {isEditing ? (
                        <div className="flex items-center gap-2 w-full">
                          <input
                            type="text"
                            value={renameCatValue}
                            onChange={(e) => setRenameCatValue(e.target.value)}
                            autoFocus
                            className="flex-1 px-2.5 py-1.5 bg-[#121F54] border border-[#C9A227] rounded-lg text-xs text-white"
                          />
                          <button
                            onClick={() => handleRenameCategory(cat)}
                            className="px-2.5 py-1.5 bg-[#C9A227] text-[#0A1440] font-bold rounded-lg text-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCatName(null)}
                            className="px-2.5 py-1.5 bg-slate-700 text-slate-200 rounded-lg text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-xs sm:text-sm text-white">
                              {cat}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1B3A6B] text-[#E8C468] font-bold">
                              {stat.count} events
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingCatName(cat);
                                setRenameCatValue(cat);
                              }}
                              className="p-1.5 rounded-lg bg-[#1B3A6B] hover:bg-[#C9A227] hover:text-[#0A1440] text-slate-300 text-xs transition-colors"
                              title="Rename category"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteTargetCat(stat);
                                const otherCat = categories.find(
                                  (c) => c !== "All" && c !== cat,
                                );
                                setReassignToCat(otherCat || "General");
                              }}
                              className="p-1.5 rounded-lg bg-[#8B1A2B]/30 hover:bg-[#8B1A2B] text-rose-300 hover:text-white text-xs transition-colors"
                              title="Delete category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Delete Category Confirmation Dialog */}
          {deleteTargetCat && (
            <div className="p-5 rounded-2xl bg-[#8B1A2B]/20 border border-[#8B1A2B] space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-[#E8C468] text-xs font-bold uppercase">
                <AlertTriangle className="w-4 h-4 text-[#8B1A2B]" />
                <span>
                  Delete Event Category &quot;{deleteTargetCat.name}&quot;
                </span>
              </div>

              <p className="text-xs text-slate-300">
                This category currently has{" "}
                <strong className="text-white">
                  {deleteTargetCat.count} event(s)
                </strong>
                .
              </p>

              {categories.filter(
                (c) => c !== "All" && c !== deleteTargetCat.name,
              ).length > 0 && (
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <span>Reassign events to:</span>
                  <select
                    value={reassignToCat}
                    onChange={(e) => setReassignToCat(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-[#0A1440] border border-white/20 text-white text-xs"
                  >
                    {categories
                      .filter((c) => c !== "All" && c !== deleteTargetCat.name)
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setDeleteTargetCat(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteCategory}
                  disabled={Boolean(actionLoading)}
                  className="px-4 py-1.5 rounded-lg bg-[#8B1A2B] hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  {actionLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  <span>Confirm Delete</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE / EDIT EVENT */}
      {/* ========================================================================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto p-4 sm:p-6 md:p-8 flex justify-center items-start">
          <div className="relative bg-[#121F54] border border-[#C9A227]/50 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl gold-glow my-4 sm:my-8 max-h-none">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#E8C468]" />
                <span>
                  {editingEvent
                    ? "Edit Community Event"
                    : "Create New Community Event"}
                </span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Event Poster Photo */}
              <CloudinaryUploader
                currentImageUrl={form.image}
                onUploadSuccess={(url) => setForm({ ...form, image: url })}
                label="Event Poster / Cover Photo (Cloudinary / URL) *"
                folder="str-website/events"
              />

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm((prev) => {
                        const newSlug = !isSlugManuallyEdited
                          ? generateSlugFromTitle(val)
                          : prev.slug;
                        return { ...prev, title: val, slug: newSlug };
                      });
                    }}
                    placeholder="e.g. Scotland Grand Tamil Pongal Vizha 2026"
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                      URL Slug *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const synced = generateSlugFromTitle(form.title);
                        setForm((prev) => ({ ...prev, slug: synced }));
                        setIsSlugManuallyEdited(false);
                      }}
                      className="text-[11px] font-semibold text-[#E8C468] hover:text-[#C9A227] flex items-center gap-1 transition-colors cursor-pointer"
                      title="Re-generate slug from current Event Title"
                    >
                      <Sparkles className="w-3 h-3 text-[#C9A227]" />
                      <span>Auto-generate from Title</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => {
                      setIsSlugManuallyEdited(true);
                      setForm({ ...form, slug: e.target.value });
                    }}
                    placeholder="slug path auto generate here"
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0A1440] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C9A227]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Path: /events/{form.slug || "..."}
                  </p>
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                  Tagline / Sub-heading (Optional)
                </label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) =>
                    setForm({ ...form, tagline: e.target.value })
                  }
                  placeholder="e.g. Celebrating Heritage, Unity & Cultural Pride"
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              {/* Dynamic Category Selector */}
              <div className="p-4 rounded-xl bg-[#0A1440] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#E8C468] uppercase tracking-wider">
                    Event Category *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowQuickAddCat(!showQuickAddCat)}
                    className="text-xs text-[#E8C468] hover:underline font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>
                      {showQuickAddCat
                        ? "Choose Existing Category"
                        : "Create New Category"}
                    </span>
                  </button>
                </div>

                {showQuickAddCat ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={quickCatInput}
                      onChange={(e) => setQuickCatInput(e.target.value)}
                      placeholder="Type new category name..."
                      className="flex-1 px-3 py-2 rounded-lg bg-[#121F54] border border-[#C9A227] text-white text-xs focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleCreateCategory(quickCatInput);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleCreateCategory(quickCatInput)}
                      className="px-3 py-2 bg-[#C9A227] text-[#0A1440] font-bold rounded-lg text-xs"
                    >
                      Add &amp; Select
                    </button>
                  </div>
                ) : (
                  <div>
                    {categories.filter((c) => c !== "All").length > 0 ? (
                      <select
                        value={form.category}
                        onChange={(e) =>
                          setForm({ ...form, category: e.target.value })
                        }
                        required
                        className="w-full px-3 py-2 rounded-lg bg-[#121F54] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C9A227]"
                      >
                        <option value="">-- Select an Event Category --</option>
                        {categories
                          .filter((c) => c !== "All")
                          .map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                      </select>
                    ) : (
                      <div className="flex items-center justify-between text-xs text-amber-300">
                        <span>No categories found in system yet.</span>
                        <button
                          type="button"
                          onClick={() => setShowQuickAddCat(true)}
                          className="font-bold underline text-[#E8C468]"
                        >
                          Create one now
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* City, Venue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                    City *
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0A1440] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C9A227]"
                  >
                    {SCOTTISH_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.venue}
                    onChange={(e) =>
                      setForm({ ...form, venue: e.target.value })
                    }
                    placeholder="Assembly Rooms, 54 George St"
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0A1440] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
              </div>

              {/* Date Picker & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                    Event Date (Date Picker) *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A1440] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    placeholder="10:00 AM - 4:00 PM"
                    className="w-full px-3 py-2 rounded-lg bg-[#0A1440] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
              </div>

              {/* Ticket Prices & Rates (Passes & Options) */}
              <div className="p-4 rounded-xl bg-[#0A1440] border border-white/10 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="block text-xs font-bold text-[#E8C468] uppercase tracking-wider flex items-center gap-1.5">
                    <Ticket className="w-4 h-4 text-[#C9A227]" />
                    <span>Ticket Prices &amp; Rates (Passes &amp; Options)</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAutoParsePriceString}
                      className="text-[11px] font-semibold text-[#E8C468] hover:text-[#C9A227] flex items-center gap-1 transition-colors"
                      title="Auto-convert raw comma list into structured rows"
                    >
                      <Sparkles className="w-3 h-3 text-[#C9A227]" />
                      <span>Auto-parse Text</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAddTicketTier}
                      className="px-2.5 py-1 text-xs font-bold text-[#0A1440] bg-gradient-to-r from-[#C9A227] to-[#E8C468] rounded-lg hover:brightness-110 flex items-center gap-1 shadow transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Ticket Option</span>
                    </button>
                  </div>
                </div>

                {form.ticketTiers && form.ticketTiers.length > 0 ? (
                  <div className="space-y-2">
                    {form.ticketTiers.map((tier, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={tier.name}
                          onChange={(e) =>
                            handleUpdateTicketTier(idx, "name", e.target.value)
                          }
                          placeholder="Option Name (e.g. Adult ticket rate, Couple pass, Family ticket...)"
                          className="flex-1 px-3 py-2 rounded-lg bg-[#121F54] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C9A227]"
                        />
                        <input
                          type="text"
                          value={tier.price}
                          onChange={(e) =>
                            handleUpdateTicketTier(idx, "price", e.target.value)
                          }
                          placeholder="Rate (e.g. £15, £30, Free...)"
                          className="w-28 sm:w-36 px-3 py-2 rounded-lg bg-[#121F54] border border-white/10 text-[#E8C468] font-bold text-xs focus:outline-none focus:border-[#C9A227]"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveTicketTier(idx)}
                          className="p-2 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-[#8B1A2B]/40 transition-colors"
                          title="Remove option"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    No ticket passes added yet. Click &quot;Add Ticket Option&quot; above to create options (e.g. Adult ticket rate - £15, Couple pass - £30).
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Raw Price Text / Summary (Auto-synced)
                    </label>
                    <input
                      type="text"
                      value={form.price || ""}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      placeholder="Adult ticket rate - 15 , Couple pass - 30 , Children under 5 - Free"
                      className="w-full px-3 py-2 rounded-lg bg-[#121F54] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C9A227]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Ticket / Booking Link (Optional)
                    </label>
                    <input
                      type="text"
                      value={form.ticketLink || ""}
                      onChange={(e) =>
                        setForm({ ...form, ticketLink: e.target.value })
                      }
                      placeholder="e.g. /membership/join or external booking URL"
                      className="w-full px-3 py-2 rounded-lg bg-[#121F54] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C9A227]"
                    />
                  </div>
                </div>
              </div>

              {/* Status Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#0A1440] p-4 rounded-xl border border-white/10">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
                  <input
                    type="checkbox"
                    checked={form.registrationOpen}
                    onChange={(e) =>
                      setForm({ ...form, registrationOpen: e.target.checked })
                    }
                    className="rounded text-[#C9A227] focus:ring-[#C9A227]"
                  />
                  <span>Registration Open</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) =>
                      setForm({ ...form, isFeatured: e.target.checked })
                    }
                    className="rounded text-[#C9A227] focus:ring-[#C9A227]"
                  />
                  <span>Featured Flagship Event</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
                  <input
                    type="checkbox"
                    checked={form.isPast}
                    onChange={(e) =>
                      setForm({ ...form, isPast: e.target.checked })
                    }
                    className="rounded text-[#C9A227] focus:ring-[#C9A227]"
                  />
                  <span>Past Event (Archive)</span>
                </label>
              </div>

              {/* Short Summary Description */}
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                  Short Summary / Card Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Summary displayed on event cards and previews..."
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              {/* Full Details */}
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                  Full Event Details (Optional)
                </label>
                <textarea
                  rows={4}
                  value={form.fullDescription}
                  onChange={(e) =>
                    setForm({ ...form, fullDescription: e.target.value })
                  }
                  placeholder="Full background, what to expect, attire, feast arrangements..."
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              {/* Interactive Agenda Timeline Builder */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#E8C468] uppercase tracking-wider">
                    Event Schedule / Agenda Breakdown (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddAgendaItem}
                    className="text-xs font-bold text-[#E8C468] hover:text-white flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Agenda Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {form.agenda.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-[#0A1440] p-2.5 rounded-lg border border-white/10"
                    >
                      <input
                        type="text"
                        value={item.time}
                        onChange={(e) =>
                          handleAgendaChange(idx, "time", e.target.value)
                        }
                        placeholder="Time (e.g. 10:00 AM)"
                        className="w-36 px-2.5 py-1.5 rounded bg-[#121F54] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C9A227]"
                      />
                      <input
                        type="text"
                        value={item.activity}
                        onChange={(e) =>
                          handleAgendaChange(idx, "activity", e.target.value)
                        }
                        placeholder="Activity (e.g. Traditional Pongal Pot Preparation)"
                        className="flex-1 px-2.5 py-1.5 rounded bg-[#121F54] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C9A227]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAgendaItem(idx)}
                        className="p-1.5 text-rose-400 hover:text-rose-200 rounded"
                        title="Remove item"
                      >
                        <MinusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-lg text-slate-300 hover:text-white bg-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#C9A227] to-[#E8C468] text-[#0A1440] hover:brightness-110 disabled:opacity-70 flex items-center gap-2"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>
                    {saving
                      ? "Saving..."
                      : editingEvent
                        ? "Save Event Updates"
                        : "Publish Event"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CONFIRM DELETE EVENT */}
      {/* ========================================================================= */}
      {deleteTargetEvent && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto p-4 sm:p-6 md:p-8 flex justify-center items-start">
          <div className="relative bg-[#121F54] border border-[#8B1A2B] rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl gold-glow my-4 sm:my-8 max-h-none">
            <div className="flex items-center gap-2 text-rose-400 text-sm font-bold uppercase">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <span>Delete Event Confirmation</span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              Are you sure you want to permanently delete event{" "}
              <strong className="text-white">
                &quot;{deleteTargetEvent.title}&quot;
              </strong>
              ? This will also purge its cover photo from Cloudinary CDN.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setDeleteTargetEvent(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTargetEvent)}
                disabled={Boolean(actionLoading)}
                className="px-5 py-2 rounded-lg bg-[#8B1A2B] hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5"
              >
                {actionLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Delete Forever</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
