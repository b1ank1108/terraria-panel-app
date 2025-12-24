import { BackupTable } from '../components/BackupTable';

export function BackupPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">备份管理</h1>
      <BackupTable />
    </div>
  );
}
