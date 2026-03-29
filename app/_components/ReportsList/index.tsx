import { Report } from '@/app/_libs/microcms';
import ReportsListItem from '../ReportsListItem';

type Props = {
  reports?: Report[];
};

export default function ReportsList({ reports }: Props) {
  if (!reports) {
    return null;
  }
  if (reports.length === 0) {
    return <p>活動レポートがありません。</p>;
  }
  return (
    <ul data-reports-list>
      {reports.map((report) => (
        <ReportsListItem key={report.id} report={report} />
      ))}
    </ul>
  );
}
