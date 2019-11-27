// Include the cluster module
let cluster = require('cluster');

// Code to run if we're in the master process
if (cluster.isMaster) {

  cluster.fork();
  cluster.fork();

  cluster.on('disconnect', (worker) => {
    console.error('disconnect!');
    cluster.fork();
  });

  // Listen for dying workers
  cluster.on('exit', function (worker) {

    // Replace the dead worker,
    // we're not sentimental
    console.log('Worker %d died :(', worker.id);
    cluster.fork();

  });

  // Code to run if we're in a worker process
} else {
  let express = require('express')
  let bodyParser = require('body-parser');
  let moongoose = require('mongoose');
  // Initialize the app
  let app = express();
  // Import routes
  let apiRoutes = require("./api-routes")

  // Use Api routes in the App
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());

  //get this from a secrets file 
  moongoose.connect(process.env.DATABASE_URL,
    { useNewUrlParser: true });

  var db = moongoose.connection;

  if (!db)
    console.log("db kaput💩");
  else
    console.log("DB is online 🐱‍💻");

  // Setup server port
  var port = process.env.PORT || 8080;
  // Send message for default URL
  app.get('/', (req, res) => res.send('Hello from Worker ' + cluster.worker.id));
  // Launch app to listen to specified port
  app.use('/api', apiRoutes)
  app.listen(port, function () {
    console.log("Running RestHub on port " + port);
    console.log('Worker %d running!', cluster.worker.id);
  });
}
