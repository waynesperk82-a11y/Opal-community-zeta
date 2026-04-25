import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

/* ---------------- SIMPLE AUTH MIDDLEWARE ---------------- */
// Reads username from request header
const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const username = req.headers.username as string;

  if (!username) {
    return res.status(401).json({
      error: "Username required in headers",
    });
  }

  (req as any).username = username;
  next();
};

/* ---------------- MONGODB CONNECTION ---------------- */

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is NOT defined");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
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
    tags: [String],

    likes: { type: Number, default: 0 },
    likedBy: [String],

    views: { type: Number, default: 0 },

    answers: [answerSchema],
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

/* ---------------- ROOT ---------------- */

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Backend is connected successfully 🚀" });
});

/* ---------------- QUESTIONS ---------------- */

// GET all (newest first)
app.get("/questions", async (req: Request, res: Response) => {
  const questions = await Question.find().sort({ createdAt: -1 });
  res.json(questions);
});

// GET single + increase views
app.get("/questions/:id", async (req: Request, res: Response) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question)
      return res.status(404).json({ error: "Not found" });

    question.views += 1;
    await question.save();

    res.json(question);
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

// GET trending
app.get("/questions/trending", async (req: Request, res: Response) => {
  const trending = await Question.find()
    .sort({ likes: -1, views: -1 })
    .limit(5);

  res.json(trending);
});

// CREATE question
app.post(
  "/questions",
  requireUser,
  async (req: Request, res: Response) => {
    const username = (req as any).username;
    const { title, image, tags } = req.body;

    if (!title) {
      return res.status(400).json({
        error: "Title is required",
      });
    }

    const newQuestion = new Question({
      title,
      author: username,
      image,
      tags: tags || [],
      likes: 0,
      views: 0,
      answers: [],
    });

    await newQuestion.save();

    res.status(201).json(newQuestion);
  }
);

// EDIT question (author only)
app.put(
  "/questions/:id",
  requireUser,
  async (req: Request, res: Response) => {
    const username = (req as any).username;
    const { title, image, tags } = req.body;

    const question = await Question.findById(req.params.id);

    if (!question)
      return res.status(404).json({ error: "Not found" });

    if (question.author !== username) {
      return res.status(403).json({
        error: "You can only edit your own question",
      });
    }

    if (title !== undefined) question.title = title;
    if (image !== undefined) question.image = image;
    if (tags !== undefined) question.tags = tags;

    await question.save();

    res.json(question);
  }
);

// DELETE question (author only)
app.delete(
  "/questions/:id",
  requireUser,
  async (req: Request, res: Response) => {
    const username = (req as any).username;

    const question = await Question.findById(req.params.id);

    if (!question)
      return res.status(404).json({ error: "Not found" });

    if (question.author !== username) {
      return res.status(403).json({
        error: "You can only delete your own question",
      });
    }

    await question.deleteOne();

    res.json({ message: "Question deleted successfully" });
  }
);

// ADD answer
app.post(
  "/questions/:id/answers",
  requireUser,
  async (req: Request, res: Response) => {
    const username = (req as any).username;
    const { content } = req.body;

    const question = await Question.findById(req.params.id);

    if (!question)
      return res.status(404).json({ error: "Not found" });

    question.answers.push({
      author: username,
      content,
    });

    await question.save();

    res.status(201).json(question);
  }
);

// LIKE (no double-like)
app.post(
  "/questions/:id/like",
  requireUser,
  async (req: Request, res: Response) => {
    const username = (req as any).username;

    const question = await Question.findById(req.params.id);

    if (!question)
      return res.status(404).json({ error: "Not found" });

    if (question.likedBy.includes(username)) {
      return res.status(400).json({
        error: "You already liked this question",
      });
    }

    question.likes += 1;
    question.likedBy.push(username);

    await question.save();

    res.json({ likes: question.likes });
  }
);

/* ---------------- SERVER ---------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
