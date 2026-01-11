import { BackupTable } from '../components/BackupTable';

export function BackupPage() {
  return (
    <div className="space-y-6">
      <h1 className="terra-heading text-3xl">备份管理</h1>
      <BackupTable />
    </div>
  );
}
