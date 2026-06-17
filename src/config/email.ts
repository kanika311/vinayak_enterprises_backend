import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (options: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@scientificinstruments.com',
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
};

export default transporter;
