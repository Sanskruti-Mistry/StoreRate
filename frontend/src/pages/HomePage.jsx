import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        {/* Left Text */}
        <div style={styles.textSection}>
          <div style={styles.badge}>Welcome v1.0</div>
          <h1 style={styles.title}>
            Store Rating <span style={styles.highlight}>System</span>
          </h1>
          <p style={styles.subtitle}>
            Discover the best local stores, rate your experiences, and help the
            community grow. Join thousands of users making better choices today.
          </p>
          <div style={styles.buttonGroup}>
             <button onClick={() => navigate('/login')} style={styles.primaryBtn}>Get Started</button>
             <button onClick={() => navigate('/signup')} style={styles.secondaryBtn}>Create Account</button>
          </div>
        </div>

        {/* Right Image Section (Collage) */}
        <div style={styles.imageSection}>
          <div style={styles.collageGrid}>
            
            {/* Main Large Image (Your original image) */}
            <div style={styles.mainImageCard}>
              <img
                src="https://i.pinimg.com/736x/0d/45/93/0d4593b03fb102e97f42eddb27fe0b8d.jpg"
                alt="Store Main"
                style={styles.imageFull}
              />
            </div>

            {/* Stacked Side Images (The new links) */}
            <div style={styles.sideColumn}>
              <div style={styles.sideImageCard}>
                <img
                  src="https://i.pinimg.com/1200x/6b/73/49/6b73498ff950c9d03bf1ab02ca9328ec.jpg"
                  alt="Store Detail 1"
                  style={styles.imageFull}
                />
              </div>
              <div style={styles.sideImageCard}>
                <img
                  src="https://i.pinimg.com/736x/e9/2a/b5/e92ab58df04bc1791f89d4232b2175e7.jpg"
                  alt="Store Detail 2"
                  style={styles.imageFull}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "calc(100vh - 60px)",
    width: "100%",
    background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  contentWrapper: {
    maxWidth: "1200px",
    width: "100%",
    padding: "40px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "60px",
  },
  textSection: {
    flex: 1,
    minWidth: "300px",
  },
  badge: {
    display: "inline-block",
    padding: "8px 16px",
    backgroundColor: "#e0e7ff",
    color: "#4338ca",
    borderRadius: "50px",
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "0.5px",
    marginBottom: "24px",
    textTransform: "uppercase",
  },
  title: {
    fontSize: "56px",
    fontWeight: "900",
    color: "#111827",
    lineHeight: "1.1",
    marginBottom: "24px",
    letterSpacing: "-0.02em",
  },
  highlight: {
    background: "linear-gradient(to right, #4f46e5, #9333ea)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: "18px",
    color: "#4b5563",
    lineHeight: "1.7",
    marginBottom: "40px",
    maxWidth: "500px",
  },
  buttonGroup: {
    display: "flex",
    gap: "16px",
  },
  primaryBtn: {
    padding: "14px 32px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)",
    transition: "transform 0.2s",
  },
  secondaryBtn: {
    padding: "14px 32px",
    backgroundColor: "white",
    color: "#374151",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
  },
  
  // --- Collage Styles ---
  imageSection: {
    flex: 1,
    minWidth: "350px",
    display: "flex",
    justifyContent: "center",
  },
  collageGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr", // Left column wider, Right column narrower
    gap: "16px",
    width: "100%",
    maxWidth: "600px",
    transform: "rotate(-2deg)", // Subtle tilt for style
  },
  mainImageCard: {
    width: "100%",
    height: "100%",
    minHeight: "300px",
    backgroundColor: "white",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },
  sideColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    height: "100%",
  },
  sideImageCard: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    minHeight: "140px",
  },
  imageFull: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
};