const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const routes = require("./src/routes");

const app = express();

const port = process.env.PORT || 3000;

mongoose.connect(
  "mongodb+srv://Teste:teste@cluster0.qoocb.mongodb.net/testedb1?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  },
  function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("MongoDB Conectado");
    }
  }
);

app.use(cors());

app.use(cookieParser());

app.use(express.json());

app.use(routes);

app.listen(port, function () {
  console.log(`Servidor na porta ${port}`);
});
