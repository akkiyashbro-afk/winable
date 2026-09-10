import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { getCasesFn, downloadExcelFn } from "@/components/winsable/cases";
import {
  getRecoveriesFn,
  saveRecoveryFn,
  deleteRecoveryFn,
  toggleRecoveryFn,
  reorderRecoveriesFn,
} from "@/components/winsable/recoveries";

export const Route = createFileRoute("/admin/")({
  component: AdminPage,
});

const PASSWORD_KEY = "winsable-admin-auth";
const DEFAULT_PASSWORD = "winsable2026";

interface Recovery {
  _id?: string;
  name: string;
  role: string;
  username: string;
  platform: string;
  followers: string;
  verified: boolean;
  avatar: string;
  recoveryType: string;
  recoveryDate: string;
  popupId?: string;
  enabled: boolean;
  order: number;
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DEFAULT_PASSWORD) {
      sessionStorage.setItem(PASSWORD_KEY, "1");
      onLogin();
    } else {
      setError("Wrong password");
      setPassword("");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <img
            src="/logo-symbol.jpg"
            alt="WinsAble"
            className="mx-auto mb-4 h-16 w-16 rounded-lg"
          />
          <h1 className="display text-2xl">Admin Panel</h1>
          <p className="mt-2 text-sm text-white/40">Enter password to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Password"
            autoFocus
            className="w-full rounded-lg border border-white/10 bg-surface px-4 py-3 text-foreground placeholder:text-white/30 focus:border-gold/50 focus:outline-none"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-gold py-3 font-semibold text-background transition-colors hover:bg-gold-dim"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-white/20">Default password: winsable2026</p>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [tab, setTab] = useState<"recoveries" | "cases">("recoveries");

  const [cases, setCases] = useState<any[]>([]);
  const [casesLoading, setCasesLoading] = useState(false);
  const [casesError, setCasesError] = useState("");
  const [excelLoading, setExcelLoading] = useState(false);

  const [recoveries, setRecoveries] = useState<Recovery[]>([]);
  const [recoveriesLoading, setRecoveriesLoading] = useState(false);
  const [recoveriesError, setRecoveriesError] = useState("");
  const [editingRecovery, setEditingRecovery] = useState<Recovery | null>(null);
  const [newRecovery, setNewRecovery] = useState(false);
  const [recoverySearch, setRecoverySearch] = useState("");
  const [recoveryPlatformFilter, setRecoveryPlatformFilter] = useState("");
  const [recoveryEnabledFilter, setRecoveryEnabledFilter] = useState<"all" | "enabled" | "disabled">("all");

  const loadRecoveries = useCallback(async () => {
    setRecoveriesLoading(true);
    setRecoveriesError("");
    const result = await getRecoveriesFn();
    if (result.ok) {
      setRecoveries(result.recoveries);
    } else {
      setRecoveriesError(result.error || "Failed to load recoveries");
    }
    setRecoveriesLoading(false);
  }, []);

  const loadCases = useCallback(async () => {
    setCasesLoading(true);
    setCasesError("");
    const result = await getCasesFn();
    if (result.ok) {
      setCases(result.cases);
    } else {
      setCasesError(result.error || "Failed to load cases");
    }
    setCasesLoading(false);
  }, []);

  useEffect(() => {
    loadRecoveries();
  }, [loadRecoveries]);

  useEffect(() => {
    if (tab === "cases" && cases.length === 0 && !casesLoading) {
      loadCases();
    }
  }, [tab, cases.length, casesLoading, loadCases]);

  const handleLogout = () => {
    sessionStorage.removeItem(PASSWORD_KEY);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
        <div className="shell flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-symbol.jpg" alt="" className="h-8 w-8 rounded-sm" />
            <span className="display text-lg">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-white/40 hover:text-foreground">
              View Site
            </a>
            <button onClick={handleLogout} className="text-sm text-white/40 hover:text-red-400">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/[0.06]">
        <div className="shell flex gap-1 py-2">
          {(["recoveries", "cases"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setEditingRecovery(null);
                setNewRecovery(false);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
                tab === t ? "bg-gold/10 text-gold" : "text-white/40 hover:text-white/70"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="shell py-8">
        {/* ---- RECOVERIES TAB ---- */}
        {tab === "recoveries" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="display text-2xl">Recoveries ({recoveries.length})</h2>
                {recoveriesError && (
                  <p className="mt-1 text-sm text-red-400">{recoveriesError}</p>
                )}
              </div>
              <button
                onClick={() => {
                  setNewRecovery(true);
                  setEditingRecovery({
                    name: "",
                    role: "",
                    username: "",
                    platform: "Instagram",
                    followers: "",
                    verified: true,
                    avatar: "",
                    recoveryType: "",
                    recoveryDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                    enabled: true,
                    order: recoveries.length,
                  });
                }}
                className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-background hover:bg-gold-dim"
              >
                + Add Recovery
              </button>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-3">
              <input
                value={recoverySearch}
                onChange={(e) => setRecoverySearch(e.target.value)}
                placeholder="Search name, username..."
                className="w-full max-w-xs rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground placeholder:text-white/30 focus:border-gold/50 focus:outline-none"
              />
              <select
                value={recoveryPlatformFilter}
                onChange={(e) => setRecoveryPlatformFilter(e.target.value)}
                className="rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
              >
                <option value="">All Platforms</option>
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
                <option value="X / Twitter">X / Twitter</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Spotify">Spotify</option>
                <option value="Substack">Substack</option>
                <option value="AngelList">AngelList</option>
              </select>
              <select
                value={recoveryEnabledFilter}
                onChange={(e) => setRecoveryEnabledFilter(e.target.value as any)}
                className="rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>

            {/* Edit form */}
            {editingRecovery && (
              <div className="mb-8 rounded-xl border border-gold/20 bg-surface p-6">
                <h3 className="mb-4 text-sm font-semibold text-gold">
                  {newRecovery ? "New Recovery" : "Edit Recovery"}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-white/40">Name *</label>
                    <input
                      value={editingRecovery.name}
                      onChange={(e) => setEditingRecovery({ ...editingRecovery, name: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-white/40">Role</label>
                    <input
                      value={editingRecovery.role}
                      onChange={(e) => setEditingRecovery({ ...editingRecovery, role: e.target.value })}
                      placeholder="e.g. Influencer, Creator"
                      className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 mt-4">
                  <div>
                    <label className="mb-1 block text-xs text-white/40">Username *</label>
                    <input
                      value={editingRecovery.username}
                      onChange={(e) => setEditingRecovery({ ...editingRecovery, username: e.target.value })}
                      placeholder="@username"
                      className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-white/40">Platform *</label>
                    <select
                      value={editingRecovery.platform}
                      onChange={(e) => setEditingRecovery({ ...editingRecovery, platform: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                    >
                      {["Instagram", "YouTube", "X / Twitter", "LinkedIn", "Spotify", "Substack", "AngelList", "TikTok", "Facebook", "Other"].map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 mt-4">
                  <div>
                    <label className="mb-1 block text-xs text-white/40">Followers</label>
                    <input
                      value={editingRecovery.followers}
                      onChange={(e) => setEditingRecovery({ ...editingRecovery, followers: e.target.value })}
                      placeholder="e.g. 120K"
                      className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-white/40">Recovery Type</label>
                    <input
                      value={editingRecovery.recoveryType}
                      onChange={(e) => setEditingRecovery({ ...editingRecovery, recoveryType: e.target.value })}
                      placeholder="e.g. Account Takeover"
                      className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 mt-4">
                  <div>
                    <label className="mb-1 block text-xs text-white/40">Recovery Date</label>
                    <input
                      value={editingRecovery.recoveryDate}
                      onChange={(e) => setEditingRecovery({ ...editingRecovery, recoveryDate: e.target.value })}
                      placeholder="Jun 3, 2026"
                      className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-white/40">Popup/Review ID</label>
                    <input
                      value={editingRecovery.popupId || ""}
                      onChange={(e) => setEditingRecovery({ ...editingRecovery, popupId: e.target.value })}
                      placeholder="review-name"
                      className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="mb-1 block text-xs text-white/40">Profile Image URL</label>
                  <input
                    value={editingRecovery.avatar}
                    onChange={(e) => setEditingRecovery({ ...editingRecovery, avatar: e.target.value })}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                  />
                  {editingRecovery.avatar && (
                    <div className="mt-2 flex items-center gap-3">
                      <img
                        src={editingRecovery.avatar}
                        alt="Preview"
                        className="size-12 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <span className="text-xs text-white/30">Preview</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editingRecovery.verified}
                      onChange={(e) => setEditingRecovery({ ...editingRecovery, verified: e.target.checked })}
                      className="accent-gold"
                    />
                    Verified
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editingRecovery.enabled}
                      onChange={(e) => setEditingRecovery({ ...editingRecovery, enabled: e.target.checked })}
                      className="accent-gold"
                    />
                    Enabled
                  </label>
                </div>
                <div className="mt-4">
                  <label className="mb-1 block text-xs text-white/40">Display Order</label>
                  <input
                    type="number"
                    value={editingRecovery.order}
                    onChange={(e) => setEditingRecovery({ ...editingRecovery, order: parseInt(e.target.value) || 0 })}
                    className="w-32 rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                  />
                </div>
                <div className="mt-6 flex gap-2">
                  <button
                    onClick={async () => {
                      if (!editingRecovery.name || !editingRecovery.username || !editingRecovery.platform) return;
                      const result = await saveRecoveryFn({ data: editingRecovery as any });
                      if (result.ok) {
                        await loadRecoveries();
                        setEditingRecovery(null);
                        setNewRecovery(false);
                      }
                    }}
                    className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-background hover:bg-gold-dim"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingRecovery(null);
                      setNewRecovery(false);
                    }}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/50 hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Recoveries list */}
            {recoveriesLoading ? (
              <div className="rounded-xl border border-white/[0.06] bg-surface/50 p-8 text-center">
                <p className="text-white/40">Loading recoveries...</p>
              </div>
            ) : recoveriesError ? (
              <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-8 text-center">
                <p className="text-sm text-red-400">{recoveriesError}</p>
                <button
                  onClick={loadRecoveries}
                  className="mt-3 rounded-lg border border-white/10 px-4 py-2 text-sm text-white/50 hover:text-foreground"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {recoveries
                  .filter((r) => {
                    if (recoverySearch) {
                      const q = recoverySearch.toLowerCase();
                      if (!r.name.toLowerCase().includes(q) && !r.username.toLowerCase().includes(q)) return false;
                    }
                    if (recoveryPlatformFilter && r.platform !== recoveryPlatformFilter) return false;
                    if (recoveryEnabledFilter === "enabled" && !r.enabled) return false;
                    if (recoveryEnabledFilter === "disabled" && r.enabled) return false;
                    return true;
                  })
                  .map((r, index) => (
                    <div
                      key={r._id || r.username}
                      className={`flex items-start gap-4 rounded-xl border p-4 transition-colors ${
                        r.enabled
                          ? "border-white/[0.06] bg-surface/50"
                          : "border-white/[0.03] bg-surface/20 opacity-50"
                      }`}
                    >
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={async () => {
                            const idx = recoveries.findIndex((x) => x._id === r._id);
                            if (idx <= 0) return;
                            const ids = recoveries.map((x) => x._id!);
                            [ids[idx], ids[idx - 1]] = [ids[idx - 1]!, ids[idx]!];
                            await reorderRecoveriesFn({ data: { ids } });
                            await loadRecoveries();
                          }}
                          disabled={index === 0}
                          className="rounded px-1 py-0.5 text-xs text-white/30 hover:bg-white/5 hover:text-foreground disabled:opacity-20"
                        >
                          ▲
                        </button>
                        <button
                          onClick={async () => {
                            const idx = recoveries.findIndex((x) => x._id === r._id);
                            if (idx >= recoveries.length - 1) return;
                            const ids = recoveries.map((x) => x._id!);
                            [ids[idx], ids[idx + 1]] = [ids[idx + 1]!, ids[idx]!];
                            await reorderRecoveriesFn({ data: { ids } });
                            await loadRecoveries();
                          }}
                          disabled={index === recoveries.length - 1}
                          className="rounded px-1 py-0.5 text-xs text-white/30 hover:bg-white/5 hover:text-foreground disabled:opacity-20"
                        >
                          ▼
                        </button>
                      </div>
                      {r.avatar ? (
                        <img
                          src={r.avatar}
                          alt={r.name}
                          className="size-10 rounded-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="grid size-10 place-items-center rounded-full border border-gold/20 bg-gold/[0.06] text-xs font-bold text-gold">
                          {r.name.replace(/[^A-Z]/g, "").slice(0, 2)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{r.name}</span>
                          <span className="text-xs text-white/30">{r.username}</span>
                          <span className="rounded bg-gold/10 px-1.5 py-0.5 text-[10px] text-gold">
                            {r.platform}
                          </span>
                          {r.verified && (
                            <span className="rounded bg-green-400/10 px-1.5 py-0.5 text-[10px] text-green-400">
                              ✓
                            </span>
                          )}
                          {!r.enabled && (
                            <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/30">
                              DISABLED
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-white/50">
                          {r.role && <span>{r.role} · </span>}
                          <span>{r.followers} followers</span>
                          {r.recoveryType && <span> · {r.recoveryType}</span>}
                        </p>
                        {r.recoveryDate && (
                          <p className="mt-0.5 text-xs text-white/30">Recovered: {r.recoveryDate}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingRecovery(r);
                            setNewRecovery(false);
                          }}
                          className="rounded px-2 py-1 text-xs text-white/40 hover:bg-white/5 hover:text-foreground"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (!r._id) return;
                            await deleteRecoveryFn({ data: { id: r._id } });
                            await loadRecoveries();
                            // Reindex remaining recoveries
                            const remaining = recoveries.filter((x) => x._id !== r._id);
                            const ids = remaining.map((x) => x._id!).filter(Boolean);
                            if (ids.length > 0) {
                              await reorderRecoveriesFn({ data: { ids } });
                              await loadRecoveries();
                            }
                          }}
                          className="rounded px-2 py-1 text-xs text-red-400/60 hover:bg-red-400/10 hover:text-red-400"
                        >
                          Delete
                        </button>
                        <button
                          onClick={async () => {
                            if (!r._id) return;
                            await toggleRecoveryFn({ data: { id: r._id, enabled: !r.enabled } });
                            await loadRecoveries();
                          }}
                          className="rounded px-2 py-1 text-xs text-white/40 hover:bg-white/5 hover:text-foreground"
                        >
                          {r.enabled ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ---- CASES TAB ---- */}
        {tab === "cases" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="display text-2xl">Cases</h2>
              <div className="flex gap-2">
                <button
                  onClick={loadCases}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/50 hover:text-foreground"
                >
                  {casesLoading ? "Loading..." : "Refresh"}
                </button>
                <button
                  onClick={async () => {
                    setExcelLoading(true);
                    const result = await downloadExcelFn();
                    if (result.ok) {
                      const binary = atob(result.data);
                      const bytes = new Uint8Array(binary.length);
                      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
                      const blob = new Blob([bytes], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `cases-${new Date().toISOString().split("T")[0]}.xlsx`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }
                    setExcelLoading(false);
                  }}
                  className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-background hover:bg-gold-dim"
                >
                  {excelLoading ? "Generating..." : "Download Excel"}
                </button>
              </div>
            </div>

            {casesError && (
              <div className="mb-4 rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-center">
                <p className="text-sm text-red-400">{casesError}</p>
                <button
                  onClick={loadCases}
                  className="mt-2 rounded-lg border border-white/10 px-3 py-1 text-xs text-white/50 hover:text-foreground"
                >
                  Retry
                </button>
              </div>
            )}

            {cases.length === 0 && !casesLoading && !casesError && (
              <div className="rounded-xl border border-white/[0.06] bg-surface/50 p-8 text-center">
                <p className="text-white/40">
                  No cases found yet. Cases will appear here when users submit the intake form.
                </p>
                <p className="mt-2 text-xs text-white/25">
                  Make sure MONGODB_URI and RESEND_API_KEY are configured.
                </p>
              </div>
            )}

            {cases.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="px-3 py-2 text-xs font-semibold text-gold">Case ID</th>
                      <th className="px-3 py-2 text-xs font-semibold text-gold">Name</th>
                      <th className="px-3 py-2 text-xs font-semibold text-gold">Email</th>
                      <th className="px-3 py-2 text-xs font-semibold text-gold">Platform</th>
                      <th className="px-3 py-2 text-xs font-semibold text-gold">Case Type</th>
                      <th className="px-3 py-2 text-xs font-semibold text-gold">Status</th>
                      <th className="px-3 py-2 text-xs font-semibold text-gold">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.map((c: any) => (
                      <tr key={c.caseId} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                        <td className="px-3 py-2 font-mono text-xs text-gold">{c.caseId}</td>
                        <td className="px-3 py-2">{c.fullName}</td>
                        <td className="px-3 py-2 text-white/50">{c.email}</td>
                        <td className="px-3 py-2">
                          <span className="rounded bg-gold/10 px-1.5 py-0.5 text-[10px] text-gold">
                            {c.platform}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-white/50">{c.caseType}</td>
                        <td className="px-3 py-2">
                          <span className={`rounded px-1.5 py-0.5 text-[10px] ${
                            c.status === "new" ? "bg-blue-400/10 text-blue-400" :
                            c.status === "in_progress" ? "bg-yellow-400/10 text-yellow-400" :
                            c.status === "resolved" ? "bg-green-400/10 text-green-400" :
                            "bg-white/5 text-white/30"
                          }`}>
                            {c.status?.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs text-white/30">
                          {c.submittedAt ? new Date(c.submittedAt).toLocaleDateString() : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminPage() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(sessionStorage.getItem(PASSWORD_KEY) === "1");
  }, []);

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  return <AdminDashboard />;
}
