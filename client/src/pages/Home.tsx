import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-600 text-white flex flex-col">

      {/* Navbar */}
      <header className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold tracking-wide">
          Opal Zeta
        </h1>

        <div className="flex gap-4">
          <Link to="/login">
            <button className="px-5 py-2 rounded-lg bg-white text-purple-600 font-semibold hover:bg-gray-200 transition">
              Login
            </button>
          </Link>

          <Link to="/signup">
            <button className="px-5 py-2 rounded-lg bg-purple-800 hover:bg-purple-900 transition">
              Sign Up
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
          Ask. Answer. Grow.
        </h2>

        <p className="max-w-xl text-lg text-purple-100 mb-8">
          Opal Zeta is a community-driven platform where people ask questions,
          share knowledge, and get AI-powered answers when the community can't respond.
        </p>

        <div className="flex gap-4">
          <Link to="/browse">
            <button className="px-6 py-3 bg-white text-purple-600 font-bold rounded-xl shadow-lg hover:scale-105 transition">
              Browse Questions
            </button>
          </Link>

          <Link to="/ask">
            <button className="px-6 py-3 bg-purple-900 rounded-xl shadow-lg hover:scale-105 transition">
              Ask a Question
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center p-6 text-purple-200 text-sm">
        © 2026 Opal Zeta. Built for curious minds 🚀
      </footer>
    </div>
  );
}            
