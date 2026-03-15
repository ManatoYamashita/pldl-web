import styles from './page.module.css';

export default function Page() {
  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>第1条（個人情報の定義）</h2>
        <p className={styles.text}>
          本プライバシーポリシーにおいて「個人情報」とは、個人情報保護法に定める個人情報を指し、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、メールアドレスその他の記述等により特定の個人を識別できるもの、及び個人識別符号が含まれるものをいいます。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>第2条（個人情報の収集方法）</h2>
        <p className={styles.text}>
          当団体は、以下の方法により個人情報を収集することがあります。
        </p>
        <ul className={styles.list}>
          <li>お問い合わせフォームからのご連絡</li>
          <li>イベント・ワークショップへの参加申込</li>
          <li>メールマガジンの登録</li>
          <li>寄付・支援のお申し込み</li>
          <li>採用・ボランティアへの応募</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>第3条（個人情報の利用目的）</h2>
        <p className={styles.text}>
          当団体が個人情報を収集・利用する目的は、以下のとおりです。
        </p>
        <ul className={styles.list}>
          <li>活動内容やイベントのご案内</li>
          <li>お問い合わせへの回答・対応</li>
          <li>イベント・ワークショップの運営・連絡</li>
          <li>寄付・支援に関する管理・ご報告</li>
          <li>採用・ボランティアに関する選考・連絡</li>
          <li>当団体の活動に関する統計・分析（個人を特定しない形で使用）</li>
          <li>その他、当団体の事業運営に必要な範囲での利用</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>第4条（利用目的の変更）</h2>
        <p className={styles.text}>
          当団体は、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。利用目的の変更を行った場合には、変更後の目的について当団体ウェブサイト上に公表するものとします。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>第5条（個人情報の第三者提供）</h2>
        <p className={styles.text}>
          当団体は、以下の場合を除き、あらかじめご本人の同意を得ることなく、第三者に個人情報を提供することはありません。
        </p>
        <ul className={styles.list}>
          <li>法令に基づく場合</li>
          <li>
            人の生命、身体または財産の保護のために必要がある場合であって、ご本人の同意を得ることが困難であるとき
          </li>
          <li>
            公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、ご本人の同意を得ることが困難であるとき
          </li>
          <li>
            国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、ご本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>第6条（個人情報の安全管理）</h2>
        <p className={styles.text}>
          当団体は、個人情報の正確性及び安全性を確保するために、セキュリティに十分な対策を講じるとともに、個人情報の漏えい、滅失またはき損の防止その他の個人情報の安全管理のために必要かつ適切な措置を講じます。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          第7条（お子様の個人情報について）
        </h2>
        <p className={styles.text}>
          当団体は、子どもの学びや遊びに関する活動を行うNPO法人として、お子様の個人情報の取り扱いには特に配慮いたします。
        </p>
        <ul className={styles.list}>
          <li>
            18歳未満のお子様の個人情報を収集する場合は、保護者の同意を得た上で収集いたします。
          </li>
          <li>
            イベント等で撮影した写真・動画をウェブサイトやSNS等で使用する場合は、事前に保護者の同意を得るものとします。
          </li>
          <li>
            保護者からお子様の個人情報の開示・訂正・削除の請求があった場合は、速やかに対応いたします。
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          第8条（Cookie（クッキー）の使用）
        </h2>
        <p className={styles.text}>
          当団体のウェブサイトでは、お問い合わせフォームの機能向上やアクセス分析のためにCookieを使用しています。Cookieとは、ウェブサイトがお使いのブラウザに送信する小さなテキストデータです。ブラウザの設定によりCookieの受け取りを拒否することができますが、その場合、一部のサービスがご利用いただけない場合があります。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          第9条（個人情報の開示・訂正・削除）
        </h2>
        <p className={styles.text}>
          ご本人または保護者から個人情報の開示・訂正・追加・削除・利用停止を求められた場合には、ご本人であることを確認した上で、合理的な期間内に対応いたします。ご請求は下記のお問い合わせ先までご連絡ください。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          第10条（プライバシーポリシーの変更）
        </h2>
        <p className={styles.text}>
          本プライバシーポリシーの内容は、法令その他本プライバシーポリシーに別段の定めのある事項を除いて、ご本人に通知することなく変更することができるものとします。当団体が別途定める場合を除いて、変更後のプライバシーポリシーは、当団体ウェブサイトに掲載したときから効力を生じるものとします。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>お問い合わせ先</h2>
        <dl className={styles.contactInfo}>
          <dt>団体名</dt>
          <dd>NPO法人 Playful Learning Design Lab.（PLDL）</dd>
          <dt>代表理事</dt>
          <dd>尾池咲季子</dd>
          <dt>所在地</dt>
          <dd>〒379-2313 群馬県みどり市笠懸町鹿3616-1</dd>
          <dt>メールアドレス</dt>
          <dd>pldl@ldl.cocotte.jp</dd>
        </dl>
      </section>

      <p className={styles.enactmentDate}>2026年3月15日 制定</p>
    </div>
  );
}
