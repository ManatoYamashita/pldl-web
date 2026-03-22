import styles from './index.module.css';

type Props = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export default function Sheet({ children, className, id }: Props) {
  const containerClass = className ? `${styles.container} ${className}` : styles.container;
  return <div id={id} className={containerClass}>{children}</div>;
}
