import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Alert } from './ui/Alert';
import { useSendCommand } from '../hooks/useServerControl';
import {
  Save,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Send,
  Loader2,
} from 'lucide-react';

const quickCommands = [
  { cmd: 'save', label: '保存世界', icon: Save },
  { cmd: 'dawn', label: '黎明', icon: Sunrise },
  { cmd: 'noon', label: '中午', icon: Sun },
  { cmd: 'dusk', label: '黄昏', icon: Sunset },
  { cmd: 'midnight', label: '午夜', icon: Moon },
];

export function QuickActions() {
  const [message, setMessage] = useState('');
  const [pendingCmd, setPendingCmd] = useState<string | null>(null);
  const sendMutation = useSendCommand();

  const handleQuickCommand = (cmd: string) => {
    setPendingCmd(cmd);
    sendMutation.mutate(cmd, {
      onSettled: () => setPendingCmd(null),
    });
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setPendingCmd('say');
    sendMutation.mutate(`say ${message}`, {
      onSuccess: () => setMessage(''),
      onSettled: () => setPendingCmd(null),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">快捷操作</h3>

        {sendMutation.isSuccess && (
          <Alert variant="success">命令执行成功！</Alert>
        )}

        {sendMutation.isError && (
          <Alert variant="error">
            执行失败：{(sendMutation.error as Error).message}
          </Alert>
        )}

        <div className="flex flex-wrap gap-2">
          {quickCommands.map(({ cmd, label, icon: Icon }) => (
            <Button
              key={cmd}
              size="sm"
              variant="secondary"
              onClick={() => handleQuickCommand(cmd)}
              disabled={sendMutation.isPending}
              className="flex items-center gap-2"
            >
              {pendingCmd === cmd ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
              {label}
            </Button>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-200">
          <p className="text-sm font-medium text-slate-700 mb-2">发送消息</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入要广播的消息..."
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || sendMutation.isPending}
              className="flex items-center gap-2"
            >
              {pendingCmd === 'say' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              发送
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
