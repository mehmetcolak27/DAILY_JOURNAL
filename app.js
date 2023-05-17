require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Welcome to DAILY JOURNAL, your daily companion for personal growth and self-reflection. Here, we believe that daily journaling is a powerful tool for cultivating self-awareness, creativity, and emotional well-being. Whether you're new to journaling or have been doing it for years, we're here to help you build a daily journaling practice that works for you. Our website provides a wealth of resources, including prompts, exercises, and tips for overcoming writer's block and staying motivated.";
const aboutContent = "The story behind the DAILY JOURNAL website - Share your personal motivation for creating this site and why daily journaling is important to you.Our mission - Outline the goals and values of your website and how you aim to help others with their daily journaling practice.Meet the team - Introduce yourself and any other team members involved in creating and maintaining the website. Share your backgrounds and qualifications related to journaling.";
const contactContent = "Contact information - Provide a clear and easy-to-find contact form or email address for visitors to reach you. Frequently asked questions - Consider including an FAQ section to help visitors find quick answers to common questions.Social media links - If you have social media accounts related to your website, provide links so visitors can connect with you there as well.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://"+process.env.Admin+":"+process.env.Password+"@cluster0.wqcnvwr.mongodb.net/blogDB");

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);


app.get("/", async function(req, res){
 
  await Post.find()
  .then(function(posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  }).catch(function(err) {
    console.log(err);
    });
  
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", async function(req, res){
   const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


 await post.save()
 .then (save => {
        res.redirect("/");
  })
  .catch(function(err) {
    console.log(err);
    });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId})
  .then( function(post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  })
  .catch(function(err) {
    console.log(err);
    });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.listen(process.env.PORT || 3000, function () {
  console.log("Server started successfully.");
});
