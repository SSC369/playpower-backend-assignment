const db = require("../utils/db");
const nodemailer = require("nodemailer");

const addAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, totalScore } = req.body;

    if (
      title === "" ||
      description === "" ||
      dueDate === "" ||
      totalScore === ""
    ) {
      res.status(400).json({ message: "Invalid details!" });
    }

    const { id } = req.user;

    db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, user) => {
      if (err) res.status(500).json({ message: err.message });
      const { role } = user;
      if (role === "student") {
        return res
          .status(400)
          .json({ message: "Teacher can only create assignment" });
      }

      db.run(
        `INSERT INTO assignments (title, description, dueDate, teacherId, totalScore)
       VALUES (?, ?, ?, ?, ?)`,
        [title, description, dueDate, id, totalScore],
        (err) => {
          if (err) res.status(500).json({ message: err.message });

          res.status(201).json({ message: "Assignment Created" });

          if (err) return res.status(500).json({ message: err.message });
          const transporter = nodemailer.createTransport({
            service: "gmail", // You can use other services like 'smtp.mailgun.org' or custom SMTP
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: process.env.EMAIL_USER, // Your email address
              pass: process.env.EMAIL_PASS, // Your email password or app password
            },
          });

          db.all(
            `SELECT * FROM users WHERE role = ?`,
            ["student"],
            async (err, students) => {
              if (err) return res.status(500).json({ message: err.message });

              const sendAssignmentNotification = async (
                studentEmail,
                assignment
              ) => {
                const mailOptions = {
                  from: "no-reply@example.com", // Sender address
                  to: studentEmail, // List of receivers
                  subject: "New Assignment Created", // Subject line
                  text: `A new assignment has been created:\n\nTitle: ${assignment.title}\nDescription: ${assignment.description}\nDue Date: ${assignment.dueDate}\n\nPlease check your assignments dashboard for more details.`, // Plain text body
                };

                try {
                  await transporter.sendMail(mailOptions);
                  console.log("Notification email sent successfully");
                } catch (error) {
                  console.error("Error sending notification email:", error);
                }
              };
              const assignment = {
                title,
                description,
                dueDate,
                totalScore,
              };
              for (const student of students) {
                await sendAssignmentNotification(student.email, assignment);
              }
            }
          );
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//retrieve assignments which are created by teacher
const teacherAssignments = async (req, res) => {
  try {
    const { teacherId } = req.params;
    db.all(
      `SELECT * FROM assignments WHERE teacherId = ?`,
      [teacherId],
      (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });

        return res.status(200).json({ teacherId, assignments: rows });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const retriveAssignments = async (req, res) => {
  try {
    db.all(`SELECT * FROM assignments`, [], (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });

      return res.status(200).json({ assignments: rows });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//teacher delete assignment
const deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { id } = req.user;

    db.get(
      `SELECT * FROM assignments WHERE id = ?`,
      [assignmentId],
      (err, assignment) => {
        if (err) return res.status(500).json({ message: err.message });
        if (!assignment) {
          return res.status(404).json({ message: "Assignment not found!" });
        }

        //check whether teacher who created this assignment is deleting this assignement
        const { teacherId } = assignment;
        if (teacherId !== id) {
          return res
            .status(400)
            .json({ message: "Unauthorized delete request!" });
        }

        db.run(
          `DELETE FROM assignments WHERE id = ?`,
          [assignmentId],
          (err) => {
            if (err) return res.status(500).json({ message: err.message });

            res.status(200).json({ message: "Assignment Deleted" });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//teacher update assignment
const updateAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { title, description, dueDate, totalScore } = req.body;
    const { id } = req.user;
    console.log(id);
    db.get(
      `SELECT * FROM assignments WHERE id = ?`,
      [assignmentId],
      (err, assignment) => {
        if (err) return res.status(500).json({ message: err.message });
        console.log(assignment);

        if (!assignment)
          return res.status(404).json({ message: "Assignment not found!" });

        //check assignment creator id is same as request user id
        const { teacherId } = assignment;
        if (id !== teacherId) {
          return res
            .status(400)
            .json({ message: "Unauthorized update request!" });
        }

        const details = {
          ...assignment,
          title,
          description,
          dueDate,
          totalScore,
        };

        db.run(
          `UPDATE assignments SET title = ?, description = ?, dueDate = ?, totalScore = ? WHERE id = ?`,
          [
            details.title,
            details.description,
            details.dueDate,
            details.totalScore,
            assignmentId,
          ],
          (err) => {
            if (err) return res.status(500).json({ message: err.message });

            return res.status(200).json({ message: "Assignment updated" });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addAssignment,
  teacherAssignments,
  deleteAssignment,
  retriveAssignments,
  updateAssignment,
};
