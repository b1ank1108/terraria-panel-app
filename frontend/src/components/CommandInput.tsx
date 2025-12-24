import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Alert } from './ui/Alert';
import { useSendCommand } from '../hooks/useServerControl';
import { Send, Loader2 } from 'lucide-react';

export function CommandInput() {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const sendMutation = useSendCommand();

  const handleSend = () => {
    if (!command.trim()) return;

    sendMutation.mutate(command, {
      onSuccess: () => {
        setHistory((prev) => [command, ...prev].slice(0, 10));
        setCommand('');
      },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">发送命令</h3>

        {sendMutation.isSuccess && (
          <Alert variant="success">命令发送成功！</Alert>
        )}

        {sendMutation.isError && (
          <Alert variant="error">
            发送失败：{(sendMutation.error as Error).message}
          </Alert>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入服务器命令..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={handleSend}
            disabled={!command.trim() || sendMutation.isPending}
            className="flex items-center gap-2"
          >
            {sendMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            发送
          </Button>
        </div>

        {history.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">命令历史</p>
            <div className="space-y-1">
              {history.map((cmd, i) => (
                <button
                  key={i}
                  onClick={() => setCommand(cmd)}
                  className="block w-full text-left px-3 py-2 text-sm bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
