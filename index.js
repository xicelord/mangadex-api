//Load dependencies
const express = require('express');
const app = express();
const helpers = require('./helpers.js');
const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'mangadex'
});

//Configure
const config = {
  endpoint: '/api/v1/'
}

//Disable X-Powered-By-header
app.disable('x-powered-by');

connection.connect(function(err) {
  if (err) {
    console.error('Error connecting to db: ' + err.stack);
    return;
  } else {
    console.log('Connected to db as id ' + connection.threadId);
  }

  //Load handlers
  const group_handler = require('./handlers/group_handler.js');
  const user_handler = require('./handlers/user_handler.js');
  const manga_handler = require('./handlers/manga_handler.js');
  const chapter_handler = require('./handlers/chapter_handler.js');
  const chapters_handler = require('./handlers/chapters_handler.js');

  //Register handlers with express
  group_handler(app, connection, config);
  user_handler(app, connection, config);
  manga_handler(app, connection, config);
  chapter_handler(app, connection, config);
  chapters_handler(app, connection, config);

  //Start listening
  app.listen(3000)
});
