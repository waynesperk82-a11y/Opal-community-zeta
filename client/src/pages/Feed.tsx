import { Link } from "wouter";

function Feed() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Community Questions</h1>
        <Link href="/">
          <button className="px-4 py-2 bg-slate-800 rounded-xl hover:bg-slate-700 transition">
            Home
          </button>
        </Link>
      </div>

      {/* QUESTIONS LIST */}
      <div className="space-y-6">

        {/* Question Card */}
        <div className="bg-slate-900 p-6 rounded-2xl hover:bg-slate-800 transition">
          <h2 className="text-xl font-semibold mb-2">
            How do I learn React fast?
          </h2>
          <p className="text-slate-400 mb-3">
            Asked by John • 5 answers
          </p>
          <Link href="/question/1">
            <button className="text-blue-400 hover:underline">
              View Answers
            </button>
          </Link>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl hover:bg-slate-800 transition">
          <h2 className="text-xl font-semibold mb-2">
            What is the best way to make money online?
          </h2>
          <p className="text-slate-400 mb-3">
            Asked by Sarah • 2 answers
          </p>
          <Link href="/question/2">
            <button className="text-blue-400 hover:underline">
              View Answers
            </button>
          </Link>
        </div>

      </div>

      {/* ADS SECTION */}
      <div className="mt-12 bg-slate-800 p-6 rounded-2xl text-center">
        <p className="text-slate-400 mb-2">Advertisement</p>
        <div className="h-24 bg-slate-700 rounded-xl flex items-center justify-center">
          Your Ad Here
        </div>
      </div>

    </div>
  );
}

export default Feed;
