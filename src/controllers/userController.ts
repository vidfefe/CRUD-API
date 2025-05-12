import { IncomingMessage, ServerResponse } from "http";
import { v4 as uuidv4 } from "uuid";
import { usersDB } from "../models/userModel";

const setJsonHeader = (res: ServerResponse) => {
  res.setHeader("Content-Type", "application/json");
};

export const getAllUsers = (req: IncomingMessage, res: ServerResponse) => {
  res.statusCode = 200;
  setJsonHeader(res);
  res.end(JSON.stringify(usersDB));
};

export const getUserById = (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
) => {
  if (!isValidUUID(userId)) {
    res.statusCode = 400;
    setJsonHeader(res);
    res.end(JSON.stringify({ message: "Invalid userId" }));
    return;
  }
  const user = usersDB.find((user) => user.id === userId);
  if (user) {
    res.statusCode = 200;
    setJsonHeader(res);
    res.end(JSON.stringify(user));
  } else {
    res.statusCode = 404;
    setJsonHeader(res);
    res.end(JSON.stringify({ message: "User not found" }));
  }
};

export const createUser = (req: IncomingMessage, res: ServerResponse) => {
  let body: string = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const { username, age, hobbies } = JSON.parse(body);
      if (!username || !age || !hobbies) {
        res.statusCode = 400;
        setJsonHeader(res);
        res.end(JSON.stringify({ message: "Missing required fields" }));
        return;
      }
      const newUser = { id: uuidv4(), username, age, hobbies };
      usersDB.push(newUser);
      res.statusCode = 201;
      setJsonHeader(res);
      res.end(JSON.stringify(newUser));
    } catch (error) {
      res.statusCode = 500;
      setJsonHeader(res);
      res.end(JSON.stringify({ message: "Internal server error" }));
    }
  });
};

export const updateUser = (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
) => {
  if (!isValidUUID(userId)) {
    res.statusCode = 400;
    setJsonHeader(res);
    res.end(JSON.stringify({ message: "Invalid userId" }));
    return;
  }

  const user = usersDB.find((user) => user.id === userId);
  if (!user) {
    res.statusCode = 404;
    setJsonHeader(res);
    res.end(JSON.stringify({ message: "User not found" }));
    return;
  }

  let body: string = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const { username, age, hobbies } = JSON.parse(body);
      if (username) user.username = username;
      if (age) user.age = age;
      if (hobbies) user.hobbies = hobbies;
      res.statusCode = 200;
      setJsonHeader(res);
      res.end(JSON.stringify(user));
    } catch (error) {
      res.statusCode = 500;
      setJsonHeader(res);
      res.end(JSON.stringify({ message: "Internal server error" }));
    }
  });
};

export const deleteUser = (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
) => {
  if (!isValidUUID(userId)) {
    res.statusCode = 400;
    setJsonHeader(res);
    res.end(JSON.stringify({ message: "Invalid userId" }));
    return;
  }

  const index = usersDB.findIndex((user) => user.id === userId);
  if (index !== -1) {
    usersDB.splice(index, 1);
    res.statusCode = 204;
    setJsonHeader(res);
    res.end();
  } else {
    res.statusCode = 404;
    setJsonHeader(res);
    res.end(JSON.stringify({ message: "User not found" }));
  }
};

const isValidUUID = (id: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};
