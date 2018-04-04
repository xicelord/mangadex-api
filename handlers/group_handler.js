const helpers = require('../helpers.js');

//Result functions
function compile_get_group(db_group_result, db_members_results) {
  //Prepare result
  return {
    error: null,
    id: db_group_result.group_id,
    name: db_group_result.group_name,
    website: db_group_result.group_website,
    irc_server: db_group_result.group_irc_server,
    irc_channel: db_group_result.group_irc_channel,
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
    description: db_group_result.group_description,
    control: (db_group_result.group_control === 1),
    delay: db_group_result.group_delay,
    members: (() => {
      let members = [];

      //Add leader
      members.push({
        role: 'leader',
        user: {
          id: db_group_result.group_leader_id,
          name: db_group_result.username,
          level: {
            id: db_group_result.level_id,
            name: db_group_result.level_name,
            color: db_group_result.level_colour
          }
        }
      });

      //Add members
      db_members_results.forEach((member) => {
        members.push({
          role: 'member',
          user: {
            id: member.user_id,
            name: member.username,
            level: {
              id: member.level_id,
              name: member.level_name,
              color: member.level_colour
            }
          }
        });
      });

      return members;
    })()
  };

  db_group_results[0];
  result.error = null;
  result.members = [
    {
      role: 'leader',
      user: {
        id: result.group_leader_id,
        name: result.username
      }
    }
  ];
  result.username = undefined;
  result.group_leader_id = undefined;
  result.user_id = undefined;

  //Add members
  db_members_results.forEach((member) => {
    result.members.push(member);
  });
}

//Export
module.exports = (app, db, cache, config) => {
  //GET - info about group
  app.get(config.endpoint + 'group/:gid', helpers.handleCaching(config, 'get:group', cache), (req, res) => {
    let gid = helpers.filterPositiveInt(req.params.gid);

    if (isNaN(gid)) {
      return res.status(400).json({
        error: {
          code: 1, //TODO
          message: 'Invalid group-id'
        }
      });
    }

    db.query(
      'SELECT mangadex_groups.*, mangadex_languages.*, mangadex_users.username, mangadex_users.user_id, mangadex_user_levels.* ' +
        'FROM mangadex_groups  ' +
        'LEFT JOIN mangadex_languages ON mangadex_groups.group_lang_id = mangadex_languages.lang_id ' +
        'LEFT JOIN mangadex_users ON mangadex_groups.group_leader_id = mangadex_users.user_id ' +
        'LEFT JOIN mangadex_user_levels ON mangadex_users.level_id = mangadex_user_levels.level_id ' +
        'WHERE mangadex_groups.group_id = ?',
      [gid],
      (db_group_error, db_group_results, db_group_fields) => {
        if (db_group_error) {
          //TODO: Log
          return res.status(500).json({
            error: {
              code: 1, //TODO
              message: 'Internal server error'
            }
          });
        }

        //Group found?
        if (db_group_results.length === 0) {
          return res.status(404).json({
            error: {
              code: 1, //TODO
              message: 'Group could not be found'
            }
          });
        }

        //Get members
        db.query(
          'SELECT mangadex_link_user_group.user_id, mangadex_users.username, mangadex_user_levels.* ' +
            'FROM mangadex_link_user_group ' +
            'LEFT JOIN mangadex_users ON mangadex_users.user_id = mangadex_link_user_group.user_id ' +
            'LEFT JOIN mangadex_user_levels ON mangadex_users.level_id = mangadex_user_levels.level_id ' +
            'WHERE mangadex_link_user_group.group_id = ? ' +
            'AND mangadex_link_user_group.role = 2',
          [gid],
          (db_members_error, db_members_results, db_members_fields) => {
            if (db_members_error) {
              //TODO: Log
              return res.status(500).json({
                error: {
                  code: 1, //TODO
                  message: 'Internal server error'
                }
              });
            }

            //Reply
            return res.status(200).json(compile_get_group(db_group_results[0], db_members_results));
          }
        );
      }
    );
  });

  //TODO: POST - create new group
};
