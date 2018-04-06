let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../index');
let expect = chai.expect;

//Load chaiHttp
chai.use(chaiHttp);


describe('mangas_handler', () => {
  describe('GET /mangas/:origin', () => {
    it('it should return the related mangas for "all" (id-check only)', (done) => {
      chai.request(app)
        .get('/api/v1/mangas/all')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.mangas).to.have.length(3);
          expect(res.body.mangas[0].id).to.eql(62);
          expect(res.body.mangas[1].id).to.eql(56);
          expect(res.body.mangas[2].id).to.eql(2);

          done();
        });
    });
    it('it should return the related mangas for "updated" (id-check only)', (done) => {
      chai.request(app)
        .get('/api/v1/mangas/updated')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.mangas).to.have.length(3);
          expect(res.body.mangas[0].id).to.eql(2);
          expect(res.body.mangas[1].id).to.eql(62);
          expect(res.body.mangas[2].id).to.eql(56);

          done();
        });
    });
    it('it should return the related mangas for "new" (id-check only)', (done) => {
      chai.request(app)
        .get('/api/v1/mangas/new')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.mangas).to.have.length(3);
          expect(res.body.mangas[0].id).to.eql(62);
          expect(res.body.mangas[1].id).to.eql(56);
          expect(res.body.mangas[2].id).to.eql(2);

          done();
        });
    });
    it('it should return the related mangas for "all" (id-check only)', (done) => {
      chai.request(app)
        .get('/api/v1/mangas/all')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.mangas).to.have.length(3);
          expect(res.body.mangas[0].id).to.eql(62);
          expect(res.body.mangas[1].id).to.eql(56);
          expect(res.body.mangas[2].id).to.eql(2);

          done();
        });
    });
    it('it should return the correct fields', (done) => {
      chai.request(app)
        .get('/api/v1/mangas/all')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.mangas).to.have.length(3);
          expect(res.body.mangas[0].id).to.eql(62);
          expect(res.body.mangas[0].name).to.eql('ABC');
          expect(res.body.mangas[0].alt_names).to.deep.eql([]);
          expect(res.body.mangas[0].author).to.eql('a1');
          expect(res.body.mangas[0].artist).to.eql('art1');
          expect(res.body.mangas[0].language).to.deep.eql({ id: 21, name: 'Chinese', flag: 'cn' });
          expect(res.body.mangas[0].status).to.deep.eql({ id: 0, name: 'Complete' });
          expect(res.body.mangas[0].adult).to.be.false;
          expect(res.body.mangas[0].description).to.eql('This is a description #2');
          expect(res.body.mangas[0].cover).to.eql('png');
          expect(res.body.mangas[0].rating).to.eql(0);
          expect(res.body.mangas[0].views).to.eql(3);
          expect(res.body.mangas[0].follows).to.eql(67);
          expect(res.body.mangas[0].last_updated).to.eql(1600000000);
          expect(res.body.mangas[0].comments).to.eql(3);
          expect(res.body.mangas[0].external_links).to.deep.eql({ mu: '130177', mal: '99351' });
          expect(res.body.mangas[0].locked).to.be.false;

          done();
        });
    });
    it('it should respect the language-field', (done) => {
      chai.request(app)
        .get('/api/v1/mangas/all?lang_ids=28')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.mangas).to.have.length(1);
          expect(res.body.mangas[0].id).to.eql(2);

          done();
        });
    });
    it('it should respect the adult-field', (done) => {
      chai.request(app)
        .get('/api/v1/mangas/all?adult=1')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.mangas).to.have.length(4);
          expect(res.body.mangas[0].id).to.eql(62);
          expect(res.body.mangas[1].id).to.eql(56);
          expect(res.body.mangas[2].id).to.eql(2);
          expect(res.body.mangas[3].id).to.eql(14);

          done();
        });
    });
    it('it should respect the page-field', (done) => {
      chai.request(app)
        .get('/api/v1/mangas/all?page=2')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.mangas).to.have.length(0);

          done();
        });
    });
    it('it should change page 0 to 1', (done) => {
      chai.request(app)
        .get('/api/v1/mangas/all?page=0')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.mangas).to.have.length(3);
          expect(res.body.mangas[0].id).to.eql(62);
          expect(res.body.mangas[1].id).to.eql(56);
          expect(res.body.mangas[2].id).to.eql(2);

          done();
        });
    });
    it('it should 400 the request with an invalid origin', (done) => {
      chai.request(app)
        .get('/api/v1/mangas/test')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body.error).to.be.deep.eql({ code: 1, message: 'Invalid origin' });
          expect(res.body.mangas).to.be.undefined;

          done();
        });
    });
    it('it should 500 the mysql_fail-request', (done) => {
      chai.request(app)
        .get('/api/v1/mangas/all?mysql_fail=1')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(500);
          expect(res.body.error).to.deep.eql({ code: 1, message: 'Internal server error' });
          expect(res.body.mangas).to.be.undefined;

          done();
        });
    });
  });
});
