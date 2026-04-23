import { useState } from "react";

function Ask() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    if (!question) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/ask`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        }
      );

      const data = await res.json();
      setResponse(data.answer);
    } catch {
      setResponse("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-20 px-6">

      <h1 className="text-4xl font-bold mb-8">
        Ask the Community
      </h1>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="What’s your question?"
        className="w-full max-w-2xl p-4 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleSubmit}
        className="mt-6 px-8 py-3 bg-blue-600 rounded-xl hover:bg-blue-500 transition"
      >
        Submit Question
      </button>

      {response && (
        <div className="mt-10 bg-slate-800 p-6 rounded-xl max-w-2xl w-full">
          <h3 className="font-semibold mb-2">Answer:</h3>
          <p className="text-slate-300">{response}</p>
        </div>
      )}

    </div>
  );
}

export default Ask;
