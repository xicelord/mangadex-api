let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../index');
let expect = chai.expect;

//Load chaiHttp
chai.use(chaiHttp);


describe('manga_handler', () => {
  describe('GET /manga/:type/:mid', () => {
    it('it should return the specified manga by md-id', (done) => {
      chai.request(app)
        .get('/api/v1/manga/md/2')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.id).to.eql(2);
          expect(res.body.name).to.eql('Test-Manga');
          expect(res.body.alt_names).to.eql([]);
          expect(res.body.author).to.eql('Test Author');
          expect(res.body.artist).to.eql('Test Artist');
          expect(res.body.language).to.deep.eql({ id: 28, name: 'Korean', flag: 'kr' });
          expect(res.body.status).to.deep.eql({ id: 1, name: 'Ongoing' });
          expect(res.body.adult).to.be.false;
          expect(res.body.description).to.eql('This is a description');
          expect(res.body.cover).to.eql('jpg');
          expect(res.body.rating).to.eql(0);
          expect(res.body.views).to.eql(12);
          expect(res.body.follows).to.eql(13);
          expect(res.body.last_updated).to.eql(1499998000);
          expect(res.body.comments).to.eql(0);
          expect(res.body.mu_id).to.eql(130175);
          expect(res.body.mal_id).to.eql(99349);
          expect(res.body.locked).to.be.false;

          done();
        });
    });
    it('it should return the specified manga by mu-id', (done) => {
      chai.request(app)
        .get('/api/v1/manga/mu/130175')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.id).to.eql(2);
          expect(res.body.name).to.eql('Test-Manga');
          expect(res.body.alt_names).to.eql([]);
          expect(res.body.author).to.eql('Test Author');
          expect(res.body.artist).to.eql('Test Artist');
          expect(res.body.language).to.deep.eql({ id: 28, name: 'Korean', flag: 'kr' });
          expect(res.body.status).to.deep.eql({ id: 1, name: 'Ongoing' });
          expect(res.body.adult).to.be.false;
          expect(res.body.description).to.eql('This is a description');
          expect(res.body.cover).to.eql('jpg');
          expect(res.body.rating).to.eql(0);
          expect(res.body.views).to.eql(12);
          expect(res.body.follows).to.eql(13);
          expect(res.body.last_updated).to.eql(1499998000);
          expect(res.body.comments).to.eql(0);
          expect(res.body.mu_id).to.eql(130175);
          expect(res.body.mal_id).to.eql(99349);
          expect(res.body.locked).to.be.false;

          done();
        });
    });
    it('it should return the specified manga by mal-id', (done) => {
      chai.request(app)
        .get('/api/v1/manga/mal/99349')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.id).to.eql(2);
          expect(res.body.name).to.eql('Test-Manga');
          expect(res.body.alt_names).to.eql([]);
          expect(res.body.author).to.eql('Test Author');
          expect(res.body.artist).to.eql('Test Artist');
          expect(res.body.language).to.deep.eql({ id: 28, name: 'Korean', flag: 'kr' });
          expect(res.body.status).to.deep.eql({ id: 1, name: 'Ongoing' });
          expect(res.body.adult).to.be.false;
          expect(res.body.description).to.eql('This is a description');
          expect(res.body.cover).to.eql('jpg');
          expect(res.body.rating).to.eql(0);
          expect(res.body.views).to.eql(12);
          expect(res.body.follows).to.eql(13);
          expect(res.body.last_updated).to.eql(1499998000);
          expect(res.body.comments).to.eql(0);
          expect(res.body.mu_id).to.eql(130175);
          expect(res.body.mal_id).to.eql(99349);
          expect(res.body.locked).to.be.false;

          done();
        });
    });
    it('it should return the specified manga by md-id #2', (done) => {
      chai.request(app)
        .get('/api/v1/manga/md/14')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.id).to.eql(14);
          expect(res.body.name).to.eql('Test-Manga-ADULT');
          expect(res.body.alt_names).to.eql([]);
          expect(res.body.author).to.eql('Test Authorx');
          expect(res.body.artist).to.eql('Test Artist');
          expect(res.body.language).to.deep.eql({ id: 21, name: 'Chinese', flag: 'cn' });
          expect(res.body.status).to.deep.eql({ id: 0, name: 'Complete' });
          expect(res.body.adult).to.be.true;
          expect(res.body.description).to.eql('This is a description of adult content');
          expect(res.body.cover).to.eql('png');
          expect(res.body.rating).to.eql(0);
          expect(res.body.views).to.eql(15);
          expect(res.body.follows).to.eql(16);
          expect(res.body.last_updated).to.eql(1499998500);
          expect(res.body.comments).to.eql(1);
          expect(res.body.mu_id).to.eql(130176);
          expect(res.body.mal_id).to.eql(99350);
          expect(res.body.locked).to.be.true;

          done();
        });
    });
    it('it it should 404 the request with an invalid id-type', (done) => {
      chai.request(app)
        .get('/api/v1/manga/md/99')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body.error).to.deep.eql({ code: 1, message: 'Manga could not be found' });
          expect(res.body.id).to.be.undefined;

          done();
        });
    });
    it('it it should 400 the request with a non-existing id-type', (done) => {
      chai.request(app)
        .get('/api/v1/manga/test/2')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body.error).to.deep.eql({ code: 1, message: 'Invalid manga-id-type' });
          expect(res.body.id).to.be.undefined;

          done();
        });
    });
    it('it it should 400 the request with an invalid id', (done) => {
      chai.request(app)
        .get('/api/v1/manga/md/-2')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body.error).to.deep.eql({ code: 1, message: 'Invalid manga-id' });
          expect(res.body.id).to.be.undefined;

          done();
        });
    });
  });
});
