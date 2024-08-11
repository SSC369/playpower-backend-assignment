const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../utils/db");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username === "" || password === "") {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    db.get(
      `SELECT * FROM users WHERE username = ?`,
      [username],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        if (user === undefined)
          return res.status(400).json({ message: "User not found" });

        const isPasswordMatched = await bcrypt.compare(
          password,
          user?.password
        );
        console.log(isPasswordMatched);
        if (!isPasswordMatched) {
          return res.status(401).json({ message: "Wrong password!" });
        }

        const payload = {
          id: user.id,
          username: user.username,
        };
        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET);
        return res
          .status(200)
          .json({ jwtToken, message: "Login successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const register = async (req, res) => {
  try {
    const { username, password, role, email } = req.body;
    if (username === "" || password === "" || role === "" || email === "") {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = `INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?);`;
    db.run(query, [username, hashedPassword, role, email], function (error) {
      if (error) {
        return res.status(500).json({ message: error.message });
      }

      db.get(
        `SELECT * FROM users WHERE username = ?`,
        [username],
        (err, user) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }

          if (user === undefined)
            return res.status(400).json({ message: "User not found" });
          const payload = {
            id: user.id,
            username: user.username,
          };
          const jwtToken = jwt.sign(payload, process.env.JWT_SECRET);
          res
            .status(201)
            .json({ message: "User created successfully", jwtToken });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const retrieveUsers = async (req, res) => {
  try {
    const query = `SELECT * FROM users;`;
    db.all(query, [], (err, users) => {
      if (err) return res.status(500).json({ message: error.message });
      res.status(200).json({ users });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { login, register, retrieveUsers };
