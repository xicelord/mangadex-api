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
  }
}
