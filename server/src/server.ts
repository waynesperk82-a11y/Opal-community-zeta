import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

/* ---------------- ROOT ROUTES ---------------- */

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Backend is connected successfully 🚀" });
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "OK" });
});

/* ---------------- QUESTIONS SYSTEM ---------------- */

// Temporary in-memory storage
let questions = [
  {
    id: 1,
    title: "How do I connect React to a backend?",
    author: "Wayne",
    answers: [],
  },
];

// GET all questions
app.get("/questions", (req: Request, res: Response) => {
  res.json(questions);
});

// POST new question
app.post("/questions", (req: Request, res: Response) => {
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({
      error: "Title and author are required",
    });
  }

  const newQuestion = {
    id: questions.length + 1,
    title,
    author,
    answers: [],
  };

  questions.push(newQuestion);

  res.status(201).json(newQuestion);
});

/* ---------------- SERVER START ---------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
