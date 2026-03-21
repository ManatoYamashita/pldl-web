'use client';
import { useActionState, useState } from 'react';
import styles from './index.module.css';

type FormState = { status: 'idle' } | { status: 'success' } | { status: 'error'; message: string };

const ATTRIBUTE_OPTIONS = ['高校生', '大学生', '正社員', 'フリーター', 'その他'] as const;

async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const res = await fetch('/api/submit-contact', {
      method: 'POST',
      body: formData,
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
  const [attribute, setAttribute] = useState('');
  const [fileName, setFileName] = useState('');

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
            姓<span className={styles.required}>必須</span>
          </label>
          <input className={styles.textfield} type="text" id="lastname" name="lastname" />
        </div>
        <div className={styles.item}>
          <label className={styles.label} htmlFor="firstname">
            名<span className={styles.required}>必須</span>
          </label>
          <input className={styles.textfield} type="text" id="firstname" name="firstname" />
        </div>
      </div>
      <div className={styles.item}>
        <label className={styles.label} htmlFor="attribute">
          属性<span className={styles.required}>必須</span>
        </label>
        <select
          className={styles.select}
          id="attribute"
          name="attribute"
          value={attribute}
          onChange={(e) => setAttribute(e.target.value)}
        >
          <option value="">選択してください</option>
          {ATTRIBUTE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      {attribute === 'その他' && (
        <div className={styles.item}>
          <label className={styles.label} htmlFor="attributeOther">
            属性（詳細）<span className={styles.required}>必須</span>
          </label>
          <input
            className={styles.textfield}
            type="text"
            id="attributeOther"
            name="attributeOther"
            placeholder="具体的にご記入ください"
          />
        </div>
      )}
      <div className={styles.item}>
        <label className={styles.label} htmlFor="email">
          メールアドレス<span className={styles.required}>必須</span>
        </label>
        <input className={styles.textfield} type="email" id="email" name="email" />
      </div>
      <div className={styles.item}>
        <label className={styles.label} htmlFor="message">
          メッセージ<span className={styles.required}>必須</span>
        </label>
        <textarea className={styles.textarea} id="message" name="message" />
      </div>
      <div className={styles.item}>
        <label className={styles.label}>
          添付ファイル<span className={styles.optional}>任意</span>
        </label>
        <div className={styles.fileInputWrapper}>
          <label className={styles.fileLabel} htmlFor="file">
            ファイルを選択
          </label>
          <input
            className={styles.fileInput}
            type="file"
            id="file"
            name="file"
            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
          />
          <span className={styles.fileName}>{fileName || '選択されていません'}</span>
        </div>
        <p className={styles.fileHint}>PDF・JPG・PNG・GIF・WebP（10MB以下）</p>
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
