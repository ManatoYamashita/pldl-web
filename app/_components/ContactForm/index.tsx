'use client';
import { startTransition, useActionState, useState, type FormEvent } from 'react';
import {
  CONTACT_ATTRIBUTE_OPTIONS,
  CONTACT_MAX_FILE_SIZE,
  CONTACT_MAX_FILE_SIZE_LABEL,
  CONTACT_MAX_LENGTH,
} from '@/app/_constants/contact';
import styles from './index.module.css';

type FormState = { status: 'idle' } | { status: 'success' } | { status: 'error'; message: string };

async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  // 上限を超えるファイルは Vercel が API に届く前に JSON ではない 413 で弾くため、送信前に止める
  const file = formData.get('file');
  if (file instanceof File && file.size > CONTACT_MAX_FILE_SIZE) {
    return {
      status: 'error',
      message: `ファイルサイズは${CONTACT_MAX_FILE_SIZE_LABEL}以下にしてください`,
    };
  }
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

  // <form action> に関数を渡すと、React は結果にかかわらず送信後にフォームをリセットし、
  // エラーのときも入力と添付が消える。それを避けるため onSubmit から送る
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

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
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.horizontal}>
        <div className={styles.item}>
          <label className={styles.label} htmlFor="lastname">
            姓<span className={styles.required}>必須</span>
          </label>
          <input
            className={styles.textfield}
            type="text"
            id="lastname"
            name="lastname"
            maxLength={CONTACT_MAX_LENGTH.lastname}
          />
        </div>
        <div className={styles.item}>
          <label className={styles.label} htmlFor="firstname">
            名<span className={styles.required}>必須</span>
          </label>
          <input
            className={styles.textfield}
            type="text"
            id="firstname"
            name="firstname"
            maxLength={CONTACT_MAX_LENGTH.firstname}
          />
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
          {CONTACT_ATTRIBUTE_OPTIONS.map((opt) => (
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
            maxLength={CONTACT_MAX_LENGTH.attributeOther}
            placeholder="具体的にご記入ください"
          />
        </div>
      )}
      <div className={styles.item}>
        <label className={styles.label} htmlFor="email">
          メールアドレス<span className={styles.required}>必須</span>
        </label>
        <input
          className={styles.textfield}
          type="email"
          id="email"
          name="email"
          maxLength={CONTACT_MAX_LENGTH.email}
        />
      </div>
      <div className={styles.item}>
        <label className={styles.label} htmlFor="message">
          メッセージ<span className={styles.required}>必須</span>
        </label>
        <textarea
          className={styles.textarea}
          id="message"
          name="message"
          maxLength={CONTACT_MAX_LENGTH.message}
        />
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
        <p className={styles.fileHint}>
          PDF・JPG・PNG・GIF・WebP（{CONTACT_MAX_FILE_SIZE_LABEL}以下）
        </p>
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
