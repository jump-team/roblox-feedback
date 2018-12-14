// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
const Schema = mongoose.Schema;
const db = mongoose.connection
const bodyParser = require('body-parser')
db.on('error', console.error.bind(console, 'connection error:'));

let feedbackSchema = new Schema({
  subject: String,
  author: String,
  body: String,
  comments: [{ body: String, author: String }],
  date: { type: Date, default: Date.now }
});
let Feedback = mongoose.model('Feedback', feedbackSchema);

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
db.once('open', function() {
  app.use(bodyParser.json());
  // http://expressjs.com/en/starter/basic-routing.html
  app.get('/', function(request, response) {
    res.send("Docs at https://glitch.com/~roblox-feedback");
  });
  app.get('/feedback', function(request, response) {
    Feedback.find(function(error, feedback) {
      response.send(feedback);
    });
  });
  app.post('/feedback', function(request, response) {
    let newFeedback = new Feedback({ subject: request.body.subject, author: request.body.author, body: request.body.body });
    newFeedback.save();
    response.status(200).send("Feedback added");
  });
  app.get('/feedback/:author', function(request, response) {
    let author = request.params.author
    Feedback.find({ author: author }, function(error, feedback) {
      if (error) { response.status(500).send("Error"); return; }
      response.status(200).send(feedback);
    });
  });
  
  // listen for requests :)
  const listener = app.listen(process.env.PORT, function() {
    console.log('Your app is listening on port ' + listener.address().port);
  });
});