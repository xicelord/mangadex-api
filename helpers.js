module.exports = {
  filterInt: function(value) {
    if (/^([0-9]+)$/.test(value))
      return Number(value);
    return NaN;
  },

  filterMangaIdType: function(value) {
    switch (value) {
      case 'md':
        return 'manga_id';
      case 'mu':
        return 'manga_mu_id';
      case 'mal':
        return 'manga_mal_id';
      default:
        return null;
    }
  },

  filterChaptersOrigin: function(value) {
    if (value === 'group' || value === 'manga')
      return value;
    else
      return null;
  },

  filterLanguageIDs: function(value) {
    let lang_ids = [];

    //Filter out non-integers
    value.split(',').forEach((lang_id) => {
      let filtered = module.exports.filterInt(lang_id);

      if (!isNaN(filtered))
        lang_ids.push(filtered);
    });

    return lang_ids.join(',');
  }
}
