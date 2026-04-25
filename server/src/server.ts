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

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");
  })
  .catch((err: any) => {
    console.error("MongoDB Error ❌", err.message);
    process.exit(1);
  });

/* ---------------- SCHEMAS ---------------- */

const answerSchema = new mongoose.Schema(
  {
    author: String,
    content: String,
  },
  { timestamps: true }
);

const questionSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    image: String,

    likes: { type: Number, default: 0 },
    likedBy: [String], // stores usernames who liked

    answers: [answerSchema],
  },
  { timestamps: true }
);
  { timestamps: true } // ⏱ createdAt + updatedAt
);

const Question = mongoose.model("Question", questionSchema);

/* ---------------- ROOT ROUTE ---------------- */

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Backend is connected successfully 🚀" });
});

/* ---------------- QUESTIONS ---------------- */

// GET all questions (newest first)
app.get("/questions", async (req: Request, res: Response) => {
  const questions = await Question.find().sort({ createdAt: -1 });
  res.json(questions);
});

// GET single question + increase views 👁
app.get("/questions/:id", async (req: Request, res: Response) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    question.views += 1; // 👁 increment views
    await question.save();

    res.json(question);
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

// GET trending questions 🔥
app.get("/questions/trending", async (req: Request, res: Response) => {
  const trending = await Question.find()
    .sort({ likes: -1, views: -1 })
    .limit(5);

  res.json(trending);
});

// POST new question
app.post("/questions", async (req: Request, res: Response) => {
  const { title, author, image, tags } = req.body;

  if (!title || !author) {
    return res.status(400).json({
      error: "Title and author are required",
    });
  }

  const newQuestion = new Question({
    title,
    author,
    image,
    tags: tags || [],
    likes: 0,
    views: 0,
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

// POST like ❤️
app.post("/questions/:id/like", async (req: Request, res: Response) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return res.status(404).json({ error: "Question not found" });
  }

  question.likes += 1;
  await question.save();

  res.json({ likes: question.likes });
});

/* ---------------- SERVER START ---------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
