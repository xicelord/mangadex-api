const helpers = require('../helpers.js');

//Result functions
function compile_get_user(db_user_result) {
  return {
    error: null,
    id: db_user_result.user_id,
    username: db_user_result.username,
    avatar: db_user_result.avatar,
    language: {
      id: db_user_result.lang_id,
      name: db_user_result.lang_name,
      flag: db_user_result.lang_flag
    },
    level: {
      id: db_user_result.level_id,
      name: db_user_result.level_name,
      color: db_user_result.level_colour
    },
    joined: db_user_result.joined_timestamp,
    last_seen: db_user_result.last_seen_timestamp,
    views: db_user_result.user_views,
    uploads: db_user_result.user_uploads
  }
}

//Export
module.exports = (app, db, cache, config) => {
  //GET - data about user
  app.get(config.endpoint + 'user/:uid', helpers.handleCaching(config, 'get:user', cache), (req, res) => {
    let uid = helpers.filterPositiveInt(req.params.uid);

    if (isNaN(uid)) {
      return res.status(400).json({
        error: {
          code: 1, //TODO
          message: 'Invalid user-id'
        }
      });
    }

    db.query(
      'SELECT * ' +
        'FROM mangadex_users ' +
        'LEFT JOIN mangadex_user_levels ON mangadex_users.level_id = mangadex_user_levels.level_id ' +
        'LEFT JOIN mangadex_languages ON mangadex_users.language = mangadex_languages.lang_id ' +
        'WHERE mangadex_users.user_id = ?' +
        (process.env.NODE_ENV === 'test' && req.query.mysql_fail === '1' ? ' AND LIMIT 1=2' : ''),
      [uid],
      (db_user_error, db_user_results, db_user_fields) => {
        if (db_user_error) {
          //TODO: Log
          return res.status(500).json({
            error: {
              code: 1, //TODO
              message: 'Internal server error'
            }
          });
        }

        //User found?
        if (db_user_results.length === 0) {
          return res.status(404).json({
            error: {
              code: 1, //TODO
              message: 'User could not be found'
            }
          });
        }

        //Reply
        return res.status(200).json(compile_get_user(db_user_results[0]));
      }
    );
  });

  //TODO: POST - create a user
}
