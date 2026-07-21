import { Router, Response } from "express";
import { query } from "../config/db";
import { authenticate, AuthRequest } from "../middleware/auth";
import { getCompanyContext, getIndustryTasks } from "../services/industryEngine";

const router = Router();
router.use(authenticate);

function normalizeStatus(statusRaw: any): string {
  const s = String(statusRaw || "").toLowerCase();
  if (s.includes("done") || s.includes("completed")) return "done";
  if (s.includes("progress")) return "in_progress";
  if (s.includes("review")) return "review";
  return "todo";
}

function normalizePriority(priorityRaw: any): string {
  const p = String(priorityRaw || "").toLowerCase();
  if (p.includes("critical")) return "critical";
  if (p.includes("high")) return "high";
  if (p.includes("low")) return "low";
  return "medium";
}

const isUuid = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

// GET /api/tasks
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ctx = await getCompanyContext(req.user!.id);
    const { status, priority, assignee } = req.query;
    let sql = "SELECT * FROM tasks WHERE user_id = $1";
    const params: unknown[] = [req.user!.id];

    if (status) { sql += ` AND status = $${params.length + 1}`; params.push(normalizeStatus(status)); }
    if (priority) { sql += ` AND priority = $${params.length + 1}`; params.push(normalizePriority(priority)); }
    if (assignee) { sql += ` AND assignee ILIKE $${params.length + 1}`; params.push(`%${assignee}%`); }

    sql += " ORDER BY created_at DESC";

    let tasks = await query(sql, params);

    // If user has zero tasks in DB, seed industry-specific tasks into PostgreSQL
    if (tasks.length === 0 && !status && !priority && !assignee) {
      const defaultTasks = getIndustryTasks(ctx);
      for (const t of defaultTasks) {
        await query(
          `INSERT INTO tasks (user_id, company_id, title, description, status, priority, assignee, due_date, ai_score, tags)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            req.user!.id,
            ctx.companyId ?? null,
            t.title,
            t.description,
            normalizeStatus(t.status),
            normalizePriority(t.priority),
            t.assignee,
            t.due_date,
            t.ai_score,
            JSON.stringify([t.category || "Strategy"]),
          ]
        );
      }
      tasks = await query(sql, params);
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
    const { title, description, desc, status, priority, assignee, assigneeAgent, due_date, dueDate, ai_score, aiScore, tags, category } = req.body;

    if (!title || !String(title).trim()) {
      res.status(400).json({ success: false, message: "Task title is required" });
      return;
    }

    const normStatus = normalizeStatus(status);
    const normPriority = normalizePriority(priority);
    const finalAssignee = String(assignee ?? assigneeAgent ?? "Executive AI").trim();
    const finalDueDate = String(due_date ?? dueDate ?? "Today").trim();
    const finalScore = Number(ai_score ?? aiScore ?? 92);
    const finalDesc = String(description ?? desc ?? "Manual AI task dispatch").trim();
    const finalTags = JSON.stringify(Array.isArray(tags) ? tags : [category || "Strategy"]);

    const [task] = await query(
      `INSERT INTO tasks (user_id, title, description, status, priority, assignee, due_date, ai_score, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [req.user!.id, String(title).trim(), finalDesc, normStatus, normPriority, finalAssignee, finalDueDate, finalScore, finalTags]
    );

    res.status(201).json({ success: true, task });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// PUT /api/tasks/:id - STRICT UPDATE (Never insert)
router.put("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const taskId = req.params.id;

    if (!isUuid(taskId)) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    const { title, description, desc, status, priority, assignee, assigneeAgent, due_date, dueDate, ai_score, aiScore, tags, category } = req.body;

    const updates: { col: string; val: any }[] = [];

    if (title !== undefined) updates.push({ col: "title", val: String(title).trim() });
    if (description !== undefined || desc !== undefined) updates.push({ col: "description", val: String(description ?? desc).trim() });
    if (status !== undefined) updates.push({ col: "status", val: normalizeStatus(status) });
    if (priority !== undefined) updates.push({ col: "priority", val: normalizePriority(priority) });
    if (assignee !== undefined || assigneeAgent !== undefined) updates.push({ col: "assignee", val: String(assignee ?? assigneeAgent).trim() });
    if (due_date !== undefined || dueDate !== undefined) updates.push({ col: "due_date", val: String(due_date ?? dueDate).trim() });
    if (ai_score !== undefined || aiScore !== undefined) updates.push({ col: "ai_score", val: Number(ai_score ?? aiScore) });
    if (tags !== undefined || category !== undefined) {
      const tagArr = Array.isArray(tags) ? tags : [category || "Strategy"];
      updates.push({ col: "tags", val: JSON.stringify(tagArr) });
    }

    if (updates.length === 0) {
      res.status(400).json({ success: false, message: "No fields provided to update" });
      return;
    }

    const setClauses = updates.map((u, i) => `${u.col} = $${i + 3}`).join(", ");
    const vals = updates.map((u) => u.val);

    const [updatedTask] = await query(
      `UPDATE tasks SET ${setClauses}, updated_at = NOW()
       WHERE id = $1 AND user_id = $2 RETURNING *`,
      [taskId, req.user!.id, ...vals]
    );

    if (!updatedTask) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    res.json({ success: true, task: updatedTask });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// DELETE /api/tasks/:id - STRICT DELETE
router.delete("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const taskId = req.params.id;

    if (!isUuid(taskId)) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    const result = await query("DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id", [taskId, req.user!.id]);
    if (result.length === 0) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    res.json({ success: true, message: "Task deleted", id: taskId });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
