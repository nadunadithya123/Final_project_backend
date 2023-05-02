const router = require("express").Router();
const authentication = require("../common/authentication");
const News = require("../model/News");
const Comment = require("../model/Comment");

router.post("/", authentication, async (req, res) => {
  const { title, body } = req.body;
  const userId = req.user;
  if (title.length === 0) {
    res.send(400, "Title is required");
    return;
  }
  if (body.length === 0) {
    res.send(400, "Body is required");
    return;
  }
  const newNews = new News({
    title,
    body,
    userId,
  });
  try {
    const response = await newNews.save();
    res.send(200, response);
  } catch (error) {
    res.send(500, "Server error in news");
    return;
  }
});

router.get("/", async (req, res) => {
  try {
    const news = await News.find().sort({createdAt:-1}).populate('comments').exec();
    res.send(200, news);
    return;
  } catch (error) {
    console.log(error)
    res.send(500, "Server error in news");
    return;
  }
});

router.put("/:id/comment", authentication, async (req, res) => {
  try {
    const newsId = req.params.id;
    const comment = req.body.comment;
    const userId = req.user;

    const newComment = new Comment({
      newsId: newsId,
      comment: comment,
      userId,
    });

    const savedComment = await newComment.save();

    const updatedNews = await News.findByIdAndUpdate(
      newsId,
      { $push: { comments: savedComment._id } },
      { new: true }
    );
    return res.status(200).send(updatedNews);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error adding comment");
  }
});
module.exports = router;
