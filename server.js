const express = require("express");
const app = express();
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
// https://mongoosejs.com/docs/queries.html
const cors = require("cors");
const path = require("path");

// configure cors
app.use(cors());

// configure dotEnv
dotEnv.config({ path: "./config/config.env" });

// configure express to receive the form data
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
//-------cloud------
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

const hostname = process.env.HOST_NAME;
const port = process.env.PORT || 5000;

app.get("/", (request, response) => {
  response.send(`<h2>Welcome to BigBasket Express Server</h2>`);
});

// connect to Mongo DB Database
mongoose
  .connect(process.env.MONGO_DB_CLOUD_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((response) => {
    console.log(`Connected to Mongo DB Successfully...........`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1); // stop the node js process if unable to connect to mongodb
  });

// for React Application Home Page
app.use(express.static(path.join(__dirname, "build")));
app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "build", "index.html"));
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "build")));
  app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "build", "index.html"));
  });
}

// configure the router
app.use(`${process.env.BASE_URL}/api`, require("./router/apiRouter"));

// app.listen(port, hostname, () => {
//   console.log(`Express Server is Started at http://${hostname}:${port}`);
// });
//----- cloud ---
//listen on port
app.listen(port, () => {
  console.log("Express Server Started ......");
});
