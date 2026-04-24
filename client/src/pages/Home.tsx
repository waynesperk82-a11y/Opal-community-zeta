import { Link } from "wouter";

function Home() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* NAVBAR */}
      <header className="flex justify-between items-center px-8 py-4 bg-slate-900 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-blue-500">
          Opal Zeta
        </h1>

        <div className="space-x-4">
          <Link href="/login">
  <button className="px-4 py-2 bg-slate-800 text-white rounded">
    Login
  </button>
</Link>

<Link href="/signup">
  <button className="px-4 py-2 bg-blue-600 text-white rounded">
    Sign Up
  </button>
</Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6">
        <h2 className="text-5xl font-bold mb-6">
          Ask. Answer. Grow.
        </h2>

        <p className="text-slate-400 max-w-2xl mb-8">
          Opal Zeta is a powerful community where people ask real questions,
          get real answers from real people — and when nobody answers,
          AI steps in instantly.
        </p>

        <div className="flex flex-col items-center">
  <Link href="/ask">
    <button className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-300">
      Ask a Question
    </button>
  </Link>

  <Link href="/questions">
    <button className="mt-4 px-8 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition duration-300">
      Browse Questions
    </button>
  </Link>
</div>
          </button>
        </Link>
      </section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-3 gap-8 px-10 py-20 bg-slate-900">
        <div className="bg-slate-800 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-3">Community Powered</h3>
          <p className="text-slate-400">
            Get answers from real people with experience.
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-3">AI Backup</h3>
          <p className="text-slate-400">
            No question goes unanswered. AI responds instantly.
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-3">Smart Discussions</h3>
          <p className="text-slate-400">
            Clean threads. Helpful answers. Real value.
          </p>
        </div>
      </section>

      {/* ADS SECTION */}
      <section className="px-10 py-16 bg-slate-950 text-center border-t border-slate-800">
        <p className="text-slate-500 mb-4">Advertisement</p>

        <div className="bg-slate-800 h-24 rounded-xl flex items-center justify-center text-slate-400">
          Your Ad Here
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto bg-slate-900 border-t border-slate-800 py-6 text-center text-slate-500">
        © 2026 Opal Zeta. All rights reserved.
      </footer>

    </div>
  );
}

export default Home;
