//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/BlogWeb")
mongoose.connect(process.env.MONGO_URI)

const dbSchema = new mongoose.Schema({
  titleName: String,
  content: String
})

const blog = mongoose.model("blog", dbSchema);

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const array = [];

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
let val ={};
app.get("/", function (req, res) {
  blog.find({}, function (err, value) {
    if (err) {
      console.log(err)
    }
    else {
      console.log("find successfully")
      val = value;
      res.render("home", { text: homeStartingContent, object: value })
    }
  })
})
app.get("/compose", function (req, res) {
  res.render("compose", { text: homeStartingContent })
})

app.get("/about", function (req, res) {
  res.render("about", { text: aboutContent })
})

app.get("/contact", function (req, res) {
  res.render("contact", { text: contactContent })
})

app.get("/post/:title", function (req, res) {
      val.forEach(function (value, index) {
        let str = _.lowerCase(value.titleName)
        let str2 = _.lowerCase(req.params.title);
        if (str === str2) {
          console.log("match found");
          res.render("post", { titlee: value.titleName, content: value.content })
        }
        else {
          console.log("match not found");
        }
      })
})


app.post("/compose", function (req, res) {
  const Blog = new blog({
    titleName: req.body.titleText,
    content: req.body.postText
  })
  Blog.save();
  res.redirect("/")
})



let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);
