import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import styles from './index.module.css';

type Props = {
  href: string;
  children: React.ReactNode;
  isExternal?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
};

export default function ButtonLink({
  href,
  children,
  isExternal = false,
  variant = 'primary'
}: Props) {
  const showArrow = variant === 'primary' || variant === 'secondary';

  const buttonClass = `${styles.button} ${
    variant === 'primary' ? styles.buttonPrimary :
    variant === 'secondary' ? styles.buttonSecondary :
    variant === 'outline' ? styles.buttonOutline :
    styles.buttonText
  }`;

  if (isExternal) {
    return (
      <a
        href={href}
        className={buttonClass}
        target="_blank"
        rel="noopener"
      >
        <span className={styles.buttonContent}>{children}</span>
        {showArrow && <ArrowRight className={styles.arrow} size={20} aria-hidden="true" />}
      </a>
    );
  }

  return (
    <Link href={href} className={buttonClass}>
      <span className={styles.buttonContent}>{children}</span>
      {showArrow && <ArrowRight className={styles.arrow} size={20} aria-hidden="true" />}
    </Link>
  );
}
