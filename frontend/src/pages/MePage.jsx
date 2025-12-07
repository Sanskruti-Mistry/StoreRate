import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { fetchCurrentUser } from "../api/client";

export default function MePage() {
  const { token, user: authUser, setFromAuthResponse } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      if (!token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetchCurrentUser(token);
        const serverUser = res?.user || res;
        setProfile(serverUser);
        if (serverUser && authUser && serverUser.id === authUser.id) {
          setFromAuthResponse({ token, user: serverUser });
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch current user");
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (loading) return <div style={styles.loading}>Loading profile...</div>;
  
  if (error) return (
    <div style={styles.container}>
      <div style={styles.errorBox}>{error}</div>
    </div>
  );

  const u = profile || authUser;

  if (!u) return (
    <div style={styles.container}>
      <p>No user information available.</p>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.profileCard}>
        <div style={styles.header}>
            <div style={styles.avatar}>
                {u.name ? u.name.charAt(0).toUpperCase() : "U"}
            </div>
            <h2 style={styles.name}>{u.name}</h2>
            <span style={styles.roleBadge}>{u.role}</span>
        </div>

        <div style={styles.grid}>
            <ProfileField label="User ID" value={`#${u.id}`} />
            <ProfileField label="Email Address" value={u.email} />
            <ProfileField label="Address" value={u.address || "Not provided"} fullWidth />
            {"createdAt" in u && (
            <ProfileField
                label="Member Since"
                value={new Date(u.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric', month: 'long', day: 'numeric'
                })}
            />
            )}
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value, fullWidth }) {
  return (
    <div style={{ ...styles.field, gridColumn: fullWidth ? "1 / -1" : "auto" }}>
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value}</div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    minHeight: "calc(100vh - 60px)",
    padding: "40px 20px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
  },
  loading: {
      padding: "40px", textAlign: "center", color: "#6b7280"
  },
  errorBox: {
      padding: "16px", borderRadius: "8px", backgroundColor: "#fee2e2", color: "#b91c1c"
  },
  profileCard: {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    height: "fit-content",
  },
  header: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: "32px",
      borderBottom: "1px solid #e5e7eb",
      paddingBottom: "24px",
  },
  avatar: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      backgroundColor: "#4f46e5",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "32px",
      fontWeight: "bold",
      marginBottom: "16px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  name: {
      margin: 0,
      fontSize: "24px",
      fontWeight: "700",
      color: "#111827",
  },
  roleBadge: {
      marginTop: "8px",
      padding: "4px 12px",
      backgroundColor: "#e0e7ff",
      color: "#4338ca",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "600",
      letterSpacing: "0.5px",
  },
  grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "20px",
  },
  field: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
  },
  label: {
      fontSize: "13px",
      color: "#6b7280",
      fontWeight: "500",
      textTransform: "uppercase",
  },
  value: {
      padding: "12px",
      backgroundColor: "#f9fafb",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
      fontSize: "15px",
      color: "#1f2937",
      fontWeight: "500",
  },
};