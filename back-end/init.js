const sequelize = require("./config/database");
const Professor = require("./models/professor");
const Student = require("./models/student");
const Team = require("./models/team");
const Project = require("./models/project");
const Part = require("./models/part");

Part.belongsTo(Project, { foreignKey: "ProjectID" });
Project.hasMany(Part, { foreignKey: "ProjectID" });

Project.belongsTo(Team, { foreignKey: "TeamID" });
Team.hasOne(Project, { foreignKey: "TeamID" });

Student.belongsTo(Team, { foreignKey: "TeamID" });
Team.hasMany(Student, { foreignKey: "TeamID" });

(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Database & tables created!");
  } catch (error) {
    console.log(error);
  }
})();
