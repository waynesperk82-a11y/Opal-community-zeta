import { Link } from "wouter";

function Home() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f8fafc" }}>
      
      {/* NAVBAR */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          backgroundColor: "#0f172a",
          color: "white",
        }}
      >
        <h2 style={{ margin: 0 }}>Opal Zeta</h2>

        <div>
          <Link href="/login">
            <button
              style={{
                marginRight: "15px",
                padding: "8px 18px",
                backgroundColor: "transparent",
                border: "1px solid white",
                color: "white",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </Link>

          <Link href="/signup">
            <button
              style={{
                padding: "8px 18px",
                backgroundColor: "#3b82f6",
                border: "none",
                color: "white",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Sign Up
            </button>
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section
        style={{
          textAlign: "center",
          padding: "100px 20px",
          background: "linear-gradient(to right, #1e293b, #0f172a)",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
          Ask. Answer. Learn. Grow.
        </h1>
        <p style={{ fontSize: "18px", maxWidth: "600px", margin: "0 auto" }}>
          Opal Zeta is a powerful community platform where people ask questions,
          get answers from real humans, and when no one responds — AI steps in.
        </p>

        <div style={{ marginTop: "30px" }}>
          <Link href="/ask">
            <button
              style={{
                padding: "12px 28px",
                fontSize: "16px",
                backgroundColor: "#3b82f6",
                border: "none",
                color: "white",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Ask a Question
            </button>
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "80px 20px", textAlign: "center" }}>
        <h2>How It Works</h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "40px",
            marginTop: "40px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: "250px" }}>
            <h3>1️⃣ Ask</h3>
            <p>Post your question to the community.</p>
          </div>

          <div style={{ maxWidth: "250px" }}>
            <h3>2️⃣ Community Answers</h3>
            <p>Real people share real knowledge.</p>
          </div>

          <div style={{ maxWidth: "250px" }}>
            <h3>3️⃣ AI Backup</h3>
            <p>If no one answers, AI responds instantly.</p>
          </div>
        </div>
      </section>

      {/* AD SECTION */}
      <section
        style={{
          padding: "40px",
          backgroundColor: "#e2e8f0",
          textAlign: "center",
        }}
      >
        <h3>Sponsored</h3>
        <div
          style={{
            marginTop: "20px",
            padding: "40px",
            backgroundColor: "white",
            borderRadius: "10px",
            maxWidth: "800px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <p>Ad Space — Your future monetization goes here </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          padding: "30px",
          backgroundColor: "#0f172a",
          color: "white",
          textAlign: "center",
        }}
      >
        <p>© 2026 Opal Zeta. Built for the community.</p>
      </footer>
    </div>
  );
}

export default Home;
