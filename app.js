const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Blog = require("./model/blog");

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//database connection
const dbURI = "mongodb://127.0.0.1:27017/note-tuts";

mongoose
  .connect(dbURI)
  .then((message) => {
    console.log("database connected successful");
    app.listen(3000, () => {
      console.log("server is running on 3000 port");
    });
  })
  .catch((error) => console.log("something went wrong"));

app.get("/", (req, res) => {
  res.redirect("/blogs");
});
app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});
app.get("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((result) => {
      res.render("detail", { blog: result, title: "Blog Details" });
    })
    .catch((err) => console.log(err));
});

app.get("/blogs", (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("index", { title: "All Blogs", blogs: result });
    });
});
app.post("/blogs", (req, res) => {
  const blog = new Blog(req.body);
  blog
    .save()
    .then((result) => {
      res.redirect("/blogs");
    })
    .catch((err) => {
      console.log(err);
    });
});
// app.get("/add-blog", (req, res) => {
//   const blog = new Blog({
//     title: "new blog 2",
//     snippet: "about my new blog",
//     body: "more about my new blog",
//   });
//   blog
//     .save()
//     .then((result) => res.send(result))
//     .catch((error) => {
//       console.log(error);
//     });
// });
// app.get("/all-blog", (req, res) => {
//   Blog.find()
//     .then((result) => {
//       res.send(result);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// });
// app.get("/single-blog", (req, res) => {
//   Blog.findById("6a21264e79dabfeea89f1530")
//     .then((result) => {
//       res.send(result);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// });

app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "Create new blog" });
});

app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
