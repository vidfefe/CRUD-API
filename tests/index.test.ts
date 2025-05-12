import request from "supertest";
import createServer from "../src/index";

const PORT = 5000;
let server: ReturnType<typeof createServer>;
let userId: string;

beforeAll((done) => {
  server = createServer(PORT);
  done();
});

afterAll((done) => {
  server.close(done);
});

describe("User API tests", () => {
  test("GET /api/users → should return empty array", async () => {
    const response = await request(server).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("POST /api/users → should create a user", async () => {
    const newUser = {
      username: "John Doe",
      age: 30,
      hobbies: ["reading", "gaming"],
    };

    const response = await request(server)
      .post("/api/users")
      .send(newUser)
      .set("Content-Type", "application/json");

    console.log(response);

    expect(response.status).toBe(201);
    expect(response.body.username).toBe(newUser.username);
    expect(response.body.age).toBe(newUser.age);
    expect(Array.isArray(response.body.hobbies)).toBe(true);
    userId = response.body.id;
  });

  test("GET /api/users/:userId → should get created user by ID", async () => {
    const response = await request(server).get(`/api/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(userId);
  });

  test("PUT /api/users/:userId → should update the user", async () => {
    const updatedUser = {
      username: "Jane Doe",
      age: 35,
    };

    const response = await request(server)
      .put(`/api/users/${userId}`)
      .send(updatedUser)
      .set("Content-Type", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.username).toBe("Jane Doe");
    expect(response.body.age).toBe(35);
  });

  test("DELETE /api/users/:userId → should delete the user", async () => {
    const response = await request(server).delete(`/api/users/${userId}`);
    expect(response.status).toBe(204);
  });

  test("GET /api/users/:userId → should return 404 after deletion", async () => {
    const response = await request(server).get(`/api/users/${userId}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });
});
