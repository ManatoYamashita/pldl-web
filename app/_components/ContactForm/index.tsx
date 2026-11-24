'use client';
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import {
  CONTACT_ATTRIBUTE_OPTIONS,
  CONTACT_MAX_FILE_SIZE,
  CONTACT_MAX_FILE_SIZE_LABEL,
  CONTACT_MAX_LENGTH,
  type ContactField,
} from '@/app/_constants/contact';
import styles from './index.module.css';

type FormState =
  | { status: 'idle' }
  | { status: 'success' }
  // attempt は同じ文面のエラーが続いても読み上げ直させるために、表示要素の key に使う
  | { status: 'error'; message: string; field?: ContactField; attempt: number };

async function submitContact(prev: FormState, formData: FormData): Promise<FormState> {
  const attempt = prev.status === 'error' ? prev.attempt + 1 : 1;
  // 上限を超えるファイルは Vercel が API に届く前に JSON ではない 413 で弾くため、送信前に止める
  const file = formData.get('file');
  if (file instanceof File && file.size > CONTACT_MAX_FILE_SIZE) {
    return {
      status: 'error',
      message: `ファイルサイズは${CONTACT_MAX_FILE_SIZE_LABEL}以下にしてください`,
      field: 'file',
      attempt,
    };
  }
  try {
    const res: { status: string; message?: string; field?: ContactField } = await fetch(
      '/api/submit-contact',
      { method: 'POST', body: formData },
    ).then((r) => r.json());
    if (res.status === 'error') {
      return {
        status: 'error',
        message: res.message ?? '送信に失敗しました。もう一度お試しください。',
        field: res.field,
        attempt,
      };
    }
    return { status: 'success' };
  } catch {
    return { status: 'error', message: '送信に失敗しました。もう一度お試しください。', attempt };
  }
}

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, { status: 'idle' });
  const [attribute, setAttribute] = useState('');
  const [fileName, setFileName] = useState('');
  const successRef = useRef<HTMLParagraphElement>(null);

  const error = state.status === 'error' ? state : null;

  useEffect(() => {
    if (state.status === 'success') {
      // 送信ボタンを含むフォームごと消えてフォーカスが body に落ちるため、お礼の文へ移す
      successRef.current?.focus();
    } else if (state.status === 'error' && state.field) {
      // 項目に結びつくエラーは、その項目へフォーカスを移すことで aria-describedby のエラー文を読み上げさせる
      document.getElementById(state.field)?.focus();
    }
  }, [state]);

  // <form action> に関数を渡すと、React は結果にかかわらず送信後にフォームをリセットし、
  // エラーのときも入力と添付が消える。それを避けるため onSubmit から送る
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // 送信中のボタンは disabled にしない（フォーカスが body に落ちる）ので、二重送信はここで止める
    if (isPending) return;
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

  const isInvalid = (name: ContactField) => (error?.field === name ? true : undefined);

  const describedBy = (name: ContactField, ...ids: string[]) => {
    const all = error?.field === name ? [...ids, `${name}-error`] : ids;
    return all.length > 0 ? all.join(' ') : undefined;
  };

  const fieldError = (name: ContactField) =>
    error?.field === name ? (
      <p id={`${name}-error`} className={styles.fieldError}>
        {error.message}
      </p>
    ) : null;

  if (state.status === 'success') {
    return (
      <p ref={successRef} tabIndex={-1} className={styles.success}>
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
            autoComplete="family-name"
            required
            maxLength={CONTACT_MAX_LENGTH.lastname}
            aria-invalid={isInvalid('lastname')}
            aria-describedby={describedBy('lastname')}
          />
          {fieldError('lastname')}
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
            autoComplete="given-name"
            required
            maxLength={CONTACT_MAX_LENGTH.firstname}
            aria-invalid={isInvalid('firstname')}
            aria-describedby={describedBy('firstname')}
          />
          {fieldError('firstname')}
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
          required
          value={attribute}
          onChange={(e) => setAttribute(e.target.value)}
          aria-invalid={isInvalid('attribute')}
          aria-describedby={describedBy('attribute')}
        >
          <option value="">選択してください</option>
          {CONTACT_ATTRIBUTE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {fieldError('attribute')}
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
            required
            maxLength={CONTACT_MAX_LENGTH.attributeOther}
            placeholder="具体的にご記入ください"
            aria-invalid={isInvalid('attributeOther')}
            aria-describedby={describedBy('attributeOther')}
          />
          {fieldError('attributeOther')}
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
          autoComplete="email"
          spellCheck={false}
          required
          maxLength={CONTACT_MAX_LENGTH.email}
          aria-invalid={isInvalid('email')}
          aria-describedby={describedBy('email')}
        />
        {fieldError('email')}
      </div>
      <div className={styles.item}>
        <label className={styles.label} htmlFor="message">
          メッセージ<span className={styles.required}>必須</span>
        </label>
        <textarea
          className={styles.textarea}
          id="message"
          name="message"
          required
          maxLength={CONTACT_MAX_LENGTH.message}
          aria-invalid={isInvalid('message')}
          aria-describedby={describedBy('message')}
        />
        {fieldError('message')}
      </div>
      <div className={styles.item}>
        <p className={styles.label} id="file-group-label">
          添付ファイル<span className={styles.optional}>任意</span>
        </p>
        <div className={styles.fileInputWrapper}>
          {/* 隣接セレクタでラベルにフォーカスリングを出すため、input をラベルより前に置く */}
          <input
            className={styles.fileInput}
            type="file"
            id="file"
            name="file"
            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
            aria-labelledby="file-group-label file-label"
            aria-describedby={describedBy('file', 'file-name', 'file-hint')}
            aria-invalid={isInvalid('file')}
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
          />
          <label className={styles.fileLabel} htmlFor="file" id="file-label">
            ファイルを選択
          </label>
          <span className={styles.fileName} id="file-name">
            {fileName || '選択されていません'}
          </span>
        </div>
        <p className={styles.fileHint} id="file-hint">
          PDF・JPG・PNG・GIF・WebP（{CONTACT_MAX_FILE_SIZE_LABEL}以下）
        </p>
        {fieldError('file')}
      </div>
      <div className={styles.actions}>
        {/* 項目に結びつかないエラー（送信の失敗など）だけを知らせる。後から文を入れても読み上げられるよう、領域は常に置いておく */}
        <div role="alert">
          {error && !error.field && (
            <p key={error.attempt} className={styles.error}>
              {error.message}
            </p>
          )}
        </div>
        <input
          type="submit"
          value={isPending ? '送信中...' : '送信する'}
          aria-disabled={isPending || undefined}
          className={styles.button}
        />
      </div>
    </form>
  );
}
