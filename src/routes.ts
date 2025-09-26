import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.ts";
import database from "./database.ts";

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req: any, res: any) => {
      const search = req.query
      let tasks = database.select("tasks", null, search);
      res.end(JSON.stringify({ tasks }));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: async (req: any, res: any) => {

      const { title, description } = req.body

      if (!title || !description) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: "preencha os campos" }))
      }

      let tasks = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert("tasks", tasks);

      res.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: async (req: any, res: any) => {
      const { id } = req.params
      const { title, description } = req.body

      if (!title && !description) {
        res
          .writeHead(404)
          .end(JSON.stringify({ message: "informe ao menos um campo para atualizar" }));
        return;
      }

      const taskUpdated = database.update("tasks", id, {
        ...(title && { title }),
        ...(description && { description })
      });

      if (!taskUpdated) {
        res
          .writeHead(404)
          .end(JSON.stringify({ message: "task não encontrada" }));
        return;
      }

      res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: async (req: any, res: any) => {
      const { id } = req.params;

      const taskExists = database.select("tasks", id);

      if (!taskExists) {
        res
          .writeHead(404)
          .end(JSON.stringify({ message: "task não encontrada" }));
        return;
      }

      database.delete("tasks", id);

      res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: async (req: any, res: any) => {
      const { id } = req.params;

      const task = database.select("tasks", id);

      if (!task) {
        res
          .writeHead(404)
          .end(JSON.stringify({ message: "task não encontrada" }));
        return;
      }

      const completed_at = task.completed_at ? null : new Date();

      database.update("tasks", id, { completed_at });

      res.writeHead(204).end();
    },
  },
];
