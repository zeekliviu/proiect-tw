const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const md5 = require("md5");
const Professor = require("./models/professor");
const Student = require("./models/student");
const Team = require("./models/team");
const Project = require("./models/project");
const Part = require("./models/part");
const User = require("./models/user");
const Grade = require("./models/grade");
const Jury = require("./models/jury");
const { encrypt, decrypt } = require("./utils/cryptography");
const crypto = require("crypto");
const { Op } = require("sequelize");
const JuryCron = require("./utils/jury-cron");

const {
  SMTP_ADDR,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  VERIFY_MAIL_TEMPLATE,
  NOTIFY_MAIL_TEMPLATE,
  JWT_SECRET,
  TOKEN_HEADER_KEY,
} = require("./config/constants");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

class PartsHelper {
  constructor(part) {
    this.id = part.ID;
    this.date = part.Date;
    this.projectID = part.ProjectID;
    this.link = part.Link;
    this.studentID = part.StudentID;
    this.video = part.Video?.toString();
  }
}

if (process.argv.length !== 3) {
  console.log("Execuție: node app.js <parolă>");
  process.exit(1);
} else {
  key = crypto
    .createHash("sha256")
    .update(process.argv[2])
    .digest("base64")
    .substring(0, 32);
  try {
    decrypt(
      {
        iv: "f623e22c67c68792e361a058bd97bdbf",
        encryptedData: "e004df190ef581ebaf2ae41e082c8e39",
      },
      key
    );
    transporter = nodemailer.createTransport({
      host: decrypt(SMTP_ADDR, key),
      port: parseInt(decrypt(SMTP_PORT, key)),
      secure: true,
      auth: {
        user: decrypt(SMTP_USER, key),
        pass: decrypt(SMTP_PASS, key),
      },
    });
  } catch (error) {
    console.log("Parolă incorectă!");
    process.exit(1);
  }
}

app.use(cors());
app.use(express.json());

app.post("/api/register", async (req, res) => {
  let code = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  const { username, password, email, calitate } = req.body;
  if (calitate === "profesor") {
    try {
      await User.create({
        Username: username,
        Email: email,
        Calitate: "profesor",
      });
      await Professor.create({
        Username: username,
        HashPassword: md5(password),
        Email: email,
      });
    } catch (error) {
      return res.status(400).json(error.errors[0].path.toLowerCase());
    }
  } else if (calitate === "student") {
    try {
      await User.create({
        Username: username,
        Email: email,
        Calitate: "student",
      });
      await Student.create({
        Username: username,
        HashPassword: md5(password),
        Email: email,
      });
    } catch (error) {
      return res.status(400).json(error.errors[0].path.toLowerCase());
    }
  }

  await transporter.sendMail({
    from: `"Zeth Web Verifier 💻" <${decrypt(SMTP_USER, key)}>`,
    to: email,
    subject: "Codul de înregistrare pe Zeth Anonymous Grading™",
    html: VERIFY_MAIL_TEMPLATE(username, code),
  });

  const token = jwt.sign(
    {
      username: username,
      calitate: calitate,
      needed_code: code,
      logged_in: false,
      verified: false,
    },
    decrypt(JWT_SECRET, key),
    {
      expiresIn: "1h",
    }
  );

  return res.status(200).json({ jwt: token });
});

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "no_token" });

  try {
    const decoded = jwt.verify(token, decrypt(JWT_SECRET, key));
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(400).json({ message: "invalid" });
  }
}

function verifyVerified(req, res, next) {
  const { verified } = req.userData;
  if (verified) return res.status(400).json({ message: "verified" });
  next();
}

app.post("/api/verify-status", [verifyToken, verifyVerified], (req, res) => {
  return res.status(200).json({ message: "not_verified" });
});

app.post("/api/verify/resend-code", verifyToken, async (req, res) => {
  const { username, needed_code } = req.userData;
  const { email } = req.body;
  await transporter.sendMail({
    from: `"Zeth Web Verifier 💻" <${decrypt(SMTP_USER, key)}>`,
    to: email,
    subject: "Codul de înregistrare pe Zeth Anonymous Grading™",
    html: VERIFY_MAIL_TEMPLATE(username, needed_code),
  });
  return res.status(200).json({ message: "sent" });
});

