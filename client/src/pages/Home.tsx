function Home() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      
      {/* HEADER */}
      <header
        style={{
          padding: "15px 20px",
          backgroundColor: "#0f172a",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2>Opal Zeta </h2>
        <div>
          <button style={{ marginRight: "10px" }}>Login</button>
          <button>Sign Up</button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 3fr 1fr",
          gap: "20px",
          padding: "20px",
        }}
      >
        {/* LEFT SIDEBAR (ADS READY) */}
        <aside
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "8px",
            minHeight: "300px",
          }}
        >
          <h4>Sponsored</h4>
          <div
            style={{
              marginTop: "10px",
              height: "250px",
              backgroundColor: "#f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Ad Space
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main>
          <section style={{ textAlign: "center", marginBottom: "40px" }}>
            <h1>Ask. Answer. Learn.</h1>
            <p style={{ color: "gray" }}>
              A community-powered Q&A platform with built-in AI assistance.
            </p>

            <div style={{ marginTop: "20px" }}>
              <button
                style={{
                  padding: "10px 20px",
                  marginRight: "10px",
                  backgroundColor: "#4f46e5",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Ask Question
              </button>

              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "black",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Ask AI 
              </button>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section>
            <h2>How It Works</h2>
            <ul style={{ marginTop: "15px", lineHeight: "1.8" }}>
              <li> Post your question</li>
              <li>Community answers</li>
              <li> AI responds if unanswered</li>
              <li>Learn and grow together</li>
            </ul>
          </section>
        </main>

        {/* RIGHT SIDEBAR (ADS READY) */}
        <aside
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "8px",
            minHeight: "300px",
          }}
        >
          <h4>Advertisement</h4>
          <div
            style={{
              marginTop: "10px",
              height: "250px",
              backgroundColor: "#f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Ad Space
          </div>
        </aside>
      </div>

      {/* FOOTER */}
      <footer
        style={{
          marginTop: "40px",
          padding: "20px",
          textAlign: "center",
          backgroundColor: "#0f172a",
          color: "white",
        }}
      >
        © {new Date().getFullYear()} Opal Zeta. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;
