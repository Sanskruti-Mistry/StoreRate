import React, { useState } from "react";
import { loginUser } from "../api/client";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { setFromAuthResponse } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [activeHint, setActiveHint] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await loginUser(form);
      setFromAuthResponse(res);
      navigate("/me");
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onFocus={() => setActiveHint("email")}
              onBlur={() => setActiveHint(null)}
              style={styles.input}
              placeholder="name@company.com"
              required
            />
            {activeHint === "email" && (
              <div style={styles.hint}>Use your registered email.</div>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setActiveHint("password")}
              onBlur={() => setActiveHint(null)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
            {activeHint === "password" && (
              <div style={styles.hint}>Enter your secure password.</div>
            )}
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button
            type="submit"
            disabled={submitting}
            style={{
              ...styles.button,
              opacity: submitting ? 0.7 : 1,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
          
          <div style={styles.footer}>
            New here?{" "}
            <span onClick={() => navigate("/signup")} style={styles.link}>
              Create an account
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: "calc(100vh - 60px)",
    width: "100%",
    backgroundColor: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "40px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#111827",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
    boxSizing: "border-box",
  },
  hint: {
    fontSize: "12px",
    color: "#6b7280",
    backgroundColor: "#f9fafb",
    padding: "4px 8px",
    borderRadius: "4px",
    border: "1px solid #e5e7eb",
  },
  error: {
    padding: "10px",
    borderRadius: "6px",
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    fontSize: "13px",
    textAlign: "center",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#4f46e5",
    color: "white",
    fontSize: "14px",
    fontWeight: "600",
    marginTop: "8px",
    transition: "background-color 0.2s",
  },
  footer: {
    marginTop: "16px",
    textAlign: "center",
    fontSize: "14px",
    color: "#6b7280",
  },
  link: {
    color: "#4f46e5",
    cursor: "pointer",
    fontWeight: "600",
  },
};