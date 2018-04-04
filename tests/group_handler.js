let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../index');
let expect = chai.expect;

//Load chaiHttp
chai.use(chaiHttp);


describe('group_handler', () => {
  describe('GET /group/:gid', () => {
    it('it should return the specified group', (done) => {
      chai.request(app)
        .get('/api/v1/group/8')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.id).to.eql(8);
          expect(res.body.name).to.eql('Group #8');
          expect(res.body.website).to.eql('http://example.com');
          expect(res.body.irc).to.deep.eql({ server: 'irc.rizon.net', channel: 'g8' });
          expect(res.body.discord).to.eql('qF8yJ8q');
          expect(res.body.email).to.eql('g8@example.com');
          expect(res.body.language).to.deep.eql({ id: 1, name: 'English', flag: 'us' });
          expect(res.body.founded).to.eql('2016-12-31T23:00:00.000Z');
          expect(res.body.banner).to.eql('');
          expect(res.body.comments).to.eql(1);
          expect(res.body.likes).to.eql(2);
          expect(res.body.follows).to.eql(0);
          expect(res.body.views).to.eql(0);
          expect(res.body.description).to.eql('Description of Group #8');
          expect(res.body.control).to.eql(false);
          expect(res.body.delay).to.eql(0);
          expect(res.body.members).to.deep.eql([{"role":"leader","user":{"id":5,"name":"admin","level":{"id":15,"name":"admin","color":"100"}}},{"role":"member","user":{"id":6,"name":"random_dude","level":{"id":3,"name":"member","color":"80"}}}]);

          done();
        });
    });
    it('it should return the specified group #2', (done) => {
      chai.request(app)
        .get('/api/v1/group/9')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.id).to.eql(9);
          expect(res.body.name).to.eql('Group #9');
          expect(res.body.website).to.eql('http://example.com');
          expect(res.body.irc).to.deep.eql({ server: 'irc.rizon.net', channel: 'g9' });
          expect(res.body.discord).to.eql('qF8yJ8q');
          expect(res.body.email).to.eql('g9@example.com');
          expect(res.body.language).to.deep.eql({ id: 21, name: 'Chinese', flag: 'cn' });
          expect(res.body.founded).to.eql('2017-12-31T23:00:00.000Z');
          expect(res.body.banner).to.eql('');
          expect(res.body.comments).to.eql(0);
          expect(res.body.likes).to.eql(0);
          expect(res.body.follows).to.eql(0);
          expect(res.body.views).to.eql(1);
          expect(res.body.description).to.eql('Description of Group #9');
          expect(res.body.control).to.eql(true);
          expect(res.body.delay).to.eql(3600);
          expect(res.body.members).to.deep.eql([{"role":"leader","user":{"id":6,"name":"random_dude","level":{"id":3,"name":"member","color":"80"}}},{"role":"member","user":{"id":5,"name":"admin","level":{"id":15,"name":"admin","color":"100"}}}]);

          done();
        });
    });
    it('it should 404 the request with a non-existing id', (done) => {
      chai.request(app)
        .get('/api/v1/group/99')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body.error).to.deep.eql({ code: 1, message: 'Group could not be found' });
          expect(res.body.id).to.be.undefined;

          done();
        });
    });
    it('it should 400 the request with an invalid id', (done) => {
      chai.request(app)
        .get('/api/v1/group/-1')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body.error).to.deep.eql({ code: 1, message: 'Invalid group-id' });
          expect(res.body.id).to.be.undefined;

          done();
        });
    });
  });
});
