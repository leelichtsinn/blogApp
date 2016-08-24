// include packages
var express = require('express');
var fs = require('fs');
var _ = require('lodash');
var pg = require('pg');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');

// create an http server
var app = express();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });


app.set('views', './views'); // specify the views directory
app.set('view engine', 'ejs');

// new Sequelize('database', 'username', 'password', options)
var sequelize = new Sequelize('leelichtsinn', 'leelichtsinn', '', {
  host: 'localhost',
  dialect: 'postgres'
});

var User = sequelize.define('users', {
  firstName: {
    type: Sequelize.STRING,
    field: 'first_name' // Will result in an attribute that is firstName when user facing but first_name in the database
  },
  lastName: {
    type: Sequelize.STRING
  },
  birthday: {
    type: Sequelize.STRING
  }
});

var Post = sequelize.define('posts', {
  title: {
    type: Sequelize.STRING,
  },
  body: {
    type: Sequelize.STRING
  },
  date: {
    type: Sequelize.DATEONLY
  },
});

// force: true will drop the table if it already exists
User.sync()
Post.sync()

// checking for authentication
// app.use(function(req, res, next) {
//   if (!req.query.user) {
//     res.send('cannot continue wrong password');
//   } else {
//     req.user = req.query.user;
//     next();
//   }
// });


// handle incoming requests to the "/" endpoint
app.get('/', function (request, response) {
  Post.findAll({
    attributes: ['title', 'body', 'date']
  })
  .then(function(posts) {
    response.render('index', { result: posts });
  })
});

app.get('/posts.json', function (request, response) {
  Post.findAll()
  .then(function(posts) {
    response.json(posts);
  })
});

// define the /posts/:id page
app.get('/posts/:id', function(request, response) {
  Post.findById(request.params.id)
  .then(function(posts) {
    if(post == null) {
      return next();
    }
    response.render('posts', { posts: posts });
  })
});

app.get('/new-post', function(request, response) {
  response.render('new-post');
});

// handle blog post creation
app.post('/posts', urlencodedParser, function(request, response) {
  console.log(request);
  Post.create({
    title: request.body.title,
    body: request.body.body,
    date: new Date()
  }).then(function() {
    response.send('post created!')
  });
});


app.use(function(req, res, next) {
  res.status(404).send('page not found')
});

// listen for incoming requests
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
