const helpers = require('../helpers.js');

//Result functions
function compile_get_manga(db_manga_result, db_manga_alt_names_results) {
  return {
    error: null,
    id: db_manga_result.manga_id,
    name: db_manga_result.manga_name,
    alt_names:
      db_manga_alt_names_results.map((manga_alt_names_result) => {
        return manga_alt_names_result.alt_name;
      }),
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
}

//Export
module.exports = (app, db, cache, config) => {
  //GET - info of a manga
  app.get(config.endpoint + 'manga/:type/:mid', helpers.handleCaching(config, 'get:manga', cache), (req, res) => {
    const type = helpers.filterMangaIdType(req.params.type);
    const mid = helpers.filterPositiveInt(req.params.mid);

    if (type === null) {
      return res.status(400).json({
        error: {
          code: 1, //TODO
          message: 'Invalid manga-id-type'
        }
      });
    }

    if (isNaN(mid) || mid < 1) {
      return res.status(400).json({
        error: {
          code: 1, //TODO
          message: 'Invalid manga-id'
        }
      });
    }

    db.query(
      'SELECT ' +
        '* ' +
      'FROM mangadex_mangas ' +
      'LEFT JOIN mangadex_languages ON mangadex_mangas.manga_lang_id = mangadex_languages.lang_id ' +
      'WHERE ' +
        (() => {
          switch (type) {
            case 'md':
              return 'manga_id = ' + mid;
            case 'mu':
              return 'manga_links->"$.mu" = "' + mid + '"';
            case 'mal':
              return 'manga_links->"$.mal" = "' + mid + '"';
          }
        })() +
      (process.env.NODE_ENV === 'test' && req.query.mysql_fail1 === '1' ? ' AND LIMIT 1=2' : ''),
      [mid],
      (db_manga_error, db_manga_results, db_manga_fields) => {
        if (db_manga_error) {
          //TODO: Log
          return res.status(500).json({
            error: {
              code: 1, //TODO
              message: 'Internal server error'
            }
          });
        }

        //Manga found?
        if (db_manga_results.length === 0) {
          return res.status(404).json({
            error: {
              code: 1, //TODO
              message: 'Manga could not be found'
            }
          });
        }

        //Fetch alt_names
        db.query(
          'SELECT alt_name FROM mangadex_manga_alt_names WHERE manga_id = ?' +
          (process.env.NODE_ENV === 'test' && req.query.mysql_fail2 === '1' ? ' AND LIMIT 1=2' : ''),
          [mid],
          (db_manga_alt_names_error, db_manga_alt_names_results, db_manga_alt_names_fields) => {
            if (db_manga_alt_names_error) {
              //TODO: Log
              return res.status(500).json({
                error: {
                  code: 1, //TODO
                  message: 'Internal server error'
                }
              });
            }

            //Reply
            return res.status(200).json(compile_get_manga(db_manga_results[0], db_manga_alt_names_results));
          }
        );
      }
    );
  });

  //TODO: POST - create a manga
}
