import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GOOGLE_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("Error occurred while verifying transporter:", error);
  } else {
    console.log("Transporter is ready to send emails");
  }
});

export async function sendMail({ to, subject, text, html }) {
  const mailOptions = {
    from: `Perplexity <${process.env.GOOGLE_USER}>`,
    to,
    subject,
    text,
    html,
  };
  const details = await transporter.sendMail(mailOptions);
  console.log("Email sent:", details);
}
