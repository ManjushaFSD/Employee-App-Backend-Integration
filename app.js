// Task1: initiate app and run server at 3000
const express = require("express");
const app = new express();
const cors = require("cors");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
const { employeeModel } = require("./model/employeeList");

const PORT = process.env.PORT; //3000

app.use(express.static(path.join(__dirname + "/dist/FrontEnd")));
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Task2: create mongoDB connection
mongoose
  .connect(
    "mongodb+srv://manjusharn93:userone@cluster1.ydecups.mongodb.net/EmployeeDB?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Database Connected!");
  })
  .catch(() => {
    console.log("Error connecting");
  });

//Task 2 : write api with error handling and appropriate api mentioned in the TODO below

//TODO: get data from db  using api '/api/employeelist'
app.get("/api/employeelist", async (req, res) => {
  let data = await employeeModel.find()
  .then((docs) => {
    res.json(docs);
  })
  .catch((err) => {
    res.sed(err);
  });
});
//TODO: get single data from db  using api '/api/employeelist/:id'
app.get("/api/employeelist/:id", async (req, res) => {
  let data = await employeeModel.findById(req.params.id)
  .then((doc) => {
    res.json(doc);
  })
  .catch((err) => {
    res.sed(err);
  });
});
//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.post("/api/employeelist", async (req, res) => {
  var data = new employeeModel(req.body);
  data.save().then((doc) => {
    res.json(doc);
  })
  .catch((err) => {
    res.sed(err);
  });
});
//TODO: delete a employee data from db by using api '/api/employeelist/:id'
app.delete("/api/employeelist/:id", async (req, res) => {
  let data = await employeeModel
    .findByIdAndDelete(req.params.id)
    .then((result) => {
      res.json({ status: "ok", result: result });
    })
    .catch((err) => {
      res.send(err);
    });
});
//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.put("/api/employeelist/:id", async (req, res) => {
  let data = await employeeModel
    .findOneAndUpdate(
      {
        _id: req.params.id,
      },
      req.body
    )
    .then((doc) => {
      res.json({ status: "ok", result: req.body });
    })
    .catch((err) => {
      res.send(err);
    });
});
//! dont delete this code. it connects the front end file.
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/Frontend/index.html"));
});

//Server listening on http://localhost:3000/api/

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
