import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" })); // allow base64 images

/* ---------------- TYPES ---------------- */

type Answer = {
  id: number;
  author: string;
  content: string;
};

type Question = {
  id: number;
  title: string;
  author: string;
  image?: string; // 👈 image support
  answers: Answer[];
};

/* ---------------- ROOT ROUTES ---------------- */

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Backend is connected successfully 🚀" });
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "OK" });
});

/* ---------------- QUESTIONS SYSTEM ---------------- */

let questions: Question[] = [
  {
    id: 1,
    title: "How do I connect React to a backend?",
    author: "Wayne",
    image: undefined,
    answers: [],
  },
];

// GET all questions
app.get("/questions", (req: Request, res: Response) => {
  res.json(questions);
});

// GET single question by ID
app.get("/questions/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const question = questions.find((q) => q.id === id);

  if (!question) {
    return res.status(404).json({ error: "Question not found" });
  }

  res.json(question);
});

// POST new question (with optional image)
app.post("/questions", (req: Request, res: Response) => {
  const { title, author, image } = req.body;

  if (!title || !author) {
    return res.status(400).json({
      error: "Title and author are required",
    });
  }

  const newQuestion: Question = {
    id: questions.length + 1,
    title,
    author,
    image, // 👈 store image
    answers: [],
  };

  questions.push(newQuestion);

  res.status(201).json(newQuestion);
});

// POST answer to a question
app.post("/questions/:id/answers", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { author, content } = req.body;

  const question = questions.find((q) => q.id === id);

  if (!question) {
    return res.status(404).json({ error: "Question not found" });
  }

  if (!author || !content) {
    return res.status(400).json({
      error: "Author and content are required",
    });
  }

  const newAnswer: Answer = {
    id: question.answers.length + 1,
    author,
    content,
  };

  question.answers.push(newAnswer);

  res.status(201).json(newAnswer);
});

/* ---------------- SERVER START ---------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
