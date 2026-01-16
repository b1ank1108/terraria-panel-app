import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Alert } from './ui/Alert';
import { useBackups, useRestoreBackup, useDeleteBackup } from '../hooks/useBackups';
import { RotateCcw, Trash2, Loader2, Database } from 'lucide-react';

export function BackupTable() {
  const { data, isLoading } = useBackups();
  const restoreMutation = useRestoreBackup();
  const deleteMutation = useDeleteBackup();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleRestore = (path: string) => {
    if (confirm('确定要恢复此备份吗？当前世界数据将被覆盖。')) {
      restoreMutation.mutate(path);
    }
  };

  const handleDelete = (path: string) => {
    setConfirmDelete(path);
  };

  const confirmDeleteAction = () => {
    if (confirmDelete) {
      deleteMutation.mutate(confirmDelete, {
        onSuccess: () => {
          setConfirmDelete(null);
        },
      });
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN');
  };

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">备份列表</h3>
          {data?.count !== undefined && (
            <span className="text-sm text-slate-400">共 {data.count} 个备份</span>
          )}
        </div>

        {restoreMutation.isSuccess && (
          <Alert variant="success">备份恢复成功！</Alert>
        )}

        {restoreMutation.isError && (
          <Alert variant="error">
            恢复失败：{(restoreMutation.error as Error).message}
          </Alert>
        )}

        {deleteMutation.isSuccess && (
          <Alert variant="success">备份删除成功！</Alert>
        )}

        {deleteMutation.isError && (
          <Alert variant="error">
            删除失败：{(deleteMutation.error as Error).message}
          </Alert>
        )}

        {confirmDelete && (
          <Alert variant="warning">
            <div className="flex items-center justify-between">
              <span>确定要删除此备份吗？此操作不可撤销。</span>
              <div className="flex gap-2 ml-4">
                <Button
                  size="sm"
                  variant="danger"
                  onClick={confirmDeleteAction}
                  disabled={deleteMutation.isPending}
                >
                  确认删除
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setConfirmDelete(null)}
                >
                  取消
                </Button>
              </div>
            </div>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : data?.backups && data.backups.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-terra-wood-dark">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-200">
                    文件名
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-200">
                    大小
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-200">
                    修改时间
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-200">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.backups.map((backup) => (
                  <tr key={backup.path} className="border-b border-terra-wood-dark/30 hover:bg-terra-bg-light/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-white font-mono">
                      {backup.fileName}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-300">
                      {formatSize(backup.fileSize)}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-300">
                      {formatDate(backup.createTime)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleRestore(backup.path)}
                          disabled={restoreMutation.isPending}
                          className="flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          恢复
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(backup.path)}
                          disabled={deleteMutation.isPending}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          删除
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <Database className="w-12 h-12 mb-2" />
            <p>暂无备份文件</p>
          </div>
        )}
      </div>
    </Card>
  );
}
