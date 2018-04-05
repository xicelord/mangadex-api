let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../index');
let expect = chai.expect;

//Load chaiHttp
chai.use(chaiHttp);


describe('user_handler', () => {
  describe('GET /user/:uid', () => {
    it('it should return the specified user', (done) => {
      chai.request(app)
        .get('/api/v1/user/5')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.id).to.eql(5);
          expect(res.body.username).to.eql('admin');
          expect(res.body.avatar).to.eql('');
          expect(res.body.language).to.deep.eql({ id: 1, name: 'English', flag: 'us' });
          expect(res.body.level).to.deep.eql({ id: 15, name: 'admin', color: '100' });
          expect(res.body.joined).to.eql(1400000000);
          expect(res.body.last_seen).to.eql(1410000000);
          expect(res.body.views).to.eql(22);
          expect(res.body.uploads).to.eql(2);

          done();
        });
    });
    it('it should return the specified user #2', (done) => {
      chai.request(app)
        .get('/api/v1/user/6')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.id).to.eql(6);
          expect(res.body.username).to.eql('random_dude');
          expect(res.body.avatar).to.eql('');
          expect(res.body.language).to.deep.eql({ id: 1, name: 'English', flag: 'us' });
          expect(res.body.level).to.deep.eql({ id: 3, name: 'member', color: '80' });
          expect(res.body.joined).to.eql(1400000001);
          expect(res.body.last_seen).to.eql(1410000001);
          expect(res.body.views).to.eql(23);
          expect(res.body.uploads).to.eql(0);

          done();
        });
    });
    it('it should 404 the request with a non-existing id', (done) => {
      chai.request(app)
        .get('/api/v1/user/99')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body.error).to.deep.eql({ code: 1, message: 'User could not be found' });
          expect(res.body.id).to.undefined;

          done();
        });
    });
    it('it should 400 the request with an invalid id', (done) => {
      chai.request(app)
        .get('/api/v1/user/-5')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body.error).to.deep.eql({ code: 1, message: 'Invalid user-id' });
          expect(res.body.id).to.be.undefined;

          done();
        });
    });
  });
});
