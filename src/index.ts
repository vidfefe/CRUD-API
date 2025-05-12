import http, { IncomingMessage } from "http";
import { userRoutes } from "./routes/userRoutes";
import { config } from "dotenv";
import { availableParallelism } from "os";

config();

const PORT = process.env.PORT || 4000;
let currentWorkerId = 0;
const WORKERS_LENGTH = availableParallelism() - 1;

const createServer = (port: number) => {
  return http
    .createServer(async (req, res) => {
      if (port === 4000 && process.env.BALANCER) {
        currentWorkerId =
          currentWorkerId === WORKERS_LENGTH ? 1 : currentWorkerId + 1;

        const requestOptions = {
          hostname: "localhost",
          port: port + currentWorkerId,
          path: req.url,
          method: req.method,
          headers: req.headers,
        };

        const workerRequest = http.request(requestOptions, (workerResponse) => {
          res.writeHead(
            workerResponse.statusCode || 500,
            workerResponse.headers
          );
          workerResponse.pipe(res);
        });

        req.pipe(workerRequest);
      } else {
        userRoutes(req, res);
      }
    })
    .listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
};

if (!process.env.BALANCER) {
  createServer(Number(PORT));
}

export default createServer;
export { currentWorkerId };
