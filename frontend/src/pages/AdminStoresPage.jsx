import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { adminGetStores, adminCreateStore } from "../api/client";

export default function AdminStoresPage() {
  const { token } = useAuth();
  const [stores, setStores] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [ownerIdFilter, setOwnerIdFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [newStore, setNewStore] = useState({ name: "", email: "", address: "", ownerId: "" });

  const loadStores = async (page = 1) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await adminGetStores(token, {
        page, pageSize: pagination.pageSize, search: search.trim() || undefined,
        ownerId: ownerIdFilter || undefined, sortBy, sortOrder,
      });
      setStores(res.data || []);
      setPagination(res.pagination || pagination);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStores(1); }, [sortBy, sortOrder, ownerIdFilter]); // eslint-disable-line

  const handleSearchSubmit = (e) => { e.preventDefault(); loadStores(1); };
  const handlePageChange = (newPage) => { if (newPage >= 1 && newPage <= pagination.totalPages) loadStores(newPage); };
  const handleNewStoreChange = (e) => { setNewStore((prev) => ({ ...prev, [e.target.name]: e.target.value })); };
  
  const handleCreateStore = async (e) => {
    e.preventDefault();
    if (!token) return;
    setCreating(true);
    setCreateError(null);
    try {
      const payload = { ...newStore, email: newStore.email || null, ownerId: newStore.ownerId ? Number(newStore.ownerId) : null };
      await adminCreateStore(token, payload);
      setNewStore({ name: "", email: "", address: "", ownerId: "" });
      loadStores(1);
    } catch (err) {
      console.error(err);
      setCreateError(err.message || "Failed to create store");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.pageTitle}>Store Management</h2>
      
      {/* Creation Panel */}
      <details open style={styles.detailsPanel}>
        <summary style={styles.summary}>+ Create New Store</summary>
        <div style={styles.formContainer}>
          <form onSubmit={handleCreateStore} style={styles.createForm}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Store Name</label>
              <input type="text" name="name" value={newStore.name} onChange={handleNewStoreChange} style={styles.input} required />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email (Optional)</label>
              <input type="email" name="email" value={newStore.email} onChange={handleNewStoreChange} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Owner ID (Optional)</label>
              <input type="number" name="ownerId" value={newStore.ownerId} onChange={handleNewStoreChange} style={styles.input} placeholder="e.g. 5" />
              <div style={styles.helperText}>Must belong to a user with role OWNER</div>
            </div>
            <div style={{...styles.formGroup, gridColumn: "1 / -1"}}>
              <label style={styles.label}>Address</label>
              <textarea name="address" value={newStore.address} onChange={handleNewStoreChange} style={{ ...styles.input, height: "60px", resize: "none" }} required />
            </div>
            {createError && <div style={styles.errorBanner}>{createError}</div>}
            <div style={{gridColumn: "1 / -1"}}>
              <button type="submit" disabled={creating} style={styles.primaryButton}>
                {creating ? "Creating..." : "Create Store"}
              </button>
            </div>
          </form>
        </div>
      </details>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
            <input type="text" placeholder="Search stores..." value={search} onChange={(e) => setSearch(e.target.value)} style={styles.searchInput} />
            <input type="number" placeholder="Owner ID..." value={ownerIdFilter} onChange={(e) => setOwnerIdFilter(e.target.value)} style={{...styles.input, width: "100px"}} />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.toolbarSelect}>
                <option value="createdAt">Created</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
            </select>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={styles.toolbarSelect}>
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
            </select>
            <button type="submit" style={styles.searchBtn}>Apply</button>
        </form>
      </div>

      {error && <div style={styles.errorBanner}>{error}</div>}

      {/* Table */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Address</th>
                <th style={styles.th}>Owner</th>
                <th style={styles.th}>Rating</th>
                <th style={styles.th}>Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                 <tr><td colSpan="6" style={styles.tdCenter}>Loading...</td></tr>
              ) : stores.length === 0 ? (
                 <tr><td colSpan="6" style={styles.tdCenter}>No stores found.</td></tr>
              ) : (
                stores.map((s) => (
                    <tr key={s.id} style={styles.tr}>
                        <td style={styles.td}>{s.id}</td>
                        <td style={{...styles.td, fontWeight: 500}}>{s.name}<div style={{fontSize: "11px", color:"#6b7280"}}>{s.email}</div></td>
                        <td style={styles.td}>{s.address}</td>
                        <td style={styles.td}>{s.owner ? `${s.owner.name}` : <span style={{color:"#9ca3af"}}>None</span>}</td>
                        <td style={styles.td}>{s.avgRating ? <span style={styles.ratingBadge}>{s.avgRating.toFixed(1)} ★</span> : "—"}</td>
                        <td style={styles.td}>{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "—"}</td>
                    </tr>
                ))
              )}
            </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div style={styles.pagination}>
            <span>Page {pagination.page} of {pagination.totalPages}</span>
            <div style={styles.pageBtns}>
                <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page <= 1} style={styles.pageBtn}>Prev</button>
                <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} style={styles.pageBtn}>Next</button>
            </div>
        </div>
      )}
    </div>
  );
}

// Styling (Same as AdminUsersPage but with Rating Badge)
const styles = {
    container: { padding: "24px", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" },
    pageTitle: { fontSize: "28px", color: "#111827", marginBottom: "24px" },
    detailsPanel: { marginBottom: "24px", backgroundColor: "white", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" },
    summary: { backgroundColor: "#f9fafb", padding: "12px 20px", cursor: "pointer", fontWeight: "600", color: "#374151" },
    formContainer: { padding: "20px", borderTop: "1px solid #e5e7eb" },
    createForm: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" },
    formGroup: { display: "flex", flexDirection: "column", gap: "6px" },
    label: { fontSize: "13px", fontWeight: "600", color: "#4b5563" },
    helperText: { fontSize: "11px", color: "#6b7280" },
    input: { padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", width: "100%", boxSizing: "border-box" },
    primaryButton: { backgroundColor: "#16a34a", color: "white", padding: "10px 20px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "600" },
    errorBanner: { backgroundColor: "#fee2e2", color: "#b91c1c", padding: "10px", borderRadius: "6px", marginBottom: "16px", gridColumn: "1 / -1" },
    toolbar: { marginBottom: "16px", backgroundColor: "white", padding: "12px", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" },
    searchForm: { display: "flex", flexWrap: "wrap", gap: "10px" },
    searchInput: { flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", minWidth: "200px" },
    toolbarSelect: { padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db" },
    searchBtn: { backgroundColor: "#2563eb", color: "white", padding: "10px 20px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "500" },
    tableWrapper: { backgroundColor: "white", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
    table: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
    th: { textAlign: "left", padding: "16px", borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb", color: "#6b7280", fontWeight: "600", fontSize: "12px", textTransform: "uppercase" },
    tr: { borderBottom: "1px solid #f3f4f6" },
    td: { padding: "16px", verticalAlign: "middle", color: "#374151" },
    tdCenter: { padding: "24px", textAlign: "center", color: "#6b7280" },
    ratingBadge: { backgroundColor: "#fef3c7", color: "#d97706", padding: "2px 6px", borderRadius: "4px", fontWeight: "700", fontSize: "12px" },
    pagination: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", color: "#6b7280", fontSize: "14px" },
    pageBtns: { display: "flex", gap: "8px" },
    pageBtn: { padding: "6px 12px", borderRadius: "6px", border: "1px solid #d1d5db", backgroundColor: "white", cursor: "pointer" }
};