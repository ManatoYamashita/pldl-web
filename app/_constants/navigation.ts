// ヘッダーのナビゲーション項目（デスクトップとモバイルメニューで共有する）
export const NAV_ITEMS = [
  { href: '/about', label: '私たちについて' },
  { href: '/activities', label: '活動内容' },
  { href: '/support', label: '支援する' },
  { href: '/recruit', label: '参加する' },
] as const;

export const CONTACT_NAV_ITEM = { href: '/contact', label: 'お問い合わせ' } as const;

/**
 * pathname が href のページ、またはその配下のページかどうかを返す。
 * 例: href が `/activities` なら `/activities/xxx` や `/activities/p/2` も現在地として扱う。
 */
export function isCurrentPath(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}
