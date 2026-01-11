import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useServerStatus } from '../hooks/useServerStatus';
import { useStartServer, useSendCommand } from '../hooks/useServerControl';
import { Play, Square, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const worldSizeMap: Record<string, string> = {
  small: '小型',
  medium: '中型',
  large: '大型',
};

const difficultyMap: Record<string, string> = {
  classic: '经典',
  expert: '专家',
  master: '大师',
  journey: '旅程',
};

function InfoItem({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-white">{value || '-'}</p>
    </div>
  );
}

export function ServerStatusCard() {
  const { data: status, isLoading } = useServerStatus();
  const startMutation = useStartServer();
  const sendCommand = useSendCommand();
  const queryClient = useQueryClient();

  const handleStart = () => {
    startMutation.mutate();
  };

  const handleStop = () => {
    sendCommand.mutate('exit', {
      onSuccess: () => {
        // 立即刷新服务器状态以精确反映停止状态
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['serverStatus'] });
        }, 1000); // 给服务器一点时间来处理停止命令
      },
    });
  };

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400 mb-1">服务器状态</p>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-terra-gold" />
              <span className="text-lg text-slate-300">加载中...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-3 h-3 rounded-full ${
                    sendCommand.isPending
                      ? 'bg-yellow-500'
                      : status?.running
                      ? 'bg-terra-green'
                      : 'bg-terra-red'
                  }`}
                />
                <p className="text-2xl font-bold text-white">
                  {sendCommand.isPending
                    ? '停止中...'
                    : status?.running
                    ? '运行中'
                    : '已停止'
                  }
                </p>
              </div>
              <p className="text-sm text-slate-400">
                {sendCommand.isPending
                  ? '正在通过 exit 命令停止服务器'
                  : status?.status
                }
              </p>
            </>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            disabled={status?.running || startMutation.isPending || isLoading}
            onClick={handleStart}
            className="flex items-center gap-2"
          >
            {startMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            启动
          </Button>
          <Button
            variant="secondary"
            disabled={!status?.running || sendCommand.isPending || isLoading}
            onClick={handleStop}
            className="flex items-center gap-2"
          >
            {sendCommand.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            停止
          </Button>
        </div>
      </div>

      {status?.info && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-terra-wood-dark">
          <InfoItem label="端口" value={status.info.port} />
          <InfoItem label="最大玩家" value={status.info.maxPlayers} />
          <InfoItem label="世界名称" value={status.info.worldName} />
          <InfoItem
            label="世界大小"
            value={worldSizeMap[status.info.worldSize] || status.info.worldSize}
          />
          <InfoItem
            label="难度"
            value={difficultyMap[status.info.difficulty] || status.info.difficulty}
          />
        </div>
      )}
    </Card>
  );
}
