const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const io = require("./socket");
const path = require("path");
const dotenv = require("dotenv");

const route = require("./routes/router");

const corsOptions = {
  origin: "https://6489a0fd4661030008fcf284--startling-lily-2ee1c2.netlify.app",
  credentials: true,
  optionSuccessStatus: 200,
};

dotenv.config();
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGOOSE_URL);

const server = http.createServer(app);

route(app);

io(server);

server.listen(3001);
