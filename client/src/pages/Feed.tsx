import { useEffect, useState } from "react";
import { Link } from "wouter";

interface Question {
  _id: string;
  question: string;
}

function Feed() {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/questions`)
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(() => console.log("Failed to fetch questions"));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white px-8 py-12">

      <h1 className="text-4xl font-bold mb-10 text-center">
        Community Questions
      </h1>

      <div className="max-w-3xl mx-auto space-y-6">
        {questions.length === 0 && (
          <p className="text-slate-400 text-center">
            No questions yet.
          </p>
        )}

        {questions.map((q) => (
          <Link key={q._id} href={`/question/${q._id}`}>
            <div className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition cursor-pointer">
              <p className="text-lg">{q.question}</p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}

export default Feed;
