import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as moongoose from 'mongoose';
import * as cluster from 'cluster';


// Code to run if we're in the master process
if (cluster.isMaster) {

  cluster.fork();
  cluster.fork();

  cluster.on("disconnect", () => {
    console.error("disconnect!");
    cluster.fork();
  });

  // Listen for dying workers
  cluster.on("exit", function (worker: { id: any; }) {

    // Replace the dead worker,
    // we're not sentimental
    console.log("Worker %d died :(", worker.id);
    cluster.fork();

  });

  // Code to run if we're in a worker process
} else {

  // Initialize the app
  const app = express();
  // Import routes
  const apiRoutes = require("./api-routes");

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json({ type: 'application/json' }));

  app.use((err, req, res, next) => {
    if (err) {
      console.log('Invalid Request data' + err)
      console.error(err.stack);
      res.status(400)
        .send({
          status: "1",
          message: "Invalid Request format! detail: " + err
        })
    } else {
      next()
    }
  });

  // get this from a secrets file
  moongoose.connect(process.env.DATABASE_URL,
    { useNewUrlParser: true });

  const db = moongoose.connection;

  if (!db) {
    console.log("db kaput💩");
  } else {
    console.log("DB is online 🐱‍💻");
  }

  // Setup server port
  const port = process.env.PORT || 8080;
  // Send message for default URL
  app.get("/", (req: any, res: any) => res.send("Hello from Worker " + cluster.worker.id));
  // Launch app to listen to specified port
  app.use("/api", apiRoutes);
  app.listen(port, function () {
    console.log("Running RestHub on port " + port);
    console.log("Worker %d running!", cluster.worker.id);
  });
}
