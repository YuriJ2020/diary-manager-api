const { Router } = require("express");

const diary = require("../controllers/diary");
const login = require("../controllers/login");
const signup = require("../controllers/signup");
// const view = require("controllers/view");

module.exports = Router()
  // Login and Sign-Up.
  .post("/api/login", login.validate, login.post)
  .post("/api/signup", signup.validate, signup.post)

  // Diary CRUD.
  // .get("/api/diary", diary.get)
  .post("/api/diary", diary.validateCreation, diary.post);
// .put("/api/diary", diary.validateCreation, diary.put)
// .delete("/api/diary", diary.validateQuery, diary.delete);
