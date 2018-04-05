let chai = require('chai');
let expect = chai.expect;
let helpers = require('../helpers');


describe('helpers', () => {
  describe('filterPositiveInt', () => {
    it('it should return positive integers', () => {
      expect(helpers.filterPositiveInt(2)).to.eql(2);
    });
    it('it should return NaN for negative integers', () => {
      expect(helpers.filterPositiveInt(-2)).to.be.NaN;
    });
    it('it should return NaN for letters', () => {
      expect(helpers.filterPositiveInt('a')).to.be.NaN;
    });
  });

  describe('filterMangaIdType', () => {
    it('it should translate md', () => {
      expect(helpers.filterMangaIdType('md')).to.eql('manga_id');
    });
    it('it should translate mu', () => {
      expect(helpers.filterMangaIdType('mu')).to.eql('manga_mu_id');
    });
    it('it should translate mal', () => {
      expect(helpers.filterMangaIdType('mal')).to.eql('manga_mal_id');
    });
    it('it should return null for other inputs', () => {
      expect(helpers.filterMangaIdType('test')).to.be.null;
    });
  });

  describe('filterChaptersOrigin', () => {
    it('it should allow group', () => {
      expect(helpers.filterChaptersOrigin('group')).to.eql('group');
    });
    it('it should allow manga', () => {
      expect(helpers.filterChaptersOrigin('manga')).to.eql('manga');
    });
    it('it should allow user', () => {
      expect(helpers.filterChaptersOrigin('user')).to.eql('user');
    });
    it('it should allow new', () => {
      expect(helpers.filterChaptersOrigin('new')).to.eql('new');
    });
    it('it should return null for other inputs', () => {
      expect(helpers.filterChaptersOrigin('test')).to.be.null;
    });
  });

  describe('filterLanguageIDs', () => {
    it('it should allow integers', () => {
      expect(helpers.filterLanguageIDs('1,2,3')).to.eql('1,2,3');
    });
    it('it should filter out negative integers', () => {
      expect(helpers.filterLanguageIDs('1,-2,3')).to.eql('1,3');
    });
    it('it should filter out letters', () => {
      expect(helpers.filterLanguageIDs('1,2,a')).to.eql('1,2');
    });
    it('it should return 1 if no valid integers were specified', () => {
      expect(helpers.filterLanguageIDs('-1,a')).to.eql('1');
    });
  });

  describe('handleCaching', () => {
    it('it should cache valid requests', () => {
      let next_called = false;
      let next = null;
      let config = {cacheFor: {'get:test': 3600}};
      let resourceTitle = 'get:test';
      let cache = {
        withTtl: (expires) => {
          return (req, res, next) => {
            return expires;
          }
        }
      }

      let return_value = helpers.handleCaching(config, resourceTitle, cache)(null, null, next);
      expect(return_value).to.eql(config.cacheFor['get:test']);
    });
    it('it should respect cacheFor being false', () => {
      let next_called = false;
      let next = () => {
        next_called = true;
      }
      let config = {cacheFor: false};
      let resourceTitle = 'get:test';
      let cache = null;

      let return_value = helpers.handleCaching(config, resourceTitle, cache)(null, null, next);
      expect(next_called).to.be.true;
      expect(return_value).to.be.undefined;
    });
    it('it should respect a cacheFor-property being false', () => {
      let next_called = false;
      let next = () => {
        next_called = true;
      }
      let config = {cacheFor: {'get:test': false}};
      let resourceTitle = 'get:test';
      let cache = null;

      let return_value = helpers.handleCaching(config, resourceTitle, cache)(null, null, next);
      expect(next_called).to.be.true;
      expect(return_value).to.be.undefined;
    });
  });
});
