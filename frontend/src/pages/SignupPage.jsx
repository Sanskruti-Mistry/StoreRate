import React, { useState } from "react";
import { signupUser } from "../api/client";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const { setFromAuthResponse } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
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
      const res = await signupUser(form);
      setFromAuthResponse(res);
      navigate("/me");
    } catch (err) {
      console.error(err);
      setError(err.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Join our community today.</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              onFocus={() => setActiveHint("name")}
              onBlur={() => setActiveHint(null)}
              style={styles.input}
              placeholder="John Doe"
              required
            />
            {activeHint === "name" && (
              <div style={styles.hint}>Name must be 20-60 characters.</div>
            )}
          </div>

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
              placeholder="you@example.com"
              required
            />
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
              placeholder="Create a strong password"
              required
            />
            {activeHint === "password" && (
              <div style={styles.hint}>
                8–16 chars, 1 uppercase, 1 special char.
              </div>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Address (Optional)</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              onFocus={() => setActiveHint("address")}
              onBlur={() => setActiveHint(null)}
              style={{ ...styles.input, height: "80px", resize: "none" }}
              placeholder="Your billing or shipping address..."
            />
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
            {submitting ? "Creating Account..." : "Sign Up"}
          </button>
          
          <div style={styles.footer}>
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} style={styles.link}>
              Log in
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
    maxWidth: "480px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "40px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
  },
  header: {
    textAlign: "center",
    marginBottom: "24px",
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
    gap: "16px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  hint: {
    fontSize: "11px",
    color: "#4f46e5",
    marginTop: "2px",
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
    backgroundColor: "#16a34a",
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
    color: "#16a34a",
    cursor: "pointer",
    fontWeight: "600",
  },
};