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
const { encrypt, decrypt } = require("./utils/cryptography");
const crypto = require("crypto");

const {
  SMTP_ADDR,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  MAIL_TEMPLATE,
  JWT_SECRET,
  TOKEN_HEADER_KEY,
} = require("./config/constants");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

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
  } catch (error) {
    console.log("Parolă incorectă!");
    process.exit(1);
  }
}

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.post("/api/register", async (req, res) => {
  let code = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  const { username, password, email, calitate } = req.body;
  if (calitate === "profesor") {
    try {
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
      await Student.create({
        Username: username,
        HashPassword: md5(password),
        Email: email,
      });
    } catch (error) {
      return res.status(400).json(error.errors[0].path.toLowerCase());
    }
  }

  const transporter = nodemailer.createTransport({
    host: decrypt(SMTP_ADDR, key),
    port: parseInt(decrypt(SMTP_PORT, key)),
    secure: true,
    auth: {
      user: decrypt(SMTP_USER, key),
      pass: decrypt(SMTP_PASS, key),
    },
  });

  await transporter.sendMail({
    from: `"Zeth Web Verifier 💻" <${decrypt(SMTP_USER, key)}>`,
    to: email,
    subject: "Codul de înregistrare pe Zeth Anonymous Grading™",
    html: MAIL_TEMPLATE(username, code),
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
  const transporter = nodemailer.createTransport({
    host: decrypt(SMTP_ADDR, key),
    port: parseInt(decrypt(SMTP_PORT, key)),
    secure: true,
    auth: {
      user: decrypt(SMTP_USER, key),
      pass: decrypt(SMTP_PASS, key),
    },
  });
  await transporter.sendMail({
    from: `"Zeth Web Verifier 💻" <${decrypt(SMTP_USER, key)}>`,
    to: email,
    subject: "Codul de înregistrare pe Zeth Anonymous Grading™",
    html: MAIL_TEMPLATE(username, needed_code),
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
  const transporter = nodemailer.createTransport({
    host: decrypt(SMTP_ADDR, key),
    port: parseInt(decrypt(SMTP_PORT, key)),
    secure: true,
    auth: {
      user: decrypt(SMTP_USER, key),
      pass: decrypt(SMTP_PASS, key),
    },
  });

  await transporter.sendMail({
    from: `"Zeth Web Verifier 💻" <${decrypt(SMTP_USER, key)}>`,
    to: email,
    subject: "Codul de înregistrare pe Zeth Anonymous Grading™",
    html: MAIL_TEMPLATE(username, needed_code),
  });
  return res.status(200).json({ message: "changed" });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (email.endsWith("stud.ase.ro")) {
    let student = await Student.findOne({ where: { Email: email } });
    if (!student) return res.status(400).json({ message: "wrong_credentials" });
    student = student.dataValues;
    if (student.HashPassword !== md5(password))
      return res.status(400).json({ message: "wrong_credentials" });
    if (!student.Verified) {
      const code = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0");
      const transporter = nodemailer.createTransport({
        host: decrypt(SMTP_ADDR, key),
        port: parseInt(decrypt(SMTP_PORT, key)),
        secure: true,
        auth: {
          user: decrypt(SMTP_USER, key),
          pass: decrypt(SMTP_PASS, key),
        },
      });

      await transporter.sendMail({
        from: `"Zeth Web Verifier 💻" <${decrypt(SMTP_USER, key)}>`,
        to: email,
        subject: "Codul de înregistrare pe Zeth Anonymous Grading™",
        html: MAIL_TEMPLATE(student.Username, code),
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

      return res.status(200).json({ jwt: token, message: "not_verified" });
    }
    const token = jwt.sign(
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
  } else if (email.endsWith("ase.ro")) {
    let professor = await Professor.findOne({ where: { Email: email } });
    if (!professor)
      return res.status(400).json({ message: "wrong_credentials" });
    professor = professor.dataValues;
    if (professor.HashPassword !== md5(password))
      return res.status(400).json({ message: "wrong_credentials" });
    if (!professor.Verified) {
      const code = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0");
      const transporter = nodemailer.createTransport({
        host: decrypt(SMTP_ADDR, key),
        port: parseInt(decrypt(SMTP_PORT, key)),
        secure: true,
        auth: {
          user: decrypt(SMTP_USER, key),
          pass: decrypt(SMTP_PASS, key),
        },
      });

      await transporter.sendMail({
        from: `"Zeth Web Verifier 💻" <${decrypt(SMTP_USER, key)}>`,
        to: email,
        subject: "Codul de înregistrare pe Zeth Anonymous Grading™",
        html: MAIL_TEMPLATE(professor.Username, code),
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

      return res.status(200).json({ jwt: token, message: "not_verified" });
    }
    const token = jwt.sign(
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
  } else return res.status(400).json({ message: "wrong_credentials" });
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
  }
  return res.status(400).json({ message: "unknown" });
});

app.put("/api/change-name", verifyToken, async (req, res) => {
  const { calitate, name, username } = req.body;
  switch (calitate) {
    case "student":
      await Student.update({ Name: name }, { where: { Username: username } });
      return res.status(200).json({ message: "updated" });
  }
  return res.status(400).json({ message: "unknown" });
});

app.post(
  "/api/upload-avatar",
  [verifyToken, express.raw({ type: "*/*", limit: "50mb" })],
  async (req, res) => {
    const { calitate, username } = req.userData;
    switch (calitate) {
      case "student":
        await Student.update(
          { Avatar: Buffer.from(req.body, "base64") },
          { where: { Username: username } }
        );
        return res.status(200).json({ message: "uploaded" });
    }
    return res.status(400).json({ message: "unknown" });
  }
);

app.listen(port);
