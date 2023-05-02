const router = require("express").Router();
const authentication = require("../common/authentication");
const Comment = require("../model/Comment");

router.get("/:id", async (req, res) => {
  try {
    const response = await Comment.findById(req.params.id)
    res.send(200, response)
  } catch (error) {
    console.log(error)
    res.send(500, "comment error in news");
    return;
  }
});


module.exports = router;
