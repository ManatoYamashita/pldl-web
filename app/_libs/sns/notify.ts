// SNS 自動投稿の失敗を管理者（CONTACT_TO）にメールで知らせる
import { sendMail } from '@/app/_libs/mailer';

export async function notifySnsFailure(subject: string, lines: string[]) {
  try {
    await sendMail({
      subject: `【SNS自動投稿】${subject}`,
      text: [...lines, '', 'このメールはサイトから自動で送信しています。'].join('\n'),
    });
  } catch (error) {
    // 通知の失敗で処理全体を失敗させない。ログには残す
    console.error('[sns] 失敗通知のメール送信に失敗しました:', error);
  }
}
