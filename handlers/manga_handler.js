const helpers = require('../helpers.js');

//Result functions
function compile_get_manga(db_manga_result) {
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
    adult: db_manga_result.manga_hentai,
    description: db_manga_result.manga_description,
    cover: db_manga_result.manga_image,
    rating: db_manga_result.manga_rating, //TODO: Map?
    views: db_manga_result.manga_views,
    follows: db_manga_result.manga_follows,
    last_updated: db_manga_result.manga_last_updated,
    comments: db_manga_result.manga_comments,
    mu_id: db_manga_result.manga_mu_id,
    mal_id: db_manga_result.manga_mal_id,
    locked: (db_manga_result.manga_locked === 1)
  }
}

//Export
module.exports = (app, db, cache, config) => {
  //GET - info about group
  app.get(config.endpoint + 'manga/:type/:mid', helpers.handleCaching(config, 'get:manga', cache), (req, res) => {
    let type = helpers.filterMangaIdType(req.params.type);
    let mid = helpers.filterPositiveInt(req.params.mid);

    if (type === null) {
      return res.status(400).json({
        error: {
          code: 1, //TODO
          message: 'Invalid manga-id-type'
        }
      });
    }

    if (isNaN(mid)) {
      return res.status(400).json({
        error: {
          code: 1, //TODO
          message: 'Invalid manga-id'
        }
      });
    }

    db.query(
      'SELECT * ' +
        'FROM mangadex_mangas ' +
        'LEFT JOIN mangadex_languages ON mangadex_mangas.manga_lang_id = mangadex_languages.lang_id ' +
        'WHERE mangadex_mangas.' + type + ' = ?',
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

        //Replay
        return res.status(200).json(compile_get_manga(db_manga_results[0]));
      }
    );
  });

  //TODO: POST - create a manga
}
