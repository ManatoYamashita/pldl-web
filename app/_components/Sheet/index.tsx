import styles from './index.module.css';

type Props = {
  children: React.ReactNode;
  className?: string;
  id?: string;
} & React.ComponentPropsWithoutRef<'div'>;

export default function Sheet({ children, className, id, ...rest }: Props) {
  const containerClass = className ? `${styles.container} ${className}` : styles.container;
  return <div id={id} className={containerClass} {...rest}>{children}</div>;
}
