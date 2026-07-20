import { Router, Response } from "express";
import { z } from "zod";
import { query } from "../config/db";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(authenticate);

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "review", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  assignee: z.string().optional(),
  due_date: z.string().optional(),
  ai_score: z.number().min(0).max(100).optional(),
  tags: z.array(z.string()).optional(),
});

import { getCompanyContext, getIndustryTasks } from "../services/industryEngine";

// GET /api/tasks
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ctx = await getCompanyContext(req.user!.id);
    const { status, priority, assignee } = req.query;
    let sql = "SELECT * FROM tasks WHERE user_id = $1";
    const params: unknown[] = [req.user!.id];

    if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
    if (priority) { sql += ` AND priority = $${params.length + 1}`; params.push(priority); }
    if (assignee) { sql += ` AND assignee ILIKE $${params.length + 1}`; params.push(`%${assignee}%`); }

    sql += " ORDER BY created_at DESC";

    let tasks = await query(sql, params);

    if (tasks.length === 0 && !status && !priority && !assignee) {
      const defaultTasks = getIndustryTasks(ctx);
      tasks = defaultTasks.map((t) => ({
        id: t.id,
        user_id: req.user!.id,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        assignee: t.assignee,
        due_date: t.due_date,
        ai_score: t.ai_score,
      }));
    }

    res.json({ success: true, tasks, industry: ctx.industry, businessType: ctx.businessType });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// POST /api/tasks
router.post("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const body = taskSchema.parse(req.body);
    const [task] = await query(
      `INSERT INTO tasks (user_id, title, description, status, priority, assignee, due_date, ai_score, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        req.user!.id,
        body.title,
        body.description ?? null,
        body.status,
        body.priority,
        body.assignee ?? null,
        body.due_date ?? null,
        body.ai_score ?? null,
        body.tags ? JSON.stringify(body.tags) : null,
      ]
    );
    res.status(201).json({ success: true, task });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.flatten().fieldErrors });
      return;
    }
    console.error("Create task error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// PUT /api/tasks/:id
router.put("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const body = taskSchema.partial().parse(req.body);
    const fields = Object.entries(body)
      .filter(([, v]) => v !== undefined)
      .map(([k], i) => `${k} = $${i + 3}`);

    if (fields.length === 0) {
      res.status(400).json({ success: false, message: "No fields to update" });
      return;
    }

    const values = Object.values(body).filter((v) => v !== undefined);
    const [task] = await query(
      `UPDATE tasks SET ${fields.join(", ")}, updated_at = NOW()
       WHERE id = $1 AND user_id = $2 RETURNING *`,
      [req.params.id, req.user!.id, ...values]
    );

    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }
    res.json({ success: true, task });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.flatten().fieldErrors });
      return;
    }
    console.error("Update task error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id",
      [req.params.id, req.user!.id]
    );
    if (result.length === 0) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }
    res.json({ success: true, message: "Task deleted" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
