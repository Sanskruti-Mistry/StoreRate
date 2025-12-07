import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { adminGetDashboard } from "../api/client";

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const res = await adminGetDashboard(token);
        setData(res);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Admin Dashboard</h2>
        <p style={styles.subtitle}>
          System overview and key performance metrics.
        </p>
      </div>

      {loading && <p style={{color: '#6b7280'}}>Loading dashboard data...</p>}
      {error && <div style={styles.error}>{error}</div>}

      {data && (
        <div style={styles.grid}>
          <StatCard label="Total Users" value={data.totalUsers} color="#3b82f6" />
          <StatCard label="Total Stores" value={data.totalStores} color="#10b981" />
          <StatCard label="Total Ratings" value={data.totalRatings} color="#f59e0b" />
          <StatCard label="Admins" value={data.usersByRole?.ADMIN ?? 0} color="#6366f1" />
          <StatCard label="Owners" value={data.usersByRole?.OWNER ?? 0} color="#8b5cf6" />
          <StatCard label="Normal Users" value={data.usersByRole?.USER ?? 0} color="#ec4899" />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{...styles.card, borderLeft: `4px solid ${color}`}}>
      <div style={styles.cardLabel}>{label}</div>
      <div style={{...styles.cardValue, color: color}}>{value}</div>
    </div>
  );
}

const styles = {
  container: {
      padding: "24px",
      maxWidth: "1200px",
      margin: "0 auto",
  },
  header: {
      marginBottom: "32px",
  },
  title: {
      margin: "0 0 8px 0",
      fontSize: "28px",
      color: "#111827",
  },
  subtitle: {
      margin: 0,
      color: "#6b7280",
      fontSize: "15px",
  },
  error: {
      marginBottom: "12px",
      padding: "12px",
      borderRadius: "8px",
      backgroundColor: "#fee2e2",
      color: "#b91c1c",
      fontSize: "14px",
  },
  grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "24px",
  },
  card: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
  },
  cardLabel: {
      fontSize: "14px",
      color: "#6b7280",
      fontWeight: "500",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
  },
  cardValue: {
      fontSize: "36px",
      fontWeight: "700",
      lineHeight: 1,
  },
};