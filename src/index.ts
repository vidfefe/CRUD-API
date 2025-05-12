import { createServer } from "http";
import { userRoutes } from "./routes/userRoutes";
import { config } from "dotenv";

config();

const port = process.env.PORT || 4000;

const server = createServer(userRoutes);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
