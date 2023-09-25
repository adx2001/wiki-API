var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/wikiDB")
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

//create schema for collection
const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

// create model
const Article = mongoose.model("articles", articleSchema);

// //fetching all the values in collection
// router.get('/articles', (req, res) => {
//   Article.find()
//     .then((articles) => {
//       console.log(articles);
//       res.send(articles);
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// });

// //post datas from client and save to mongodb collection

// router.post('/articles',(req,res)=>{
//   console.log(req.body.title);
//   console.log(req.body.content);

//   const newArticle= new Article({
//     title:req.body.title,
//     content:req.body.content
//   });

//   newArticle.save()
//   .then(()=>{
//     res.send("Successfully added")
//   })
//   .catch((err)=>{
//     res.send(err)
//   })
// });

// //delete the collection

// router.delete('/articles',(req,res)=>{
//   Article.deleteMany()
//   .then(()=>{
//     res.send("successfully deleted")
//   })
//   .catch((err)=>{
//     res.send(err)
//   })
// })

//using route method in express for refactor the code by chaining it

////////////////////////////////////////////////////request targeting all articles//////////////////////////////////////////////////////////////////////////

router
  .route("/articles")
  .get((req, res) => {
    Article.find()
      .then((articles) => {
        console.log(articles);
        res.send(articles);
      })
      .catch((err) => {
        console.error(err);
      });
  })
  .post((req, res) => {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle
      .save()
      .then(() => {
        res.send("Successfully added");
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .delete((req, res) => {
    Article.deleteMany()
      .then(() => {
        res.send("successfully deleted");
      })
      .catch((err) => {
        res.send(err);
      });
  });

////////////////////////////////////////////////////request targeting a specific article//////////////////////////////////////////////////////////////////////////

router
  .route("/articles/:id")
  .get((req, res) => {
    Article.findOne({ title: req.params.id })
      .then((result) => {
        res.send(result || "Nothing found");
      })
      .catch((err) => {
        res.status(500).send("Error occurred while fetching data");
      });
  })
  /////updates the entire document that if we leave any field blank then specific field will get removed form the document/////////
  .put((req, res) => {
    const { id } = req.params;
    const updatedArticle = {
      title: req.body.title,
      content: req.body.content,
    };
    Article.findOneAndUpdate({ title: id }, updatedArticle, { overwrite: true })
      .then(() => res.send("Successfully updated article"))
      .catch((err) => res.status(500).send("Error updating article"));
  })
  /////////////////////////////////////////////////////update only a specific field//////////////////////////////////
  .patch((req, res) => {
    Article.findOneAndUpdate({ title: req.params.id }, { $set: req.body })
      .then(() => res.send("successfully updated specific field"))
      .catch((err) => res.send(err));
  })
  /////////////////////delete a particular document ///////////////////////////
  .delete((req, res) => {
    const {id}=req.params;
    Article.deleteOne({ title: id })
      .then(() => res.send("successfully deleted"))
      .catch((err) => res.send("err"));
  });

module.exports = router;
