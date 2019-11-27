
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
app.get('/', (req, res) => res.send('Hello World with Express nooooo'));
// Launch app to listen to specified port
app.use('/api', apiRoutes)
app.listen(port, function () {
  console.log("Running RestHub on port " + port);
});

