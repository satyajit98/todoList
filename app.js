//jshint esverion:6

const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

let value = [["Buy Food."], ["Cook Food."], ["Eat Food."]];

const sql = mysql.createConnection({
  host: "127.0.0.1",
  port: "3306",
  user: "root",
  password: "Satyajit@98",
  database: "tododb",
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
  const { newItem: item, list: name } = req.body;
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
      console.log(result);
      if (err) throw err;
      if (!result.length) {
        sql.query(insertCustom, (err, result) => {
          if (err) throw err;
          res.redirect("/" + name);
        });
      } else {
        const data = JSON.parse(result[0].items);
        console.log(data);
        data.push([item]);
        console.log(data);
        sql.query(updateCustom, JSON.stringify(data), (err, result) => {
          if (err) throw err;
          res.redirect("/" + name);
        });
      }
    });
  }
});

app.post("/delete", (req, res) => {
  const { checkbox: checkedId, list: name } = req.body;
  console.log(checkedId);
  console.log(name);
  const delet = `DELETE FROM tasks WHERE id =('${checkedId}')`;

  sql.query(delet, (err, result) => {
    if (err) throw err;
  });
  res.redirect("/");
});

app.get("/:newHome", (req, res) => {
  const requested = req.params.newHome;
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
app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(port, () => {
  console.log("Server Started on port 3000");
});

