let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../index');
let expect = chai.expect;

//Load chaiHttp
chai.use(chaiHttp);


describe('chapters_handler', () => {
  describe('GET /chapters/:origin/:id', () => {
    it('it should return the related chapters for group (id-check only)', (done) => {
      chai.request(app)
        .get('/api/v1/chapters/group/8')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.chapters).to.have.length(1);
          expect(res.body.chapters[0].id).to.eql(33)

          done();
        });
    });
    it('it should return the related chapters for manga (id-check only)', (done) => {
      chai.request(app)
        .get('/api/v1/chapters/manga/2')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.chapters).to.have.length(1);
          expect(res.body.chapters[0].id).to.eql(33);

          done();
        });
    });
    it('it should return the related chapters for user (id-check only)', (done) => {
      chai.request(app)
        .get('/api/v1/chapters/user/6')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.chapters).to.have.length(1);
          expect(res.body.chapters[0].id).to.eql(33)

          done();
        });
    });
    it('it should return the related chapters for new without id (id-check only)', (done) => {
      chai.request(app)
        .get('/api/v1/chapters/new')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.chapters).to.have.length(1);
          expect(res.body.chapters[0].id).to.eql(33)

          done();
        });
    });
    it('it should return the related chapters for new with id (id-check only)', (done) => {
      chai.request(app)
        .get('/api/v1/chapters/new/0')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.chapters).to.have.length(1);
          expect(res.body.chapters[0].id).to.eql(33)

          done();
        });
    });
    it('it should return the correct fields', (done) => {
      chai.request(app)
        .get('/api/v1/chapters/manga/2')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.chapters).to.have.length(1);
          expect(res.body.chapters[0].id).to.eql(33);
          expect(res.body.chapters[0].manga).to.deep.eql({ id: 2, name: 'Test-Manga', adult: false, cover: 'jpg' });
          expect(res.body.chapters[0].volume).to.eql('3');
          expect(res.body.chapters[0].chapter).to.eql('4');
          expect(res.body.chapters[0].title).to.eql('TEST-CHAPTER2');
          expect(res.body.chapters[0].language).to.deep.eql({ id: 1, name: 'English', flag: 'us' });
          expect(res.body.chapters[0].group).to.deep.eql({ id: 8, name: 'Group #8' });
          expect(res.body.chapters[0].group2).to.be.null;
          expect(res.body.chapters[0].group3).to.be.null;
          expect(res.body.chapters[0].upload_timestamp).to.eql(1500000000);
          expect(res.body.chapters[0].authorised).to.be.false;
          expect(res.body.chapters[0].user).to.deep.eql({ id: 6, username: 'random_dude', level: { id: 3, name: 'member', color: '80' } });
          expect(res.body.chapters[0].deleted).to.be.false;

          done();
        });
    });
    it('it should 400 the request with an invalid origin', (done) => {
      chai.request(app)
        .get('/api/v1/chapters/test/2')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body.error).to.be.deep.eql({ code: 1, message: 'Invalid origin' });
          expect(res.body.chapters).to.be.undefined;

          done();
        });
    });
    it('it should 400 the request with an invalid id', (done) => {
      chai.request(app)
        .get('/api/v1/chapters/manga/-2')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body.error).to.be.deep.eql({ code: 1, message: 'Invalid id' });
          expect(res.body.chapters).to.be.undefined;

          done();
        });
    });
    it('it should respect the language-field', (done) => {
      chai.request(app)
        .get('/api/v1/chapters/manga/2?lang_ids=21')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.chapters).to.have.length(1);
          expect(res.body.chapters[0].id).to.eql(1);

          done();
        });
    });
    it('it should respect the deleted-field', (done) => {
      chai.request(app)
        .get('/api/v1/chapters/manga/2?lang_ids=28&deleted=1')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.chapters).to.have.length(1);
          expect(res.body.chapters[0].id).to.eql(11);

          done();
        });
    });
    it('it should respect the adult-field', (done) => {
      chai.request(app)
        .get('/api/v1/chapters/manga/14?adult=1')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.chapters).to.have.length(1);
          expect(res.body.chapters[0].id).to.eql(44);

          done();
        });
    });
    it('it should respect the page-field', (done) => {
      chai.request(app)
        .get('/api/v1/chapters/manga/2?page=2')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.chapters).to.have.length(0);

          done();
        });
    });
  });
});
