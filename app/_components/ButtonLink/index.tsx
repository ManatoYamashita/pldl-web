import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import styles from './index.module.css';

type Variant = 'primary' | 'secondary' | 'outline' | 'text' | 'dark';

const VARIANT_CONFIG: Record<Variant, { className: string; showArrow: boolean }> = {
  primary: { className: styles.buttonPrimary, showArrow: true },
  secondary: { className: styles.buttonSecondary, showArrow: true },
  outline: { className: styles.buttonOutline, showArrow: false },
  text: { className: styles.buttonText, showArrow: false },
  dark: { className: styles.buttonDark, showArrow: true },
};

type Props = {
  href: string;
  children: React.ReactNode;
  isExternal?: boolean;
  variant?: Variant;
};

export default function ButtonLink({
  href,
  children,
  isExternal = false,
  variant = 'primary',
}: Props) {
  const { className, showArrow } = VARIANT_CONFIG[variant];
  const buttonClass = `${styles.button} ${className}`;

  const content = (
    <>
      <span className={styles.buttonContent}>{children}</span>
      {showArrow && <ArrowRight className={styles.arrow} size={20} aria-hidden="true" />}
    </>
  );

  if (isExternal) {
    return (
      <a href={href} className={buttonClass} target="_blank" rel="noopener">
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={buttonClass}>
      {content}
    </Link>
  );
}
