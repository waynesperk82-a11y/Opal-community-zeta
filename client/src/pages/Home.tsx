import { useState } from "react";

function Home() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      
      {/* Hero Section */}
      <section
        style={{
          textAlign: "center",
          padding: "100px 20px",
          background: "linear-gradient(to right, #4f46e5, #9333ea)",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>
          Opal Community Zeta 
        </h1>
        <p style={{ fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>
          Building the future community platform powered by modern technology.
        </p>

        <button
          onClick={() => setCount(count + 1)}
          style={{
            marginTop: "30px",
            padding: "12px 25px",
            fontSize: "1rem",
            backgroundColor: "white",
            color: "#4f46e5",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Clicked {count} times
        </button>
      </section>

      {/* Features Section */}
      <section style={{ padding: "60px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "40px" }}>
          Why Choose Us?
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "30px",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          <div style={{ padding: "20px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
            <h3> Fast</h3>
            <p>Built with Vite + React for lightning speed performance.</p>
          </div>

          <div style={{ padding: "20px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
            <h3> Secure</h3>
            <p>Backend hosted securely with proper API communication.</p>
          </div>

          <div style={{ padding: "20px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
            <h3> Scalable</h3>
            <p>Designed to grow into a full community platform.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "30px",
          backgroundColor: "#111",
          color: "white",
        }}
      >
        <p>© {new Date().getFullYear()} Opal Community Zeta. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
