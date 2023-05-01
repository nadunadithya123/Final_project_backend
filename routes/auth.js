const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/createAccount", async (req, res) => {
  console.log("hello", req.body);
  const { firstName, email, password } = req.body;
  if (firstName.length == 0) {
    res.send(400, "FirstName is required");
    return;
  }
  if (email.length == 0) {
    res.send(400, "Email is required");
    return;
  }
  if (password.length == 0) {
    res.send(400, "Password is required");
    return;
  }
  try {
    const body = req.body;
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(409).send("User already exists");
      return;
    }
    const newUser = new User(body);
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(body.password, salt);

    const userRes = await newUser.save();
    return res.send(userRes);
  } catch (error) {
    return res.status(500).send("Sign up error: " + error);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email.length == 0) {
    res.send(400, "Email is required");
    return;
  }
  if (password.length == 0) {
    res.send(400, "Password is required");
    return;
  }
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User does not exist");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SCRET,
      { expiresIn: "7 days" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            _id: user._id,
            name: user.fullName,
          },
        });
        return;
      }
    );
  } catch (error) {
    return res.status(500).send("Sign in error: " + error);
  }
});

module.exports = router;
