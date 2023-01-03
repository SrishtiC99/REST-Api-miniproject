const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

main().catch(err => console.log(err));

async function main(){
  await mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');
}

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
})

const Article = new mongoose.model("Article", articleSchema);

app.route("/articles")
  // GET: Fetch all the articles
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    })
  })
  // POST: Creates one new article
  .post(function(req, res) {
    let title = req.body.title;
    let content = req.body.content;
    const newArticle = new Article({
      title: title,
      content: content
    })
    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added a new article!");
      } else {
        res.send(err);
      }
    });
  })
  // DELETE: Delete all the articles
  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted all the articles!");
      } else {
        console.log(err);
        res.send(err);
      }
    })
  });

// Requests targeting a specific article
app.route("/articles/:articleTitle")
  .get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
      if(!err){
        res.send(foundArticle);
      }
      else{
        console.log("no match");
        res.send("No article of that title was found");
      }
    })
  })
  .put(function(req, res){
    Article.replaceOne(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      function(err){
        if(!err){
          res.send("Successfully replaced article!");
        }
      }
    )
  })
  .patch(function(req, res){
    Article.updateOne(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("Successfully updated article!");
        }
      }
    )
  })
  .delete(function(req, res){
    Article.deleteOne({title: req.params.articleTitle},
    function(err, result){
      if(!err){
        if (result.deletedCount === 1) {
            res.send("Successfully deleted the corresponding article");
          } else {
            res.send("Article not found!");
          }
      }
      else{
        res.send(err);
      }
    })
  });

app.listen("3000", function(req, res){
  console.log("Server is running at port 3000");
})
