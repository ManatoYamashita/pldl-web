// SMTP でメールを送る。お問い合わせフォームと、SNS 自動投稿の失敗通知で使う
import nodemailer from 'nodemailer';
import type { SendMailOptions } from 'nodemailer';

export async function sendMail(options: Omit<SendMailOptions, 'from' | 'to'>) {
  const port = Number(process.env.SMTP_PORT) || 587;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    ...options,
    from: process.env.SMTP_FROM,
    to: process.env.CONTACT_TO,
  });
}