app.post("/api/verify", verifyToken, async (req, res) => {
  const { needed_code, calitate, username } = req.userData;
  const { sent_code } = req.body;
  if (needed_code !== sent_code)
    return res.status(400).json({ message: "no_match" });
  if (calitate === "profesor") {
    await Professor.update(
      { Verified: true },
      { where: { Username: username } }
    );
  } else if (calitate === "student") {
    await Student.update({ Verified: true }, { where: { Username: username } });
  }
  const token = jwt.sign(
    { username: username, calitate: calitate, verified: true, logged_in: true },
    decrypt(JWT_SECRET, key)
  );
  return res
    .status(200)
    .json({ message: "verified", jwt: token, calitate: calitate });
});

app.post("/api/verify/change-email", verifyToken, async (req, res) => {
  const { username, calitate, needed_code } = req.userData;
  const { email } = req.body;
  if (calitate === "profesor") {
    await Professor.update({ Email: email }, { where: { Username: username } });
  } else if (calitate === "student") {
    await Student.update({ Email: email }, { where: { Username: username } });
  }
  await transporter.sendMail({
    from: `"Zeth Web Verifier 💻" <${decrypt(SMTP_USER, key)}>`,
    to: email,
    subject: "Codul de înregistrare pe Zeth Anonymous Grading™",
    html: VERIFY_MAIL_TEMPLATE(username, needed_code),
  });
  return res.status(200).json({ message: "changed" });
});

app.post("/api/login", async (req, res) => {
  const { email: emailOrUsername, password } = req.body;
  const user = await User.findOne({
    where: { [Op.or]: { Username: emailOrUsername, Email: emailOrUsername } },
  });
  if (!user) return res.status(400).json({ message: "wrong_credentials" });
  const { Calitate: calitate, Email: email } = user.dataValues;
  switch (calitate) {
    case "student":
      const student = await Student.findOne({ where: { Email: email } });
      if (md5(password) != student.HashPassword)
        return res.status(400).json({ message: "wrong_credentials" });
      if (!student.Verified) {
        const code = Math.floor(Math.random() * 1000000)
          .toString()
          .padStart(6, "0");

        await transporter.sendMail({
          from: `"Zeth Web Verifier 💻" <${decrypt(SMTP_USER, key)}>`,
          to: email,
          subject: "Codul de înregistrare pe Zeth Anonymous Grading™",
          html: VERIFY_MAIL_TEMPLATE(student.Username, code),
        });

        const token = jwt.sign(
          {
            username: student.Username,
            calitate: "student",
            needed_code: code,
            logged_in: false,
            verified: false,
          },
          decrypt(JWT_SECRET, key),
          {
            expiresIn: "1h",
          }
        );

        return res
          .status(200)
          .json({ jwt: token, message: "not_verified", email: email });
      }
      token = jwt.sign(
        {
          username: student.Username,
          calitate: "student",
        },
        decrypt(JWT_SECRET, key)
      );
      return res.status(200).json({
        message: "logged_in",
        jwt: token,
        calitate: "student",
      });
    case "profesor":
      const professor = await Professor.findOne({ where: { Email: email } });
      if (md5(password) != professor.HashPassword)
        return res.status(400).json({ message: "wrong_credentials" });
      if (!professor.Verified) {
        const code = Math.floor(Math.random() * 1000000)
          .toString()
          .padStart(6, "0");

        await transporter.sendMail({
          from: `"Zeth Web Verifier 💻" <${decrypt(SMTP_USER, key)}>`,
          to: email,
          subject: "Codul de înregistrare pe Zeth Anonymous Grading™",
          html: VERIFY_MAIL_TEMPLATE(professor.Username, code),
        });

        const token = jwt.sign(
          {
            username: professor.Username,
            calitate: "profesor",
            needed_code: code,
            logged_in: false,
            verified: false,
          },
          decrypt(JWT_SECRET, key),
          {
            expiresIn: "1h",
          }
        );

        return res
          .status(200)
          .json({ jwt: token, message: "not_verified", email: email });
      }
      token = jwt.sign(
        {
          username: professor.Username,
          calitate: "profesor",
        },
        decrypt(JWT_SECRET, key)
      );
      return res.status(200).json({
        message: "logged_in",
        jwt: token,
        calitate: "profesor",
      });
  }
});

