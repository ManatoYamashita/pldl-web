import styles from './index.module.css';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Sheet({ children, className }: Props) {
  const containerClass = className ? `${styles.container} ${className}` : styles.container;
  return <div className={containerClass}>{children}</div>;
}
