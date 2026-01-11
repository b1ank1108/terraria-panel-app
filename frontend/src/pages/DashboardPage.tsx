import { ServerStatusCard } from '../components/ServerStatusCard';
import { LogViewer } from '../components/LogViewer';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="terra-heading text-3xl">仪表盘</h1>
      <ServerStatusCard />
      <LogViewer lineNum={100} autoRefresh={true} />
    </div>
  );
}