app.get("/api/profile-info", verifyToken, async (req, res) => {
  const { username, calitate } = req.userData;
  switch (calitate) {
    case "student":
      const student = await Student.findOne({ where: { Username: username } });
      const project = await Project.findOne({
        where: { TeamID: student.TeamID },
      });
      const team = await Team.findOne({ where: { ID: student.TeamID } });
      return res.status(200).json({
        username: student.Username,
        name: student.Name,
        email: student.Email,
        project: project?.Name,
        team: team?.Name,
        avatar: student.Avatar ? student.Avatar.toString() : null,
      });
    case "profesor":
      const professor = await Professor.findOne({
        where: { Username: username },
      });
      return res.status(200).json({
        username: professor.Username,
        name: professor.Name,
        email: professor.Email,
        avatar: professor.Avatar ? professor.Avatar.toString() : null,
      });
  }
  return res.status(400).json({ message: "unknown" });
});

app.put("/api/change-name", verifyToken, async (req, res) => {
  const { calitate, name, username } = req.body;
  switch (calitate) {
    case "student":
      await Student.update({ Name: name }, { where: { Username: username } });
      return res.status(200).json({ message: "updated" });
    case "profesor":
      await Professor.update({ Name: name }, { where: { Username: username } });
      return res.status(200).json({ message: "updated" });
  }
  return res.status(400).json({ message: "unknown" });
});

app.post(
  "/api/upload-avatar",
  [verifyToken, express.raw({ type: "text/plain", limit: "50mb" })],
  async (req, res) => {
    const { calitate, username } = req.userData;
    switch (calitate) {
      case "student":
        await Student.update(
          { Avatar: Buffer.from(req.body, "base64") },
          { where: { Username: username } }
        );
        return res.status(200).json({ message: "uploaded" });
      case "profesor":
        await Professor.update(
          { Avatar: Buffer.from(req.body, "base64") },
          { where: { Username: username } }
        );
        return res.status(200).json({ message: "uploaded" });
    }
    return res.status(400).json({ message: "unknown" });
  }
);

app.post("/api/create-team", verifyToken, async (req, res) => {
  const { calitate, username } = req.userData;
  switch (calitate) {
    case "student":
      const findTeam = await Team.findOne({ where: { Name: req.body.name } });
      if (findTeam) return res.status(400).json({ message: "exists" });
      const team = await Team.create({ Name: req.body.name });
      await Student.update(
        { TeamID: team.ID, Jury: false },
        { where: { Username: username } }
      );
      return res.status(200).json({ message: "created" });
  }
  return res.status(400).json({ message: "unknown" });
});

app.post("/api/join-team", verifyToken, async (req, res) => {
  const { calitate, username } = req.userData;
  switch (calitate) {
    case "student":
      const team = await Team.findOne({ where: { Name: req.body.name } });
      if (!team) return res.status(400).json({ message: "not found" });
      await Student.update(
        { TeamID: team.ID, Jury: false },
        { where: { Username: username } }
      );
      return res.status(200).json({ message: "joined" });
  }
});

app.post("/api/create-project", verifyToken, async (req, res) => {
  const { calitate, username } = req.userData;
  switch (calitate) {
    case "student":
      const student = await Student.findOne({ where: { Username: username } });
      const team = await Team.findOne({ where: { ID: student.TeamID } });
      const project = await Project.create({
        TeamID: student.TeamID,
        Name: req.body.name,
      });
      await Team.update({ ProjectID: project.ID }, { where: { ID: team.ID } });
      return res.status(200).json({ message: "created" });
  }
  return res.status(400).json({ message: "unknown" });
});

