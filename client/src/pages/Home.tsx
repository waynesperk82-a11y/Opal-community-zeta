            import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Header */}
      <header className="bg-black text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Opal Zeta</h1>

        <nav className="flex gap-4">
          <Link to="/login">
            <button className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition">
              Login
            </button>
          </Link>

          <Link to="/signup">
            <button className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition">
              Sign Up
            </button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-4xl font-bold mb-4">
          Welcome to Opal Zeta 🚀
        </h2>

        <p className="text-gray-600 max-w-xl mb-6">
          A powerful platform where users can explore, ask questions, 
          browse content, and manage their profile securely.
        </p>

        <div className="flex gap-4">
          <Link to="/browse">
            <button className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition">
              Browse Questions
            </button>
          </Link>

          <Link to="/ask">
            <button className="bg-purple-500 text-white px-6 py-3 rounded-xl hover:bg-purple-600 transition">
              Ask a Question
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white text-center p-4">
        © 2026 Opal Zeta. All rights reserved.
      </footer>

    </div>
  );
}

export default Home;
