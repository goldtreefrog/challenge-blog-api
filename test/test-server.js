const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");

// See http://chaijs.com/api/bdd/
const expect = chai.expect;

// Make HTTP requests in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe("Blog", function() {
  // Before tests run, activate the server.
  before(function() {
    return runServer();
  });

  // close the server at end of test runs.
  after(function() {
    return closeServer();
  });

  const expectedKeys = ["title", "content", "author", "publishDate"];

  it("should list items on GET", function() {
    // Chai request returns a promise...
    return chai
      .request(app)
      .get("/blogs")
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a("array");

        res.body.forEach(function(item) {
          expect(item).to.be.a("object");
          expect(item).to.include.keys(expectedKeys);
          expect(item).not.to.be("undefined");
          expect(item).not.to.be("null");
        });
      });
  });

  it("should add an item on POST", function() {
    const newItem = {
      title: "Perfect Title",
      content: "Want a title that will be noticed not only by Google but also by your reader? Read on! And on, and on, and on...",
      author: "Joe Bo",
      publishDate: "2/3/2018"
    };
    return chai
      .request(app)
      .post("/blogs")
      .send(newItem)
      .then(function(res) {
        console.log(res);
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res).to.be.a("object");
        expect(res.body).to.include.keys(expectedKeys);
        expect(res.body.id).to.not.equal(null);
        // response should be deep equal to `newItem` from above if we assign
        // `id` to it from `res.body.id. But what's the point of that?`
        expect(res.body).to.deep.equal(Object.assign(newItem, { id: res.body.id }));
      });
  });
});
