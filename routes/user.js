const router = require("express").Router();
const { regValidation, loginValidation } = require("./validation");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("./verifyToken");
var nodemailer = require("nodemailer");

router.get("/register", verifyToken, (req, res) => {
  res.send("We are at /api/register/GET");
});

router.post("/register", async (req, res) => {
  const { name, email, password, role, secretId } = req.body;
  const { error } = regValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const findUser = await User.findOne({ email });

  if (findUser) return res.status(400).send("Email is already registered!");

  if (role === "Student") {
    const user = new User({
      name,
      email,
      password: hash,
      role,
    });

    try {
      const savedUser = await user.save();
      res.send({ savedUser });
    } catch (err) {
      res.status(400).send(err);
    }
  } else if (role === "Teacher") {
    // Check if the provided secretId matches the teacher's secret ID in .env
    const expectedSecretId = process.env.TEACHER_ID;

    if (secretId !== expectedSecretId) {
      return res.status(401).send("Invalid teacher secret ID");
    }

    const user = new User({
      name,
      email,
      password: hash,
      role,
    });

    try {
      const savedUser = await user.save();
      res.send({ savedUser });
    } catch (err) {
      res.status(400).send(err);
    }
  } else if (role === "Admin") {
    // Check if the provided secretId matches the admin's secret ID in .env
    const expectedSecretId = process.env.ADMIN_ID;

    if (secretId !== expectedSecretId) {
      return res.status(401).send("Invalid admin secret ID");
    }

    const user = new User({
      name,
      email,
      password: hash,
      role,
    });

    try {
      const savedUser = await user.save();
      res.send({ savedUser });
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.status(400).send("Invalid role");
  }
});

router.patch("/register", (req, res) => {});

router.delete("/register", (req, res) => {});

router.get("/login", (req, res) => {});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { error } = loginValidation(req.body);
  if (error) return res.send(error.details[0].message);

  const user = await User.findOne({ email: email });
  if (!user) return res.status(400).send("Password or Email is incorrect!");

  const compare = await bcrypt.compare(password, user.password);
  if (!compare) return res.status(400).send("Password or Email is incorrect!");

  const token = jwt.sign(
    { email: user.email, role: user.role, name: user.name },
    process.env.TOKEN_SECRET
  );

  res
    .header("token", token)
    .send({
      role: user.role,
      name: user.name,
      email: user.email,
      id: user._id,
    });

  //res.send("Logged in successfully!");
});

router.patch("/login", (req, res) => {});

router.delete("/login", (req, res) => {});

router.get("/test", (req, res) => {
  res.send("Testing...");
});

// Fetch user counts route
router.get("/userCounts", async (req, res) => {
  try {
    const adminCount = await User.countDocuments({ role: "Admin" });
    const teacherCount = await User.countDocuments({ role: "Teacher" });
    const studentCount = await User.countDocuments({ role: "Student" });

    res.json({ adminCount, teacherCount, studentCount });
  } catch (error) {
    console.error("Error fetching user counts:", error);
    res.status(500).send("Internal server error");
  }
});

// Add a new route to fetch all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { name: 1, email: 1, role: 1, _id: 1 }); // Retrieve only the desired fields

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Internal server error");
  }
});

router.delete("/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if the user with the given ID exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await User.findByIdAndRemove(userId);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update a user
router.put("/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, role },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/update/:teacherId", async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    const updatedData = req.body;

    // Update the teacher's data in the database
    const updatedTeacher = await User.findByIdAndUpdate(
      teacherId,
      updatedData,
      { new: true }
    );

    res.json(updatedTeacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/change-password/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { currentPassword, newPassword } = req.body;

    // Fetch the user's document from the database
    const user = await User.findById(userId);

    // Validate the current password
    if (!isValidPassword(currentPassword, user.password)) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Generate a new salt and hash for the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;

    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Password validation function
function isValidPassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  //console.log("Email", email);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User Not Found");
    }

    const token = jwt.sign({ userId: user._id }, "jwt_secret_key", {
      expiresIn: "5m",
    });

    const resetLink = `http://localhost:3000/reset-password/${user._id}/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.Email,
        pass: process.env.Password,
      },
    });

    const mailOptions = {
      from: process.env.Email,
      to: email,
      subject: "Reset your password",
      text: `Click the following link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).send("Error sending reset email");
      } else {
        return res.status(200).send({ status: "Success" });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

router.post('/reset-password?/:id/:token', (req, res) => {
  const {id, token} = req.params;
  const {password} = req.body;

  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) {
      return res.json({Status: "Error with token"})
    } else {
      bcrypt.hash(password, 10)
      .then(hash => {
        User.findByIdAndUpdate({_id: id}, {password: hash})
        .then(u => res.send({Status: "Success"}))
        .catch(err => res.send({Status: err}))
      })
      .catch(err => res.send({Status: err}))
    }
  })
})


module.exports = router;
