const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const { Blogs } = require("./models");

// data to look at for testing
// title, content, author, publishDate
// Blogs.create("Who, me?", "I do not think anyone should blame me for anythings. Do you?", "Alfred", "2/1/2018");
// Blogs.create("Yes, you!", "You can do anything. At least, you can in your dream world. Is that good enough for you?", "Sunny", "1/31/2018");

// when the root of this router is called with GET, return
// all current BlogList items
router.get("/", (req, res) => {
  console.log("Inside blogRouter get");
  res.json(Blogs.get());
});

// when a new blog item is posted, make sure it's
// got required fields ('title', 'content', 'author', 'publishDate'). if not,
// log an error and return a 400 status code. if okay,
// add new item to BlogList and return it with a 201.
router.post("/", jsonParser, (req, res) => {
  // ensure proper fields are in request body
  const requiredFields = ["title", "content", "author", "publishDate"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = Blogs.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
  res.status(201).json(item);
});

// when DELETE request comes in with an id in path,
// try to delete that item from Blogs.
router.delete("/:id", (req, res) => {
  Blogs.delete(req.params.id);
  console.log(`Deleted blog item \`${req.params.ID}\``);
  res.status(204).end();
});

// when PUT request comes in with updated item, ensure has
// required fields. also ensure that item id in url path, and
// item id in updated item object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `Blogs.update` with updated item.
router.put("/:id", jsonParser, (req, res) => {
  const requiredFields = ["title", "content", "author", "publishDate"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id ``(${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog item \`${req.params.id}\``);
  const updatedItem = Blogs.update({
    id: req.params.id,
    title: req.body.title,
    budget: req.body.budget
  });
  res.status(204).end();
});

module.exports = router;