app.post("/api/new-delivery", verifyToken, async (req, res) => {
  const { username } = req.userData;
  const { link, date } = req.body;
  const student = await Student.findOne({ where: { Username: username } });
  const project = await Project.findOne({ where: { TeamID: student.TeamID } });
  const part = await Part.create({
    ProjectID: project.ID,
    Date: date,
    Link: link ? link : null,
    StudentID: student.ID,
  });
  // alegerea juriului
  // try {
  //   const studentiFaraEchipa = await Student.findAll({
  //     where: { Jury: true },
  //   });
  //   const shuffle = (array) => {
  //     for (let i = array.length - 1; i > 0; i--) {
  //       let j = Math.floor(Math.random() * (i + 1));
  //       [array[i], array[j]] = [array[j], array[i]];
  //     }
  //     return array;
  //   };
  //   const studentiFaraEchipaAmestecati = shuffle(studentiFaraEchipa);
  //   const studentiJuriu = studentiFaraEchipaAmestecati.slice(0, 3);
  //   await Promise.all(
  //     studentiJuriu.map(async (studentJuriu) => {
  //       await Jury.create({ PartID: part.ID, StudentID: studentJuriu.ID });
  //       await transporter.sendMail({
  //         from: `"Zeth Web Notifier 💻" <${decrypt(SMTP_USER, key)}>`,
  //         to: studentJuriu.Email,
  //         subject: "Ai fost ales ca membru al juriului!",
  //         html: NOTIFY_MAIL_TEMPLATE(studentJuriu.Name, date, team.Name),
  //       });
  //     })
  //   );
  // } catch (err) {
  //   console.log(err);
  // }
  return res.status(200).json({ message: "success", partID: part.ID });
});

app.post(
  "/api/upload-video",
  [verifyToken, express.raw({ type: "text/plain", limit: "100mb" })],
  async (req, res) => {
    console.log(req.headers);
    const PartID = req.headers["partid"];
    await Part.update(
      { Video: Buffer.from(req.body, "base64") },
      { where: { ID: PartID } }
    );
    return res.status(200).json({ message: "uploaded" });
  }
);

app.get("/api/get-deliveries", verifyToken, async (req, res) => {
  const { username } = req.userData;
  const student = await Student.findOne({ where: { Username: username } });
  try {
    const project = await Project.findOne({
      where: { TeamID: student.TeamID },
    });
    const parts = await Part.findAll({ where: { ProjectID: project.ID } });
    let result = [];
    parts.forEach((part) => result.push(new PartsHelper(part)));
    parts.sort((a, b) => a.Date - b.Date);
    result = await Promise.all(
      result.map(async (part) => {
        const autor = await Student.findOne({ where: { ID: part.studentID } });
        let grade = 0;
        try {
          const grades = await Grade.findAll({ where: { PartID: part.id } });
          if (grades.length === 1) grade = grades[0].Grade;
          else if (grades.length === 2)
            grade = (grades[0].Grade + grades[1].Grade) / 2;
          else if (grades.length > 2) {
            grades.sort((a, b) => a.Grade - b.Grade);
            for (let i = 1; i < grades.length - 1; i++)
              grade += grades[i].Grade;
            grade /= grades.length - 2;
            grade = parseFloat(grade.toFixed(2));
          }
          return { ...part, autor: autor.Name, nota: grade };
        } catch (err) {
          return { ...part, autor: autor.Name, nota: grade };
        }
      })
    );
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ error: "not found" });
  }
});

app.get("/api/get-student-name/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findOne({ where: { ID: id } });
    return res.status(200).json({
      name: student.Name,
    });
  } catch (err) {
    return res.status(400).json({ error: "not found" });
  }
});

app.get("/api/get-jury-deliveries", verifyToken, async (req, res) => {
  const { username } = req.userData;
  try {
    const student = await Student.findOne({ where: { Username: username } });
    const juryParts = await Jury.findAll({ where: { StudentID: student.ID } });
    async function processJuryParts(juryParts) {
      const partsToNote = [];

      await Promise.all(
        juryParts.map(async (juryPart) => {
          const part = await Part.findOne({ where: { ID: juryPart.PartID } });

          if (part) {
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            const partDate = new Date(part.Date);
            partDate.setHours(0, 0, 0, 0);
            if (currentDate.getTime() === partDate.getTime()) {
              partsToNote.push(part);
            }
          }
        })
      );

      return partsToNote;
    }
    processJuryParts(juryParts).then((futureParts) => {
      let result = [];
      futureParts.forEach((part) => result.push(new PartsHelper(part)));
      result.sort((a, b) => a.Date - b.Date);
      return res.status(200).json(result);
    });
  } catch (err) {
    return res.status(400).json({ error: "not found" });
  }
});

