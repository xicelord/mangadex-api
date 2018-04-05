const helpers = require('../helpers.js');

//Result functions
function compile_get_chapters(db_chapter_results) {
  let results = [];

  db_chapter_results.forEach((db_chapter_result) => {
    results.push({
      id: db_chapter_result.chapter_id,
      volume: db_chapter_result.volume,
      chapter: db_chapter_result.chapter,
      title: db_chapter_result.title,
      manga: {
        id: db_chapter_result.manga_id,
        name: db_chapter_result.manga_name,
        cover: db_chapter_result.manga_image,
        adult: db_chapter_result.manga_hentai
      },
      upload_timestamp: db_chapter_result.upload_timestamp,
      authorised: db_chapter_result.authorised,
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
      language: {
        id: db_chapter_result.lang_id,
        name: db_chapter_result.lang_name,
        flag: db_chapter_result.lang_flag
      },
      user: {
        id: db_chapter_result.user_id,
        username: db_chapter_result.username,
        level: {
          id: db_chapter_result.level_id,
          name: db_chapter_result.level_name,
          color: db_chapter_result.level_colour
        }
      }
    });
  });

  return {
    error: null,
    chapters: results
  }
}

//Export
module.exports = (app, db, cache, config) => {
  //GET - info about group
  app.get([config.endpoint + 'chapters/:origin/:id', config.endpoint + 'chapters/:origin'], helpers.handleCaching(config, 'get:chapters', cache), (req, res) => {
    let origin = helpers.filterChaptersOrigin(req.params.origin);
    let id = (origin === 'frontpage' ? 0 : helpers.filterPositiveInt(req.params.id));
    let lang_ids = helpers.filterLanguageIDs(req.query.lang_ids || '1');
    let adult = (req.query.adult === '1');
    let order = 'upload_timestamp desc'; //SET TO SAFE INPUT ONLY!
    let limit = 250;
    let page = (helpers.filterPositiveInt(req.query.page) || 1) >= 1 ? (helpers.filterPositiveInt(req.query.page) || 1) -1 : 0;
    let offset = limit * page;

    if (origin === null) {
      return res.status(400).json({
        error: {
          code: 1, //TODO
          message: 'Invalid origin'
        }
      });
    }

    if (isNaN(id)) {
      return res.status(400).json({
        error: {
          code: 1, //TODO
          message: 'Invalid id'
        }
      });
    }

    //We can use 'id','lang_ids' & 'order' since they are filtered
    db.query(
      'SELECT ' +
          'mangadex_chapters.*, mangadex_languages.*, mangadex_users.username, ' +
          'mangadex_mangas.manga_name, mangadex_mangas.manga_image, mangadex_mangas.manga_hentai, ' +
          'mangadex_user_levels.level_name, mangadex_user_levels.level_colour, ' +
          'g1.group_name AS g1_name, g2.group_name AS g2_name, g3.group_name AS g3_name ' +
        'FROM mangadex_chapters ' +
        'LEFT JOIN mangadex_mangas ON mangadex_mangas.manga_id = mangadex_chapters.manga_id ' +
        'LEFT JOIN mangadex_groups AS g1 ON g1.group_id = mangadex_chapters.group_id ' +
        'LEFT JOIN mangadex_groups AS g2 ON g2.group_id = mangadex_chapters.group_id_2 ' +
        'LEFT JOIN mangadex_groups AS g3 ON g3.group_id = mangadex_chapters.group_id_3 ' +
        'LEFT JOIN mangadex_languages ON mangadex_languages.lang_id = mangadex_chapters.lang_id ' +
        'LEFT JOIN mangadex_users ON mangadex_chapters.user_id = mangadex_users.user_id ' +
        'LEFT JOIN mangadex_user_levels on mangadex_users.level_id = mangadex_user_levels.level_id ' +
        'WHERE ' +
          'mangadex_chapters.lang_id IN(' + lang_ids + ') AND ' +
          (adult ? 'mangadex_mangas.manga_hentai = 1 AND ' : 'mangadex_mangas.manga_hentai = 0 AND ') +
          (() => {
            switch(origin) {
              case 'group':
                return '(mangadex_chapters.group_id = ' + id + ' OR mangadex_chapters.group_id_2 = ' + id + ' OR mangadex_chapters.group_id_3 = ' + id + ') ';
              case 'user':
                return 'mangadex_users.user_id = ' + id + ' ';
              case 'manga':
                return 'mangadex_mangas.manga_id = ' + id + ' ';
              case 'frontpage':
                return '1=1 ';
            }
          })() +
        'ORDER BY ' + order + ' ' +
        'LIMIT ? OFFSET ?',
      [limit, offset],
      (db_chapters_error, db_chapters_results, db_chapters_fields) => {
        if (db_chapters_error) {
          //TODO: Log
          return res.status(500).json({
            error: {
              code: 1, //TODO
              message: 'Internal server error'
            }
          });
        }

        //Filter deleted chapters
        db_chapters_results = db_chapters_results.filter((db_chapters_result) => {
          return db_chapters_result.chapter_deleted == false;
        });

        //Replay
        return res.status(200).json(compile_get_chapters(db_chapters_results));
      }
    );
  });
}
