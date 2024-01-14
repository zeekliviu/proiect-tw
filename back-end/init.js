const sequelize = require("./config/database");
const Professor = require("./models/professor");
const Student = require("./models/student");
const Team = require("./models/team");
const Project = require("./models/project");
const Part = require("./models/part");
const User = require("./models/user");
const Grade = require("./models/grade");
const Jury = require("./models/jury");

Part.belongsTo(Project, { foreignKey: "ProjectID" });
Project.hasMany(Part, { foreignKey: "ProjectID" });

Project.belongsTo(Team, { foreignKey: "TeamID" });
Team.hasOne(Project, { foreignKey: "TeamID" });

Student.belongsTo(Team, { foreignKey: "TeamID" });
Team.hasMany(Student, { foreignKey: "TeamID" });

User.hasOne(Student, { foreignKey: "Username" });
Student.belongsTo(User, { foreignKey: "Username" });

User.hasOne(Professor, { foreignKey: "Username" });
Professor.belongsTo(User, { foreignKey: "Username" });

Part.hasMany(Grade, { foreignKey: "PartID" });
Grade.belongsTo(Part, { foreignKey: "PartID" });

Part.hasMany(Jury, { foreignKey: "PartID" });
Jury.belongsTo(Part, { foreignKey: "PartID" });

(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Database & tables created!");
  } catch (error) {
    console.log(error);
  }
})();
