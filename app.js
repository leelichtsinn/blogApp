// include packages
var express = require('express');
var fs = require('fs');
var _ = require('lodash');


// create an http server
var app = express();

app.set('views', './views'); // specify the views directory
app.set('view engine', 'ejs');


// checking for authentication
// app.use(function(req, res, next) {
//   if (req.query.password !== 'secret') {
//     res.send('cannot continue wrong password');
//   } else {
//     next();
//   }
// });

var getPosts = function(id) {
  var data = JSON.parse(fs.readFileSync('db.json').toString());
  if (id === undefined) {
    return data.posts;
  }
  for (i in data.posts) {
    if (data.posts[i].id === id) {
      return data.posts[i];
    }
  }
};

// var editPost = function(post) {
//   var oldPost = getPost(post.id);
//   Object.assign({}, oldPost, post);
//   var data = JSON.parse(fs.readFileSync('db.json').toString());
//
// };

// handle incoming requests to the "/" endpoint
app.get('/', function (request, response) {
  response.render('index')
  // fs.readFile('index.html', function(error, html) {
  //   var template = _.template(html);
  //   var posts = getPosts();
  //   var generated = template({ posts: posts });
  //   response.send(generated);
  // });
});

// define the /posts/:id page
app.get('/posts/:id', function(request, response) {
  var html = fs.readFileSync('post.html').toString();
  var template = _.template(html);
  var post = getPosts(parseInt(request.params.id));
  var generated = template({ post: post });
  response.send(generated);
});

// handle blog post creation
app.post('/posts', function(request, response) {
  response.send('post created!');
});

app.use(function(req, res, next) {
  res.status(404).send('page not found')
});

// listen for incoming requests
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
