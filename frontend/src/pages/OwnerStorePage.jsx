import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { ownerGetMyStore, ownerGetMyStoreRatings } from "../api/client";

export default function OwnerStorePage() {
  const { token } = useAuth();
  const [store, setStore] = useState(null);
  const [storeError, setStoreError] = useState(null);
  const [storeLoading, setStoreLoading] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [ratingsPagination, setRatingsPagination] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 1 });
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [ratingsError, setRatingsError] = useState(null);

  useEffect(() => {
    async function loadStore() {
      if (!token) return;
      setStoreLoading(true);
      setStoreError(null);
      try {
        const res = await ownerGetMyStore(token);
        setStore(res);
      } catch (err) {
        console.error(err);
        setStoreError(err.message || "Failed to load store");
      } finally {
        setStoreLoading(false);
      }
    }
    loadStore();
  }, [token]);

  const loadRatings = async (page = 1) => {
    if (!token) return;
    setRatingsLoading(true);
    setRatingsError(null);
    try {
      const res = await ownerGetMyStoreRatings(token, { page, pageSize: ratingsPagination.pageSize, sortBy: "createdAt", sortOrder: "desc" });
      setRatings(res.data || []);
      setRatingsPagination(res.pagination || ratingsPagination);
    } catch (err) {
      console.error(err);
      setRatingsError(err.message || "Failed to load ratings");
    } finally {
      setRatingsLoading(false);
    }
  };

  useEffect(() => { loadRatings(1); }, [token]); // eslint-disable-line

  const handleRatingsPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= ratingsPagination.totalPages) loadRatings(newPage);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.pageTitle}>My Store Dashboard</h2>

      {/* Store Hero Card */}
      {storeLoading ? (
        <div style={styles.loading}>Loading store details...</div>
      ) : storeError ? (
        <div style={styles.errorBanner}>{storeError}</div>
      ) : store ? (
        <div style={styles.heroCard}>
          <div style={styles.heroHeader}>
             <div>
                <h3 style={styles.storeName}>{store.name}</h3>
                <p style={styles.storeAddr}>{store.address}</p>
             </div>
             <div style={styles.ratingBox}>
                <div style={styles.ratingVal}>{store.avgRating ? store.avgRating.toFixed(1) : "—"}</div>
                <div style={styles.ratingLabel}>Avg Rating</div>
             </div>
          </div>
          <div style={styles.heroFooter}>
             <span>Store ID: <strong>#{store.id}</strong></span>
             <span>Email: <strong>{store.email || "N/A"}</strong></span>
             <span>Total Ratings: <strong>{store.totalRatings}</strong></span>
          </div>
        </div>
      ) : (
        <div style={styles.infoBanner}>No store assigned to this account.</div>
      )}

      {/* Ratings Section */}
      <h3 style={styles.sectionTitle}>Customer Ratings</h3>

      {ratingsError && <div style={styles.errorBanner}>{ratingsError}</div>}

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Rating</th>
              </tr>
            </thead>
            <tbody>
              {ratingsLoading ? (
                 <tr><td colSpan="3" style={styles.tdCenter}>Loading...</td></tr>
              ) : ratings.length === 0 ? (
                 <tr><td colSpan="3" style={styles.tdCenter}>No ratings received yet.</td></tr>
              ) : (
                ratings.map((r) => (
                    <tr key={r.id} style={styles.tr}>
                        <td style={styles.td}>
                             <div style={{fontWeight: 500}}>{r.user ? r.user.name : `User #${r.userId}`}</div>
                             <div style={{fontSize: "12px", color: "#6b7280"}}>{r.user ? r.user.email : ""}</div>
                        </td>
                        <td style={styles.td}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}</td>
                        <td style={styles.td}>{renderStars(r.value)}</td>
                    </tr>
                ))
              )}
            </tbody>
        </table>
      </div>

      {ratingsPagination.totalPages > 1 && (
        <div style={styles.pagination}>
            <span>Page {ratingsPagination.page} of {ratingsPagination.totalPages}</span>
            <div style={styles.pageBtns}>
                <button onClick={() => handleRatingsPageChange(ratingsPagination.page - 1)} disabled={ratingsPagination.page <= 1} style={styles.pageBtn}>Prev</button>
                <button onClick={() => handleRatingsPageChange(ratingsPagination.page + 1)} disabled={ratingsPagination.page >= ratingsPagination.totalPages} style={styles.pageBtn}>Next</button>
            </div>
        </div>
      )}
    </div>
  );
}

const renderStars = (count) => {
    return <span style={{color: "#f59e0b", fontSize: "16px"}}>{"★".repeat(count)}{"☆".repeat(5-count)}</span>
}

const styles = {
    container: { padding: "24px", maxWidth: "900px", margin: "0 auto", fontFamily: "sans-serif" },
    pageTitle: { fontSize: "28px", color: "#111827", marginBottom: "24px" },
    sectionTitle: { fontSize: "20px", color: "#374151", marginTop: "32px", marginBottom: "16px" },
    loading: { color: "#6b7280", fontStyle: "italic" },
    errorBanner: { backgroundColor: "#fee2e2", color: "#b91c1c", padding: "12px", borderRadius: "8px", marginBottom: "16px" },
    infoBanner: { backgroundColor: "#f3f4f6", color: "#374151", padding: "16px", borderRadius: "8px" },

    heroCard: { backgroundColor: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb" },
    heroHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" },
    storeName: { margin: "0 0 8px 0", fontSize: "24px", color: "#111827" },
    storeAddr: { margin: 0, color: "#6b7280" },
    ratingBox: { textAlign: "center", backgroundColor: "#fffbeb", padding: "12px 20px", borderRadius: "12px", color: "#b45309" },
    ratingVal: { fontSize: "28px", fontWeight: "700", lineHeight: 1 },
    ratingLabel: { fontSize: "11px", textTransform: "uppercase", fontWeight: "600", marginTop: "4px" },
    heroFooter: { display: "flex", gap: "24px", borderTop: "1px solid #f3f4f6", paddingTop: "16px", fontSize: "13px", color: "#4b5563" },

    tableWrapper: { backgroundColor: "white", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
    table: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
    th: { textAlign: "left", padding: "16px", borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb", color: "#6b7280", fontWeight: "600", fontSize: "12px", textTransform: "uppercase" },
    tr: { borderBottom: "1px solid #f3f4f6" },
    td: { padding: "16px", verticalAlign: "middle", color: "#374151" },
    tdCenter: { padding: "24px", textAlign: "center", color: "#6b7280" },
    
    pagination: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", color: "#6b7280", fontSize: "14px" },
    pageBtns: { display: "flex", gap: "8px" },
    pageBtn: { padding: "6px 12px", borderRadius: "6px", border: "1px solid #d1d5db", backgroundColor: "white", cursor: "pointer" }
};