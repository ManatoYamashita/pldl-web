// 各事業の詳細ページ（/activities?category=<事業カテゴリ>）で表示する紹介コンテンツ。
// 出典: PLDL 提供の会社紹介資料（HP.pptx）。microCMS のカテゴリ名をキーに保持する。

/** 特徴カード1件 */
export type BusinessFeature = {
  title: string;
  description: string;
};

/** 特徴カードのグループ（例: 「3つの育み」「3本柱」） */
export type BusinessFeatureGroup = {
  heading: string;
  items: BusinessFeature[];
};

/** 実施フローの1ステップ */
export type BusinessFlowStep = {
  title: string;
  description: string;
};

/** 実施フロー全体 */
export type BusinessFlow = {
  heading: string;
  steps: BusinessFlowStep[];
};

/** 画像（next/image 用に寸法を明示し CLS を防ぐ） */
export type BusinessImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** 「デザインする学びの場」など、事業が手がける領域の1件（任意で画像付き） */
export type BusinessScopeItem = {
  title: string;
  description: string;
  image?: BusinessImage;
};

/** 事業が手がける領域のグループ */
export type BusinessScope = {
  heading: string;
  items: BusinessScopeItem[];
};

/** セクション末尾の行動喚起（CTA） */
export type BusinessCta = {
  label: string;
  href: string;
};

/** 事業詳細コンテンツ */
export type BusinessDetail = {
  /** microCMS カテゴリ名（表示条件のキーと一致させる） */
  name: string;
  /** 英語サブコピー（任意） */
  subEn?: string;
  /** キャッチコピー（見出し） */
  tagline: string;
  /** リード文（段落単位で配列に格納） */
  lead: string[];
  /** リード画像（あれば画像＋テキストの2カラムでヘッダーを描画） */
  image?: BusinessImage;
  /** 特徴カードグループ（任意） */
  featureGroups?: BusinessFeatureGroup[];
  /** 事業が手がける領域（任意。画像付きカードで描画） */
  scope?: BusinessScope;
  /** 実施フロー（任意） */
  flow?: BusinessFlow;
  /** セクション末尾の CTA（任意） */
  cta?: BusinessCta;
};

