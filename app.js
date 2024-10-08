//jshint esverion:6

const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const _ = require("lodash");
require("dotenv").config();

const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

let value = [["Buy Food."], ["Cook Food."], ["Eat Food."]];

const sql = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

sql.connect((err) => {
  if (err) throw err;
});

app.get("/", (req, res) => {
  let con = "SELECT * FROM tasks";

  sql.query(con, (err, result) => {
    if (result.length === 0) {
      let con = "INSERT INTO tasks(task) VALUES ?";

      sql.query(con, [value], (err, result) => {
        if (err) throw err;
      });

      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newItems: result });
    }
  });
});

app.post("/", (req, res) => {
  const { list: name, newItem: item } = req.body;
  const insert = `INSERT INTO tasks(task) VALUES ('${item}')`;
  const insertCustom = `INSERT INTO customList(name,items) VALUES ('${name}','[["${item}"]]')`;
  const updateCustom = `UPDATE customList SET items = ? WHERE name="${name}"`;

  const search = `SELECT * FROM customList WHERE name="${name}"`;

  if (name === "Today") {
    sql.query(insert, (err, result) => {
      if (err) throw err;
    });

    res.redirect("/");
  } else {
    sql.query(search, (err, result) => {
      if (err) throw err;
      if (!result.length) {
        sql.query(insertCustom, (err, result) => {
          if (err) throw err;
          res.redirect("/" + name);
        });
      } else {
        const data = JSON.parse(result[0].items);
        data.push([item]);
        sql.query(updateCustom, JSON.stringify(data), (err, result) => {
          if (err) throw err;
          res.redirect("/" + name);
        });
      }
    });
  }
});

app.get("/:newHome", (req, res) => {
  const requested = _.capitalize(req.params.newHome);
  const query = "SELECT * FROM customList WHERE name = ?";

  sql.query(query, requested, (err, result) => {
    if (err) throw err;

    if (result.length === 0) {
      const insertItem = "INSERT INTO customList (name, items) VALUES (?, ?)";
      const values = [requested, JSON.stringify(value)];

      sql.query(insertItem, values, (err) => {
        if (err) throw err;
        res.redirect("/" + requested);
      });
    } else {
      const foundList = JSON.parse(JSON.stringify(result[0]));
      res.render("custom", {
        listTitle: foundList.name,
        newItems: JSON.parse(foundList.items),
      });
    }
  });
});

app.post("/delete", (req, res) => {
  const { checkbox: checkedId, listName: name } = req.body;
  const deletTask = `DELETE FROM tasks WHERE id =('${checkedId}')`;
  const search = `SELECT * FROM customList WHERE name="${name}"`;
  const updateCustom = `UPDATE customList SET items = ? WHERE name="${name}"`;

  if (name === "Today") {
    sql.query(deletTask, (err, result) => {
      if (err) throw err;
    });
    res.redirect("/");
  } else {
    sql.query(search, (err, result) => {
      if (err) throw err;
      const data = JSON.parse(result[0].items);
      data.pop([checkedId]);
      if (result.length) {
        sql.query(updateCustom, JSON.stringify(data), (err, result) => {
          if (err) throw err;
        });
        res.redirect("/" + name);
      }
    });
  }
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(port, () => {
  console.log("Server Started on port 3000");
});
