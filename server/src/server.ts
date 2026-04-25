import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

/* ---------------- MONGODB CONNECTION ---------------- */

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is NOT defined in environment variables");
  process.exit(1);
}

console.log("Using Mongo URI:", MONGO_URI);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");
  })
  .catch((err: any) => {
    console.error("MongoDB Error ❌");
    console.error("Message:", err.message);
    console.error("Full error:", err);
    process.exit(1);
  });
/* ---------------- SCHEMAS ---------------- */

const answerSchema = new mongoose.Schema({
  author: String,
  content: String,
});

const questionSchema = new mongoose.Schema({
  title: String,
  author: String,
  image: String,
  answers: [answerSchema],
});

const Question = mongoose.model("Question", questionSchema);

/* ---------------- ROOT ROUTES ---------------- */

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Backend is connected successfully 🚀" });
});

/* ---------------- QUESTIONS ---------------- */

// GET all questions
app.get("/questions", async (req: Request, res: Response) => {
  const questions = await Question.find().sort({ _id: -1 });
  res.json(questions);
});

// GET single question
app.get("/questions/:id", async (req: Request, res: Response) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(question);
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

// POST new question
app.post("/questions", async (req: Request, res: Response) => {
  const { title, author, image } = req.body;

  if (!title || !author) {
    return res.status(400).json({
      error: "Title and author are required",
    });
  }

  const newQuestion = new Question({
    title,
    author,
    image,
    answers: [],
  });

  await newQuestion.save();

  res.status(201).json(newQuestion);
});

// POST answer
app.post("/questions/:id/answers", async (req: Request, res: Response) => {
  const { author, content } = req.body;

  const question = await Question.findById(req.params.id);

  if (!question) {
    return res.status(404).json({ error: "Question not found" });
  }

  question.answers.push({ author, content });

  await question.save();

  res.status(201).json(question);
});

/* ---------------- SERVER START ---------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