app.post("/api/grade-delivery", verifyToken, async (req, res) => {
  const { username } = req.userData;
  const { partID, grade } = req.body;
  try {
    const student = await Student.findOne({ where: { Username: username } });
    const part = await Part.findOne({ where: { ID: partID } });
    const jury = await Jury.findOne({
      where: { StudentID: student.ID, PartID: part.ID },
    });
    if (!jury) return res.status(400).json({ error: "not found" });
    const gradeObj = await Grade.findOne({
      where: { PartID: part.ID, Who: student.ID },
    });
    if (!gradeObj)
      await Grade.create({
        PartID: part.ID,
        StudentID: student.ID,
        Grade: grade,
        Who: student.ID,
        LastWhen: new Date(),
      });
    else if ((new Date() - gradeObj.LastWhen) / 60000 > 30)
      return res.status(400).json({ error: "too late" });
    else
      await Grade.update(
        { Grade: grade },
        { where: { PartID: part.ID, Who: student.ID } }
      );
    return res.status(200).json({ message: "success" });
  } catch (err) {
    return res.status(400).json({ error: "not found" });
  }
});

app.post("/api/proiecte", verifyToken, async (req, res) => {
  const { calitate } = req.userData;
  const { start, stop } = req.body;
  if (calitate !== "profesor")
    return res.status(400).json({ error: "not found" });
  try {
    const parts = await Part.findAll({
      where: { Date: { [Op.between]: [start, stop] } },
    });
    async function groupPartsByProject(parts) {
      const augmentedPartsPromises = parts.map(async (part) => {
        const usefulPart = new PartsHelper(part);
        const grades = await Grade.findAll({
          where: { PartID: usefulPart.id },
        });
        let grade = 0;
        if (grades.length === 1) grade = grades[0].Grade;
        else if (grades.length === 2)
          grade = (grades[0].Grade + grades[1].Grade) / 2;
        else if (grades.length > 2) {
          grades.sort((a, b) => a.Grade - b.Grade);
          for (let i = 1; i < grades.length - 1; i++) grade += grades[i].Grade;
          grade /= grades.length - 2;
          grade = parseFloat(grade.toFixed(2));
        }
        const project = await Project.findOne({
          where: { ID: part.ProjectID },
        });
        const projectName = project.Name;
        const team = await Team.findOne({ where: { ID: project.TeamID } });
        const teamName = team.Name;
        return { ...usefulPart, projectName, teamName, grade };
      });
      const augmentedParts = await Promise.all(augmentedPartsPromises);
      const partsGroupedByProject = augmentedParts.reduce((acc, curr) => {
        if (!acc[curr.teamName]) acc[curr.teamName] = {};
        acc[curr.teamName].projectName = curr.projectName;
        const { id, date, projectID, video, studentID, link, grade } = curr;
        if (!acc[curr.teamName].parts) acc[curr.teamName].parts = [];
        acc[curr.teamName].parts.push({
          id,
          date,
          projectID,
          video,
          studentID,
          link,
          grade,
        });
        return acc;
      }, {});
      return partsGroupedByProject;
    }
    groupPartsByProject(parts).then((partsGroupedByProject) => {
      for (const team in partsGroupedByProject) {
        partsGroupedByProject[team].parts.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        let sum = 0;
        partsGroupedByProject[team].parts.forEach(
          (part) => (sum += part.grade)
        );
        partsGroupedByProject[team].average = parseFloat(
          (sum / partsGroupedByProject[team].parts.length).toFixed(2)
        );
      }
      return res.status(200).json(partsGroupedByProject);
    });
  } catch (err) {
    return res.status(400).json({ error: "not found" });
  }
});

app.listen(port);

new JuryCron(key).start();
