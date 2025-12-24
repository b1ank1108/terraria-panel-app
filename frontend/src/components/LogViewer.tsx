import { useEffect, useRef, useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useLogs } from '../hooks/useLogs';
import { Pause, Play, ArrowDown, Loader2 } from 'lucide-react';

interface LogViewerProps {
  lineNum?: number;
  autoRefresh?: boolean;
}

export function LogViewer({ lineNum = 200, autoRefresh = true }: LogViewerProps) {
  const [paused, setPaused] = useState(false);
  const { data, isLoading } = useLogs(lineNum, autoRefresh && !paused);
  const logEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!paused && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data?.logs, paused]);

  const scrollToBottom = () => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">服务器日志</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setPaused(!paused)}
            className="flex items-center gap-2"
          >
            {paused ? (
              <>
                <Play className="w-4 h-4" />
                继续
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                暂停
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={scrollToBottom}
            className="flex items-center gap-2"
          >
            <ArrowDown className="w-4 h-4" />
            跳到底部
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : data?.logs && data.logs.length > 0 ? (
          <>
            {data.logs.map((log, i) => (
              <div key={i} className="whitespace-pre-wrap break-words">
                {log}
              </div>
            ))}
            <div ref={logEndRef} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            暂无日志
          </div>
        )}
      </div>

      {data?.count !== undefined && (
        <p className="text-sm text-slate-500 mt-2">
          共 {data.count} 条日志
        </p>
      )}
    </Card>
  );
}
