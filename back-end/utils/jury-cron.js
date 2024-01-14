const CronJob = require("cron").CronJob;
const Part = require("../models/part");
const Student = require("../models/student");
const Jury = require("../models/jury");
const Team = require("../models/team");
const { decrypt } = require("./cryptography");
const { SMTP_USER, NOTIFY_MAIL_TEMPLATE } = require("../config/constants");

class JuryCron {
  constructor(key) {
    this.key = key;
    this.cronJob = new CronJob("0 0 * * *", async () => {
      try {
        this.chooseJuryForDueDeliveries();
      } catch (error) {
        console.error(error);
      }
    });
  }
  start() {
    if (!this.cronJob.running) {
      this.cronJob.start();
    }
  }

  chooseJuryForDueDeliveries = async () => {
    try {
      const todayParts = await Part.findAll({
        where: { Date: new Date().toISOString().slice(0, 10) },
      });
      if (todayParts.length === 0) return;
      todayParts.forEach(async (part) => {
        const studentiFaraEchipa = await Student.findAll({
          where: { Jury: true },
        });
        const shuffle = (array) => {
          for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
        };
        const studentiFaraEchipaAmestecati = shuffle(studentiFaraEchipa);
        const studentiJuriu = studentiFaraEchipaAmestecati.slice(0, 3);
        await Promise.all(
          studentiJuriu.map(async (studentJuriu) => {
            await Jury.create({ PartID: part.ID, StudentID: studentJuriu.ID });
            const team = await Team.findOne({
              where: { ProjectID: part.ProjectID },
            });
            await transporter.sendMail({
              from: `"Zeth Web Notifier 💻" <${decrypt(SMTP_USER, this.key)}>`,
              to: studentJuriu.Email,
              subject: "Ai fost ales ca membru al juriului!",
              html: NOTIFY_MAIL_TEMPLATE(
                studentJuriu.Name,
                new Date().toISOString().slice(0, 10),
                team.Name
              ),
            });
          })
        );
      });
    } catch {
      console.error(error);
    }
  };
}

module.exports = JuryCron;
