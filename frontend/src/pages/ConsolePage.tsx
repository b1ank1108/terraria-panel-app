import { QuickActions } from '../components/QuickActions';
import { LogViewer } from '../components/LogViewer';

export function ConsolePage() {
  return (
    <div className="space-y-6">
      <h1 className="terra-heading text-3xl">控制台</h1>
      <QuickActions />
      <LogViewer lineNum={300} autoRefresh={true} />
    </div>
  );
}
