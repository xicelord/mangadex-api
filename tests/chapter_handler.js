let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../index');
let expect = chai.expect;

//Load chaiHttp
chai.use(chaiHttp);


describe('chapter_handler', () => {
  describe('GET /chapter/:cid', () => {
    it('it should return the specified chapter', (done) => {
      //Normal chapter on main server
      chai.request(app)
        .get('/api/v1/chapter/1')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.id).to.eql(1);
          expect(res.body.manga).to.deep.eql({ id: 2, name: 'Test-Manga' });
          expect(res.body.volume).to.eql('3');
          expect(res.body.chapter).to.eql('4');
          expect(res.body.title).to.eql('TEST-CHAPTER');
          expect(res.body.upload_timestamp).to.eql(1500000000);
          expect(res.body.user).to.deep.eql({ id: 5, username: 'admin' });
          expect(res.body.views).to.eql(6);
          expect(res.body.language).to.deep.eql({ id: 21, name: 'Chinese', flag: 'cn' });
          expect(res.body.authorised).to.eql(false);
          expect(res.body.group).to.deep.eql({ id: 8, name: 'Group #8' });
          expect(res.body.group2).to.deep.eql({ id: 9, name: 'Group #9' });
          expect(res.body.group3).to.deep.eql({ id: 10, name: 'Group #10' });
          expect(res.body.pages).to.deep.eql(['https://mangadex.org/data/174c11eab007f4f257fb27d458fd93d1/x1.png','https://mangadex.org/data/174c11eab007f4f257fb27d458fd93d1/x2.png']);

          done();
        });
    });
    it('it should return the specified chapter #2', (done) => {
      //Images on another server & no 2nd and 3rd group
      chai.request(app)
        .get('/api/v1/chapter/33')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.id).to.eql(33);
          expect(res.body.manga).to.deep.eql({ id: 2, name: 'Test-Manga' });
          expect(res.body.volume).to.eql('3');
          expect(res.body.chapter).to.eql('4');
          expect(res.body.title).to.eql('TEST-CHAPTER2');
          expect(res.body.upload_timestamp).to.eql(1500000000);
          expect(res.body.user).to.deep.eql({ id: 6, username: 'random_dude' });
          expect(res.body.views).to.eql(50);
          expect(res.body.language).to.deep.eql({ id: 1, name: 'English', flag: 'us' });
          expect(res.body.authorised).to.eql(false);
          expect(res.body.group).to.deep.eql({ id: 8, name: 'Group #8' });
          expect(res.body.group2).to.be.null;
          expect(res.body.group3).to.be.null;
          expect(res.body.pages).to.deep.eql(['https://s2.mangadex.org/1abc11eab007f4f257fb27d458fd93d2/x1.jpg']);

          done();
        });
    });
    it('it should 404 the request with a non-existing id', (done) => {
      chai.request(app)
        .get('/api/v1/chapter/99')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body.error).to.deep.eql({ code: 1, message: 'Chapter could not be found' });
          expect(res.body.id).to.be.undefined;

          done();
        });
    });
    it('it should 400 the request with an invalid id', (done) => {
      chai.request(app)
        .get('/api/v1/chapter/-1')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body.error).to.deep.eql({ code: 1, message: 'Invalid chapter-id' });
          expect(res.body.id).to.be.undefined;

          done();
        });
    });
    it('it should 403 the request for a deleted chapter', (done) => {
      chai.request(app)
        .get('/api/v1/chapter/11')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(403);
          expect(res.body.error).to.deep.eql({ code: 1, message: 'Chapter has been deleted' });
          expect(res.body.id).to.be.undefined;

          done();
        });
    });
  });
});
