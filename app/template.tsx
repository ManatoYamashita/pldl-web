import styles from './template.module.css';

type Props = { children: React.ReactNode };

export default function Template({ children }: Props) {
  return <div className={styles.wrapper}>{children}</div>;
}
