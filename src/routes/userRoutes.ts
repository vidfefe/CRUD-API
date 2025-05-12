import { IncomingMessage, ServerResponse } from "http";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";

export const userRoutes = (req: IncomingMessage, res: ServerResponse): void => {
  if (req.url) {
    switch (true) {
      case req.url === "/api/users" && req.method === "GET":
        getAllUsers(req, res);
        break;
      case req.url.match(/^\/api\/users\/[\w-]+$/) && req.method === "GET":
        getUserById(req, res, req.url.split("/")[3]);
        break;
      case req.url === "/api/users" && req.method === "POST":
        createUser(req, res);
        break;
      case req.url.match(/^\/api\/users\/[\w-]+$/) && req.method === "PUT":
        updateUser(req, res, req.url.split("/")[3]);
        break;
      case req.url.match(/^\/api\/users\/[\w-]+$/) && req.method === "DELETE":
        deleteUser(req, res, req.url.split("/")[3]);
        break;
      default:
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "Route not found" }));
    }
  } else {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Invalid URL" }));
  }
};
