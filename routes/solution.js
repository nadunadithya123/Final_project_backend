const router = require("express").Router();
const Solutions = require("../model/Solutions");

router.post("/", async (req, res) => {
  const { title, solution } = req.body;
  if (title.length === 0) {
    res.send(400, "Title is required");
    return;
  }
  if (solution.length === 0) {
    res.send(400, "Solution is required");
    return;
  }
  const newSolutions = new Solutions({
    title,
    solution,
  });
  try {
    const response = await newSolutions.save();
    res.send(200, response);
  } catch (error) {
    res.send(500, "Server error in news");
    return;
  }
});

router.get("/", async (req, res) => {
  try {
    const solutions = await Solutions.find();
    res.send(200, solutions);
    return;
  } catch (error) {
    res.send(500, "Server error in news");
    return;
  }
});

module.exports = router;
