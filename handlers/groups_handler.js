const helpers = require('../helpers.js');

//Result functions
function compile_get_groups(db_group_results) {
  let results = [];

  db_group_results.forEach((db_group_result) => {
    results.push({
      id: db_group_result.group_id,
      name: db_group_result.group_name,
      website: db_group_result.group_website,
      irc: {
        server: db_group_result.group_irc_server,
        channel: db_group_result.group_irc_channel
      },
      discord: db_group_result.group_discord,
      email: db_group_result.group_email,
      language: {
        id: db_group_result.lang_id,
        name: db_group_result.lang_name,
        flag: db_group_result.lang_flag
      },
      founded: db_group_result.group_founded,
      banner: db_group_result.group_banner,
      comments: db_group_result.group_comments,
      likes: db_group_result.group_likes,
      follows: db_group_result.group_follows,
      views: db_group_result.group_views,
      description: db_group_result.group_description
    });
  });

  return {
    error: null,
    groups: results
  }
}

//Export
module.exports = (app, db, cache, config) => {
  //GET - list of groups
  app.get(config.endpoint + 'groups', helpers.handleCaching(config, 'get:groups', cache), (req, res) => {
    let lang_ids = helpers.filterLanguageIDs(req.query.lang_ids || '');
    let limit = 250;
    let page = (helpers.filterPositiveInt(req.query.page) || 1) -1; //Note: page 0 will default to 1 - (0 || 1) === 1
    let offset = limit * page;

    db.query(
      'SELECT ' +
        '* ' +
      'FROM mangadex_groups ' +
      'LEFT JOIN mangadex_languages ON mangadex_languages.lang_id = mangadex_groups.group_lang_id ' +
      'WHERE ' +
        (lang_ids.length !== 0 ? 'mangadex_groups.group_lang_id IN(' + lang_ids + ') ' : '1=1 ') +
      'ORDER BY ' +
        'mangadex_groups.group_name ' +
      'LIMIT ? OFFSET ?' +
      (process.env.NODE_ENV === 'test' && req.query.mysql_fail === '1' ? ' AND LIMIT 1=2' : ''),
      [limit, offset],
      (db_groups_error, db_groups_results, db_groups_fields) => {
        if (db_groups_error) {
          //TODO: Log
          return res.status(500).json({
            error: {
              code: 1, //TODO
              message: 'Internal server error'
            }
          });
        }

        //Replay
        return res.status(200).json(compile_get_groups(db_groups_results));
      }
    );
  });
}
