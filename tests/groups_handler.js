let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../index');
let expect = chai.expect;

//Load chaiHttp
chai.use(chaiHttp);


describe('groups_handler', () => {
  describe('GET /groups', () => {
    it('it should return the related groups (id-check only)', (done) => {
      chai.request(app)
        .get('/api/v1/groups')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.groups).to.have.length(3);
          expect(res.body.groups[0].id).to.eql(10);
          expect(res.body.groups[1].id).to.eql(8);
          expect(res.body.groups[2].id).to.eql(9);

          done();
        });
    });
    it('it should return the correct fields', (done) => {
      chai.request(app)
        .get('/api/v1/groups')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.groups).to.have.length(3);
          expect(res.body.groups[0].id).to.eql(10);
          expect(res.body.groups[0].name).to.eql('Group #10');
          expect(res.body.groups[0].website).to.eql('http://example.com');
          expect(res.body.groups[0].irc).to.deep.eql({ server: 'irc.rizon.net', channel: 'g10' });
          expect(res.body.groups[0].discord).to.eql('qF8yJ8q');
          expect(res.body.groups[0].email).to.eql('g10@example.com');
          expect(res.body.groups[0].language).to.deep.eql({ id: 1, name: 'English', flag: 'us' });
          expect(res.body.groups[0].founded).to.eql('2017-12-31T23:00:00.000Z');
          expect(res.body.groups[0].banner).to.eql('');
          expect(res.body.groups[0].comments).to.eql(0);
          expect(res.body.groups[0].likes).to.eql(0);
          expect(res.body.groups[0].follows).to.eql(0);
          expect(res.body.groups[0].views).to.eql(2);
          expect(res.body.groups[0].description).to.eql('Description of Group #10');

          done();
        });
    });
    it('it should respect the language-field', (done) => {
      chai.request(app)
        .get('/api/v1/groups?lang_ids=21')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.groups).to.have.length(1);
          expect(res.body.groups[0].id).to.eql(9);

          done();
        });
    });
    it('it should respect the page-field', (done) => {
      chai.request(app)
        .get('/api/v1/groups?page=2')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.groups).to.have.length(0);

          done();
        });
    });
    it('it should change page 0 to 1', (done) => {
      chai.request(app)
        .get('/api/v1/groups?page=0')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.error).to.be.null;
          expect(res.body.groups).to.have.length(3);
          expect(res.body.groups[0].id).to.eql(10);
          expect(res.body.groups[1].id).to.eql(8);
          expect(res.body.groups[2].id).to.eql(9);

          done();
        });
    });
    it('it should 500 the mysql_fail-request', (done) => {
      chai.request(app)
        .get('/api/v1/groups?mysql_fail=1')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(500);
          expect(res.body.error).to.deep.eql({ code: 1, message: 'Internal server error' });
          expect(res.body.groups).to.be.undefined;

          done();
        });
    });
  });
});
