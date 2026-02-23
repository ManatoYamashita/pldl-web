import Image from 'next/image';
import { getMembersList } from '@/app/_libs/microcms';
import styles from './page.module.css';
import ButtonLink from '@/app/_components/ButtonLink';

type Props = {
  searchParams: Promise<{
    dk: string;
  }>;
};

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const data = await getMembersList({
    draftKey: searchParams.dk,
  });
  return (
    <div className={styles.container}>
      {data.contents.length === 0 ? (
        <p className={styles.empty}>メンバーが登録されていません。</p>
      ) : (
        <ul>
          {data.contents.map((member) => (
            <li key={member.id} className={styles.list}>
              {member.thumbnail && (
                <Image
                  src={member.thumbnail.url}
                  alt=""
                  width={member.thumbnail.width}
                  height={member.thumbnail.height}
                  className={styles.image}
                />
              )}
              <dl>
                <dt className={styles.name}>{member.name}</dt>
                <dd className={styles.position}>{member.description}</dd>
              </dl>
            </li>
          ))}
        </ul>
      )}
      <div className={styles.footer}>
        <h2 className={styles.message}>We are hiring</h2>
        <p>私たちは共にチャレンジする仲間を募集しています。</p>
        <ButtonLink href="/recruit">採用情報へ</ButtonLink>
      </div>
    </div>
  );
}
