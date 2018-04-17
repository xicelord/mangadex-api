const helpers = require('../helpers.js');

//Result functions
function compile_get_mangas(db_manga_results) {
  const mangas = db_manga_results.map((db_manga_result) => {
    return {
      id: db_manga_result.manga_id,
      name: db_manga_result.manga_name,
      alt_names: (() => {
        //TODO: Implement
        return [];
      })(),
      author: db_manga_result.manga_author,
      artist: db_manga_result.manga_artist,
      language: {
        id: db_manga_result.lang_id,
        name: db_manga_result.lang_name,
        flag: db_manga_result.lang_flag
      },
      status: {
        id: db_manga_result.manga_status_id,
        name: (db_manga_result.manga_status_id === 1 ? 'Ongoing' : 'Complete')
      },
      adult: (db_manga_result.manga_hentai === 1),
      description: db_manga_result.manga_description,
      cover: db_manga_result.manga_image,
      rating: db_manga_result.manga_rating, //TODO: Map?
      views: db_manga_result.manga_views,
      follows: db_manga_result.manga_follows,
      last_updated: db_manga_result.manga_last_updated,
      comments: db_manga_result.manga_comments,
      external_links: JSON.parse(db_manga_result.manga_links),
      locked: (db_manga_result.manga_locked === 1)
    }
  });

  return {
    error: null,
    mangas: mangas
  }
}

//Export
module.exports = (app, db, cache, config) => {
  //GET - get a list of mangas
  app.get(config.endpoint + 'mangas/:origin', helpers.handleCaching(config, 'get:mangas', cache), (req, res) => {
    const origin = helpers.filterMangasOrigin(req.params.origin);
    const lang_ids = helpers.filterLanguageIDs(req.query.lang_ids || '');
    const adult = (req.query.adult === '1');
    const limit = 100;
    const page = (helpers.filterPositiveInt(req.query.page) || 1) -1; //Note: page 0 will default to 1 - (0 || 1) === 1
    const offset = limit * page;

    if (origin === null) {
      return res.status(400).json({
        error: {
          code: 1, //TODO
          message: 'Invalid origin'
        }
      });
    }

    db.query(
      'SELECT ' +
        '* ' +
      'FROM mangadex_mangas ' +
      'LEFT JOIN mangadex_languages ON mangadex_languages.lang_id = mangadex_mangas.manga_lang_id ' +
      'WHERE ' +
        (lang_ids.length !== 0 ? 'mangadex_mangas.manga_lang_id IN(' + lang_ids + ') AND ' : '') +
        (!adult ? 'mangadex_mangas.manga_hentai = 0 ' : '1=1 ') +
      'ORDER BY ' +
        (() => {
          switch (origin) {
            case 'all':
              return 'manga_name';
            case 'updated':
              return 'manga_last_updated DESC';
            case 'new':
              return 'manga_id DESC';
          }
        })() + ' ' +
      'LIMIT ? OFFSET ?' +
      (process.env.NODE_ENV === 'test' && req.query.mysql_fail === '1' ? ' AND LIMIT 1=2' : ''),
      [limit, offset],
      (db_mangas_error, db_mangas_results, db_mangas_fields) => {
        if (db_mangas_error) {
          //TODO: Log
          return res.status(500).json({
            error: {
              code: 1, //TODO
              message: 'Internal server error'
            }
          });
        }

        //Reply
        return res.status(200).json(compile_get_mangas(db_mangas_results));
      }
    );
  });
}
