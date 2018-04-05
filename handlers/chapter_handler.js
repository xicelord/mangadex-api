const helpers = require('../helpers.js');

//Result functions
function compile_get_chapter(db_chapter_result) {
  return {
    error: null,
    id: db_chapter_result.chapter_id,
    manga: {
      id: db_chapter_result.manga_id,
      name: db_chapter_result.manga_name
    },
    volume: db_chapter_result.volume,
    chapter: db_chapter_result.chapter,
    title: db_chapter_result.title,
    upload_timestamp: db_chapter_result.upload_timestamp,
    user: {
      id: db_chapter_result.user_id,
      username: db_chapter_result.username
      //IDEA: Add status?
    },
    views: db_chapter_result.chapter_views,
    language: {
      id: db_chapter_result.lang_id,
      name: db_chapter_result.lang_name,
      flag: db_chapter_result.lang_flag
    },
    authorised: (db_chapter_result.authorised === 1),
    group: {
      id: db_chapter_result.group_id,
      name: db_chapter_result.g1_name
    },
    group2: (() => {
      if (db_chapter_result.group_id_2) {
        return {
          id: db_chapter_result.group_id_2,
          name: db_chapter_result.g2_name
        }
      } else {
        return null;
      }
    })(),
    group3: (() => {
      if (db_chapter_result.group_id_3) {
        return {
          id: db_chapter_result.group_id_3,
          name: db_chapter_result.g3_name
        }
      } else {
        return null;
      }
    })(),
    pages: (() => {
      var pages = [];

      db_chapter_result.page_order.split(',').forEach((page) => {
        if (db_chapter_result.server)
          pages.push('https://s' + db_chapter_result.server + '.mangadex.org/' + db_chapter_result.chapter_hash + '/' + page);
        else
          pages.push('https://mangadex.org/data/' + db_chapter_result.chapter_hash + '/' + page);
      });

      return pages;
    })()
  }
}

//Export
module.exports = (app, db, cache, config) => {
  //GET - info about group
  app.get(config.endpoint + 'chapter/:cid', helpers.handleCaching(config, 'get:chapter', cache), (req, res) => {
    let cid = helpers.filterPositiveInt(req.params.cid);

    if (isNaN(cid)) {
      return res.status(400).json({
        error: {
          code: 1, //TODO
          message: 'Invalid chapter-id'
        }
      });
    }

    db.query(
      'SELECT mangadex_chapters.*, mangadex_users.username, mangadex_mangas.manga_name, g1.group_name AS g1_name, g2.group_name AS g2_name, g3.group_name AS g3_name, mangadex_languages.* ' +
        'FROM mangadex_chapters ' +
        'LEFT JOIN mangadex_users ON mangadex_users.user_id = mangadex_chapters.user_id ' +
        'LEFT JOIN mangadex_mangas ON mangadex_mangas.manga_id = mangadex_chapters.manga_id ' +
        'LEFT JOIN mangadex_groups AS g1 ON g1.group_id = mangadex_chapters.group_id ' +
        'LEFT JOIN mangadex_groups AS g2 ON g2.group_id = mangadex_chapters.group_id_2 ' +
        'LEFT JOIN mangadex_groups AS g3 ON g3.group_id = mangadex_chapters.group_id_3 ' +
        'LEFT JOIN mangadex_languages ON mangadex_languages.lang_id = mangadex_chapters.lang_id ' +
        'WHERE mangadex_chapters.chapter_id = ?' +
        (process.env.NODE_ENV === 'test' && req.query.mysql_fail === '1' ? ' AND LIMIT 1=2' : ''),
      [cid],
      (db_chapter_error, db_chapter_results, db_chapter_fields) => {
        if (db_chapter_error) {
          //TODO: Log
          return res.status(500).json({
            error: {
              code: 1, //TODO
              message: 'Internal server error'
            }
          });
        }

        //Not found?
        if (db_chapter_results.length === 0) {
          return res.status(404).json({
            error: {
              code: 1, //TODO
              message: 'Chapter could not be found'
            }
          });
        }

        //Deleted?
        if (db_chapter_results[0].chapter_deleted) {
          return res.status(403).json({
            error: {
              code: 1, //TODO
              message: 'Chapter has been deleted'
            }
          });
        }

        //Replay
        return res.status(200).json(compile_get_chapter(db_chapter_results[0]));
      }
    );
  });

  //TODO: POST - create a chapter
}
