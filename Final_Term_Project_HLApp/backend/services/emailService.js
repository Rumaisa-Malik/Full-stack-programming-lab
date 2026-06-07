const nodemailer = require("nodemailer");

let transporter;

const initializeTransporter = async () => {
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(`\n✓ Ethereal test account created: ${testAccount.user}`);
  } catch (error) {
    console.error("Failed to initialize email transporter:", error);
  }
};

const sendAppointmentConfirmation = async (patientEmail, patientName, appointmentDetails) => {
  try {
    if (!transporter) await initializeTransporter();

    const htmlContent = `
      <h2>Appointment Confirmed!</h2>
      <p>Dear ${patientName},</p>
      <p>Your appointment has been confirmed. Here are the details:</p>
      <ul>
        <li><strong>Specialty:</strong> ${appointmentDetails.specialty}</li>
        <li><strong>Doctor:</strong> ${appointmentDetails.doctorName || "To be assigned"}</li>
        <li><strong>Date:</strong> ${new Date(appointmentDetails.date).toLocaleString()}</li>
        <li><strong>Reason:</strong> ${appointmentDetails.reason}</li>
      </ul>
      <p>Please arrive 15 minutes early.</p>
      <p>Best regards,<br/>MediFlow Team</p>
    `;

    const info = await transporter.sendMail({
      from: '"MediFlow" <noreply@mediflow.dev>',
      to: patientEmail,
      subject: "Appointment Confirmation",
      html: htmlContent,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`\n✓ Email sent. Preview: ${previewUrl}`);

    return previewUrl;
  } catch (error) {
    console.error("Error sending appointment confirmation email:", error);
    return null;
  }
};

const sendMedicationReminder = async (patientEmail, patientName, medicationDetails) => {
  try {
    if (!transporter) await initializeTransporter();

    const medicationList = medicationDetails.medications
      .map(
        (med) =>
          `<li>${med.name} - ${med.dosage}, ${med.schedule} for ${med.durationDays} days</li>`
      )
      .join("");

    const htmlContent = `
      <h2>Medication Reminder</h2>
      <p>Dear ${patientName},</p>
      <p>This is a reminder to take your medications as prescribed:</p>
      <ul>${medicationList}</ul>
      <p>Please follow the schedule strictly for best results.</p>
      <p>Best regards,<br/>MediFlow Team</p>
    `;

    const info = await transporter.sendMail({
      from: '"MediFlow" <noreply@mediflow.dev>',
      to: patientEmail,
      subject: "Medication Reminder",
      html: htmlContent,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`\n✓ Medication reminder sent. Preview: ${previewUrl}`);

    return previewUrl;
  } catch (error) {
    console.error("Error sending medication reminder email:", error);
    return null;
  }
};

const sendFollowUpReminder = async (patientEmail, patientName, appointmentDate) => {
  try {
    if (!transporter) await initializeTransporter();

    const htmlContent = `
      <h2>Follow-Up Appointment Reminder</h2>
      <p>Dear ${patientName},</p>
      <p>This is a reminder for your scheduled follow-up appointment:</p>
      <p><strong>Date & Time:</strong> ${new Date(appointmentDate).toLocaleString()}</p>
      <p>Please ensure you don't miss this important appointment.</p>
      <p>Best regards,<br/>MediFlow Team</p>
    `;

    const info = await transporter.sendMail({
      from: '"MediFlow" <noreply@mediflow.dev>',
      to: patientEmail,
      subject: "Follow-Up Reminder",
      html: htmlContent,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`\n✓ Follow-up reminder sent. Preview: ${previewUrl}`);

    return previewUrl;
  } catch (error) {
    console.error("Error sending follow-up reminder email:", error);
    return null;
  }
};

const sendAppointmentBookingNotification = async (doctorEmail, doctorName, appointmentDetails) => {
  try {
    if (!transporter) await initializeTransporter();

    const htmlContent = `
      <h2>New Appointment Booking</h2>
      <p>Dear Dr. ${doctorName},</p>
      <p>A new appointment has been booked with you. Here are the details:</p>
      <ul>
        <li><strong>Patient:</strong> ${appointmentDetails.patientName}</li>
        <li><strong>Contact:</strong> ${appointmentDetails.patientEmail}</li>
        <li><strong>Specialty:</strong> ${appointmentDetails.specialty}</li>
        <li><strong>Date & Time:</strong> ${new Date(appointmentDetails.requestedDate).toLocaleString()}</li>
        <li><strong>Reason:</strong> ${appointmentDetails.reason}</li>
      </ul>
      <p>Please log in to MediFlow to manage this appointment.</p>
      <p>Best regards,<br/>MediFlow Team</p>
    `;

    const info = await transporter.sendMail({
      from: '"MediFlow" <noreply@mediflow.dev>',
      to: doctorEmail,
      subject: "New Appointment Booking",
      html: htmlContent,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`\n✓ Doctor appointment notification sent. Preview: ${previewUrl}`);

    return previewUrl;
  } catch (error) {
    console.error("Error sending doctor appointment notification:", error);
    return null;
  }
};

module.exports = {
  initializeTransporter,
  sendAppointmentConfirmation,
  sendMedicationReminder,
  sendFollowUpReminder,
  sendAppointmentBookingNotification,
};
