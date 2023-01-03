const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

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

app.listen("3000", function(req, res){
  console.log("Server is running at port 3000");
})
