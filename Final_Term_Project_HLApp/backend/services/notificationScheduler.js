const cron = require("node-cron");
const Prescription = require("../models/Prescription");
const Treatment = require("../models/Treatment");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { sendMedicationReminder, sendFollowUpReminder } = require("./emailService");

let schedulers = [];

const startMedicationReminders = () => {
  const task = cron.schedule("0 8 * * *", async () => {
    console.log("\n⏰ Running medication reminder scheduler...");

    try {
      const prescriptions = await Prescription.find()
        .populate("patient")
        .populate("doctor");

      for (let prescription of prescriptions) {
        const patientUser = await User.findById(prescription.patient.userId);

        if (patientUser && prescription.medications.length > 0) {
          const previewUrl = await sendMedicationReminder(
            patientUser.email,
            patientUser.name,
            {
              medications: prescription.medications,
            }
          );

          const notification = new Notification({
            user: patientUser._id,
            type: "medication",
            channel: "email",
            message: `Medication reminder for your prescription`,
            emailPreviewUrl: previewUrl,
            relatedPrescription: prescription._id,
          });

          await notification.save();
        }
      }

      console.log("✓ Medication reminder scheduler completed");
    } catch (error) {
      console.error("Error in medication reminder scheduler:", error);
    }
  });

  schedulers.push(task);
};

const startFollowUpReminders = () => {
  const task = cron.schedule("0 9 * * *", async () => {
    console.log("\n⏰ Running follow-up reminder scheduler...");

    try {
      const treatments = await Treatment.find()
        .populate("patient")
        .populate("doctor");

      for (let treatment of treatments) {
        for (let followUp of treatment.followUps) {
          if (!followUp.completed) {
            const followUpDate = new Date(followUp.scheduledDate);
            const today = new Date();
            const daysUntil = Math.ceil((followUpDate - today) / (1000 * 60 * 60 * 24));

            if (daysUntil === 1 || daysUntil === 7) {
              const patientUser = await User.findById(treatment.patient.userId);

              if (patientUser) {
                const previewUrl = await sendFollowUpReminder(
                  patientUser.email,
                  patientUser.name,
                  followUpDate
                );

                const notification = new Notification({
                  user: patientUser._id,
                  type: "followup",
                  channel: "email",
                  message: `Follow-up reminder: ${daysUntil} day(s) remaining`,
                  emailPreviewUrl: previewUrl,
                  relatedTreatment: treatment._id,
                });

                await notification.save();
              }
            }
          }
        }
      }

      console.log("✓ Follow-up reminder scheduler completed");
    } catch (error) {
      console.error("Error in follow-up reminder scheduler:", error);
    }
  });

  schedulers.push(task);
};

const stopAllSchedulers = () => {
  schedulers.forEach((scheduler) => scheduler.stop());
  schedulers = [];
  console.log("✓ All schedulers stopped");
};

module.exports = {
  startMedicationReminders,
  startFollowUpReminders,
  stopAllSchedulers,
};
