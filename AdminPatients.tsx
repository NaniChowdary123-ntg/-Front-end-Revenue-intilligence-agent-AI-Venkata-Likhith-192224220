// src/layouts/admin/AdminPatients.tsx
import React, { useEffect, useMemo, useState } from "react";

import {
  Users as UsersIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  Phone as PhoneIcon,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const ADMIN_API = `${API_BASE}/api/admin`;

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

type PatientRow = {
  id: string;
  name: string;
  phone: string | null;
  lastVisit: string | null;
  status: string;
};

export const AdminPatients: React.FC = () => {
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${ADMIN_API}/patients`, {
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        setPatients(data.items || []);
      } catch (err) {
        console.error("AdminPatients error:", err);
        setError("Failed to load patients.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return patients;
    const q = search.toLowerCase();
    return patients.filter((p) => {
      return (
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        (p.phone || "").toLowerCase().includes(q)
      );
    });
  }, [patients, search]);

  return (
    <>
      <section className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 px-3 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              <UsersIcon size={14} />
              <span>Patients</span>
            </div>
            <h1 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-50">
              Patient directory
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Quickly search and review patient records across your clinic.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <button className="inline-flex items-center gap-1 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 px-3 py-1.5 text-slate-700 dark:text-slate-200">
              <FilterIcon size={14} />
              Filters
            </button>
            <button className="inline-flex items-center gap-1 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 px-3 py-1.5 font-semibold">
              + New patient
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:max-w-md mb-2">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 dark:text-slate-500">
            <SearchIcon size={14} />
          </span>
          <input
            type="text"
            placeholder="Search by name, phone, or patient ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 pl-8 pr-3 py-2 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900/5 dark:focus:ring-white/10"
          />
        </div>

        {error && (
          <p className="text-xs text-rose-500 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        {/* List */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-900 bg-white/90 dark:bg-slate-950/90 shadow-sm divide-y divide-slate-100/80 dark:divide-slate-900/80">
          {loading ? (
            <div className="px-4 py-4 text-xs text-slate-400 text-center">
              Loading patients...
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-4 py-4 text-xs text-slate-400 text-center">
              No patients found.
            </div>
          ) : (
            filtered.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/80 dark:hover:bg-slate-900/80"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {p.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ID: {p.id} • Last visit: {p.lastVisit || "—"}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span
                    className={`px-2 py-0.5 rounded-full font-semibold ${
                      p.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200 border border-emerald-500/30"
                        : "bg-slate-900 text-slate-50 dark:bg-slate-100 dark:text-slate-950"
                    }`}
                  >
                    {p.status}
                  </span>
                  <button className="inline-flex items-center gap-1 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 px-2.5 py-1 text-slate-700 dark:text-slate-200">
                    <PhoneIcon size={12} />
                    {p.phone || "No phone"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
};
