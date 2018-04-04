//Load dependencies
const express = require('express');
const app = express();
const helpers = require('./helpers.js');
const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : (process.env.NODE_ENV === 'production' ? 'mangadex' : 'mangadex-dev')
});
const cache = require('express-expeditious')({
  namespace: 'mangadexapi',
  defaultTtl: '1 minute',
  engine: require('expeditious-engine-redis')({
    host: 'localhost',
    port: 6379
  }),
  genCacheKey: (req) => {
    const resource = req.originalUrl;
    const method = req.method;

    return `${method}-${resource}`;
  }
});

//Configure
const config = {
  endpoint: '/api/v1/',
  cacheFor: {
    'get:group': false,
    'get:user': false,
    'get:manga': 15 *60 *1000,
    'get:chapter': 15 *60 *1000,
    'get:chapters': 5 *60 *1000
  }
}

//Use expeditious-cache
app.use(cache);

//Disable X-Powered-By-header
app.disable('x-powered-by');

//Connect to mysql-db
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
  group_handler(app, connection, cache, config);
  user_handler(app, connection, cache, config);
  manga_handler(app, connection, cache, config);
  chapter_handler(app, connection, cache, config);
  chapters_handler(app, connection, cache, config);

  //Start listening
  app.listen(3000)
});

//Export app for tests
module.exports = app;
