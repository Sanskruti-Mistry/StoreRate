import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { getStores, rateStore } from "../api/client";

export default function UserStoresPage() {
  const { token } = useAuth();
  const [stores, setStores] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [ratingLoadingId, setRatingLoadingId] = useState(null);
  const [error, setError] = useState(null);

  const loadStores = async (page = 1) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getStores(token, { page, pageSize: pagination.pageSize, search: search.trim() || undefined, sortBy, sortOrder });
      setStores(res.data || []);
      setPagination(res.pagination || pagination);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStores(1); }, [sortBy, sortOrder]); // eslint-disable-line

  const handleSearchSubmit = (e) => { e.preventDefault(); loadStores(1); };
  const handlePageChange = (newPage) => { if (newPage >= 1 && newPage <= pagination.totalPages) loadStores(newPage); };
  
  const handleRatingChange = async (storeId, newValue) => {
    if (!token) return;
    const value = parseInt(newValue, 10);
    if (isNaN(value) || value < 1 || value > 5) return;
    setRatingLoadingId(storeId);
    setError(null);
    try {
      const res = await rateStore(token, storeId, value);
      setStores((prev) => prev.map((s) => s.id === storeId ? { ...s, avgRating: res.avgRating, myRating: res.rating.value } : s));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save rating");
    } finally {
      setRatingLoadingId(null);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.pageTitle}>Explore Stores</h2>
      
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
            <input type="text" placeholder="Find stores..." value={search} onChange={(e) => setSearch(e.target.value)} style={styles.searchInput} />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.toolbarSelect}>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="createdAt">Date</option>
            </select>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={styles.toolbarSelect}>
                <option value="asc">Asc</option>
                <option value="desc">Desc</option>
            </select>
            <button type="submit" style={styles.searchBtn}>Search</button>
        </form>
      </div>

      {error && <div style={styles.errorBanner}>{error}</div>}

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Store Info</th>
                <th style={styles.th}>Address</th>
                <th style={styles.th}>Avg Rating</th>
                <th style={styles.th}>Your Rating</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                 <tr><td colSpan="4" style={styles.tdCenter}>Loading...</td></tr>
              ) : stores.length === 0 ? (
                 <tr><td colSpan="4" style={styles.tdCenter}>No stores found.</td></tr>
              ) : (
                stores.map((store) => (
                    <tr key={store.id} style={styles.tr}>
                        <td style={styles.td}>
                            <div style={styles.storeName}>{store.name}</div>
                            <div style={styles.storeEmail}>{store.email || "No email"}</div>
                        </td>
                        <td style={styles.td}>{store.address}</td>
                        <td style={styles.td}>
                             <div style={styles.avgRating}>
                                {store.avgRating ? store.avgRating.toFixed(1) : "—"} 
                                <span style={{color: "#f59e0b", marginLeft: "4px"}}>★</span>
                             </div>
                        </td>
                        <td style={styles.td}>
                            <select
                              value={store.myRating || ""}
                              onChange={(e) => handleRatingChange(store.id, e.target.value)}
                              disabled={ratingLoadingId === store.id}
                              style={store.myRating ? styles.ratingSelectActive : styles.ratingSelect}
                            >
                              <option value="">Rate</option>
                              <option value="1">1 Star</option>
                              <option value="2">2 Stars</option>
                              <option value="3">3 Stars</option>
                              <option value="4">4 Stars</option>
                              <option value="5">5 Stars</option>
                            </select>
                        </td>
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

const styles = {
    container: { padding: "24px", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif" },
    pageTitle: { fontSize: "28px", color: "#111827", marginBottom: "24px" },
    toolbar: { marginBottom: "16px", backgroundColor: "white", padding: "12px", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" },
    searchForm: { display: "flex", flexWrap: "wrap", gap: "10px" },
    searchInput: { flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", minWidth: "200px" },
    toolbarSelect: { padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db" },
    searchBtn: { backgroundColor: "#2563eb", color: "white", padding: "10px 20px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "500" },
    errorBanner: { backgroundColor: "#fee2e2", color: "#b91c1c", padding: "10px", borderRadius: "6px", marginBottom: "16px" },
    tableWrapper: { backgroundColor: "white", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
    table: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
    th: { textAlign: "left", padding: "16px", borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb", color: "#6b7280", fontWeight: "600", fontSize: "12px", textTransform: "uppercase" },
    tr: { borderBottom: "1px solid #f3f4f6" },
    td: { padding: "16px", verticalAlign: "middle", color: "#374151" },
    tdCenter: { padding: "24px", textAlign: "center", color: "#6b7280" },
    
    storeName: { fontWeight: "600", color: "#111827" },
    storeEmail: { fontSize: "12px", color: "#6b7280", marginTop: "2px" },
    avgRating: { fontWeight: "700", display: "flex", alignItems: "center" },
    
    ratingSelect: { padding: "6px 10px", borderRadius: "6px", border: "1px solid #d1d5db", backgroundColor: "white", cursor: "pointer", fontSize: "13px" },
    ratingSelectActive: { padding: "6px 10px", borderRadius: "6px", border: "1px solid #f59e0b", backgroundColor: "#fffbeb", color: "#b45309", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
    
    pagination: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", color: "#6b7280", fontSize: "14px" },
    pageBtns: { display: "flex", gap: "8px" },
    pageBtn: { padding: "6px 12px", borderRadius: "6px", border: "1px solid #d1d5db", backgroundColor: "white", cursor: "pointer" }
};