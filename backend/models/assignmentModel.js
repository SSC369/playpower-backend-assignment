const db = require("../utils/db");

const createAssignmentTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      dueDate TEXT,
      teacherId INTEGER,
      totalScore INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (teacherId) REFERENCES users(id)
    );
  `);
};

module.exports = { createAssignmentTable };
