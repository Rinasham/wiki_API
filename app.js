const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require('mongoose')

const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))

//--------DB settings------------------
mongoose.connect('mongodb://localhost:27017/wikiDB',{useNewUrlParser: true})

const articlesSchema = new mongoose.Schema({
  title:{
    type:String,
    required: [true, 'Title is not specified.']
  },
  content:{
    type:String,
    required: [true, 'Content is not specified.']
  },
})

const Article = mongoose.model('Article', articlesSchema)


//--------------------------------------

app.route('/articles')
  .get(function(req, res){
    Article.find({}, function(err, foundArticles){
      if(!err){
        res.send(foundArticles)
      } else {
        res.send(err)
      }
    })
  })

  .post(function(req, res){
    const article = new Article({
      title: req.body.title,
      content: req.body.content
    })
    article.save(function(err,){
      if(!err){
        res.send('Successfullt added a new article.')
      } else {
        res.send(err)
      }
    })
  })

  .delete(function(req, res){
    Article.deleteMany({}, function(err){
      if(!err){
        res.send('Successfully deleted all articles.')
      } else {
        res.send(err)
      }
    })
  })

//-------------Requests targeting a specific article-----------------------

app.route('/articles/:articleTitle')
  .get(function(req, res){
    Article.findOne(
      {title: req.params.articleTitle},
      function(err, foundArticle){
        if(foundArticle){
          res.send(foundArticle)
        } else {
          res.send('No articles matching that title was found.')
        }
      }
    )
  })

  .put(function(req, res){
    Article.updateOne(
      {title: req.params.articleTitle}, // search for the data do you want to update
      {title:req.body.title,
      content: req.body.content}, // data you want to overwrite with
      function(err){
        if(!err){
          res.send('Successfullt update article.')
        }
      }

    )
  })

  .patch(function(req, res){
    Article.updateOne(
      {title: req.params.articleTitle},
      {$set : req.body},
      function(err){
        if(!err){
          res.send('Successfully updated article.')
        }
      }
    )
  })

  .delete(function(req, res){
    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err){
        if(!err){
          res.send('Successfully deleted the corresponding article.')
        }
      }
    )
  })





app.listen(3000, function(){
  console.log('Server started on port 3000.')
})