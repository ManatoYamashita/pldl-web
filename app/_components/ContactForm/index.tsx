'use client';
import { useActionState } from 'react';
import styles from './index.module.css';

type FormState = { status: 'idle' } | { status: 'success' } | { status: 'error'; message: string };

async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const res = await fetch('/api/submit-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lastname: formData.get('lastname'),
        firstname: formData.get('firstname'),
        company: formData.get('company'),
        email: formData.get('email'),
        message: formData.get('message'),
      }),
    }).then((r) => r.json());
    if (res.status === 'error') {
      return { status: 'error', message: res.message };
    }
    return { status: 'success' };
  } catch {
    return { status: 'error', message: '送信に失敗しました。もう一度お試しください。' };
  }
}

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, { status: 'idle' });

  if (state.status === 'success') {
    return (
      <p className={styles.success}>
        お問い合わせいただき、ありがとうございます。
        <br />
        お返事まで今しばらくお待ちください。
      </p>
    );
  }
  return (
    <form className={styles.form} action={formAction}>
      <div className={styles.horizontal}>
        <div className={styles.item}>
          <label className={styles.label} htmlFor="lastname">
            姓
          </label>
          <input className={styles.textfield} type="text" id="lastname" name="lastname" />
        </div>
        <div className={styles.item}>
          <label className={styles.label} htmlFor="firstname">
            名
          </label>
          <input className={styles.textfield} type="text" id="firstname" name="firstname" />
        </div>
      </div>
      <div className={styles.item}>
        <label className={styles.label} htmlFor="company">
          会社名
        </label>
        <input className={styles.textfield} type="text" id="company" name="company" />
      </div>
      <div className={styles.item}>
        <label className={styles.label} htmlFor="email">
          メールアドレス
        </label>
        <input className={styles.textfield} type="text" id="email" name="email" />
      </div>
      <div className={styles.item}>
        <label className={styles.label} htmlFor="message">
          メッセージ
        </label>
        <textarea className={styles.textarea} id="message" name="message" />
      </div>
      <div className={styles.actions}>
        {state.status === 'error' && <p className={styles.error}>{state.message}</p>}
        <input
          type="submit"
          value={isPending ? '送信中...' : '送信する'}
          disabled={isPending}
          className={styles.button}
        />
      </div>
    </form>
  );
}