// カテゴリ名 → 事業詳細コンテンツ
export const BUSINESS_DETAILS: Record<string, BusinessDetail> = {
  放課後こどもラボ事業: {
    name: '放課後こどもラボ事業',
    subEn: 'Creative Learning ↔ Playful Learning',
    tagline: '創造的な学びから、ワクワクする学びへ',
    lead: [
      '放課後こどもラボの活動は「創造的な学び」を軸に設計されています。プロジェクト活動や制作などの創造的な学びを通じて、学ぶことに夢中になったり、好奇心が生まれたり、ワクワクする学びへとつなげていきます。',
    ],
    featureGroups: [
      {
        heading: 'こどもたちの生きる力を育む活動',
        items: [
          {
            title: '自分で考える',
            description:
              'ささいなことでも自分で考えて行動する・答えを出せるように、こどもたちにはたらきかけます。',
          },
          {
            title: '色々な子・大人と関わる／リーダーになる',
            description:
              'すべての活動にリーダーの役割があります。役割・責任がこどもの成長を育み、異年齢で遊ぶ・活動する文化を醸成。様々な大人との関わりをつくります。',
          },
          {
            title: '得意を頑張る／興味を伸ばす',
            description:
              'ひとつのプロジェクトの中で、自分のできることでチームに貢献してもらいます。こどもたちの興味を伸ばす手助けをします。',
          },
        ],
      },
      {
        heading: '放課後こどもラボの3本柱',
        items: [
          {
            title: '自分で考える平日の遊び',
            description:
              '平日は宿題が終われば自由時間。「今日何して遊ぶ？」という言葉が飛び交い、遊びが生まれます。こどもたちが自分で考え、主体的に遊ぶ平日です。',
          },
          {
            title: 'みんなでやり抜くプロジェクト活動',
            description:
              '長期休みは個人・グループでプロジェクト活動。アニメ・劇・映画制作などは学年を縦断したチームでやり抜きます。キャンプやイベントも、こどもたちが主体で実行します。',
          },
          {
            title: '責任と自信を育むリーダー制',
            description:
              'すべてのイベント・プロジェクト活動にはリーダーがいます。リーダーを中心に制作や準備が進み、リーダー経験を通じて責任感が生まれ、やり遂げた時には自信がつきます。',
          },
        ],
      },
    ],
  },

  出張ワークショップ事業: {
    name: '出張ワークショップ事業',
    subEn: 'Original Workshop',
    tagline: '好奇心と創造力を育む、オリジナルワークショップ',
    lead: [
      'PLDLでは、ご要望に合わせてオリジナルのワークショップを企画します。「ワクワクすること・創造的なこと」を大切に、夢中になれるワークショップをみなさんにお届けします。',
    ],
    flow: {
      heading: 'ワークショップ 計画・実施の流れ',
      steps: [
        {
          title: 'ヒアリング',
          description: 'テーマ・対象者など、基本情報をヒアリングします。',
        },
        {
          title: '企画',
          description: 'ヒアリング内容に合わせて、ワークショップを企画します。',
        },
        {
          title: '実施準備',
          description: '企画に合わせて、タイムスケジュールや道具を準備します。',
        },
        {
          title: '実施',
          description: 'ワークショップを実施。進行のすべてを行います。',
        },
      ],
    },
  },

  空間設計事業: {
    name: '空間設計事業',
    subEn: 'Learning Environment Design',
    tagline: '学びをたすける、学習環境デザイン',
    lead: [
      'PLDLでは、小学校から大学までの教育機関から、図書館・地域の拠点などの公共施設まで、様々な学習環境をデザインします。',
      'またこどもたちと場をつくる、こども主体の空間ワークショップも実施しています。',
    ],
    image: {
      src: '/photos/kids-floor-plan-design.webp',
      alt: 'こどもたちが学習環境の平面図をデザインする様子',
      width: 1440,
      height: 1920,
    },
    scope: {
      heading: 'デザインする学びの場',
      items: [
        {
          title: '教育機関の学習環境',
          description:
            '小学校から大学まで、こどもたちの学びを促す空間をデザインします。',
          image: {
            src: '/photos/children-desk-writing-group.webp',
            alt: '教室で机に向かい学ぶこどもたち',
            width: 1920,
            height: 1440,
          },
        },
        {
          title: '公共施設・地域の拠点',
          description:
            '図書館や地域の拠点など、人が集い学ぶ場をデザインします。',
          image: {
            src: '/photos/kids-reading-together.webp',
            alt: '本を読み合うこどもたち',
            width: 1440,
            height: 1920,
          },
        },
        {
          title: 'こども主体の空間ワークショップ',
          description:
            'こどもたちと場をつくる、参加型の空間づくりを実施します。',
          image: {
            src: '/photos/kids-illustrated-cards-floor.webp',
            alt: '床にカードを並べて場をつくるこどもたち',
            width: 1440,
            height: 1920,
          },
        },
      ],
    },
    flow: {
      heading: '学習環境デザイン 企画・設計の流れ',
      steps: [
        {
          title: 'ヒアリング',
          description: '対象となる空間に関するヒアリングを実施します。',
        },
        {
          title: '企画・基本設計',
          description:
            'ヒアリング内容を元に、空間の企画・ゾーニング・レイアウトなどの基本設計を行います。',
        },
        {
          title: '各種デザイン',
          description:
            'インテリアや家具デザインなど、実施設計に向けてのデザインをします。',
        },
        {
          title: '実施設計',
          description: '設計事務所と共同で、実施設計を行います。',
        },
      ],
    },
    cta: {
      label: '学習環境デザインのご相談',
      href: '/contact',
    },
  },
};
